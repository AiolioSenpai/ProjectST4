import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import Genre from './entities/genres.js';
import Actor from './entities/actor.js';

const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

async function fetchMoviesFromApi() {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    // Initialize the data source
    await appDataSource.initialize();
    console.log('Data Source has been initialized!');

    const filteredMovies = movies.map((movie) => ({
      id_movie: movie.id_movie,
      title: movie.title,
      release_date: movie.release_date,
      trailer: movie.trailer,
      image: movie.image,
      rating_tmdb: movie.rating_tmdb,
      description: movie.description,
    }));
    const movieRepository = appDataSource.getRepository(Movie);
    const newMovies = movieRepository.create(filteredMovies);
    await movieRepository.insert(newMovies);
    console.log('Movies have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }
}
async function seedGenresDB(movies) {
  try {
    // Initialize the data source
    await appDataSource.initialize();
    console.log('Data Source has been initialized!');

    const genres = extractGenresFromMovies(movies);
    const genreRepository = appDataSource.getRepository(Genre);
    const newGenres = genreRepository.create(genres);
    await genreRepository.insert(newGenres);
    console.log('Genres have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }
}
async function add_movie_genres(pairs) {
  const movieRepository = appDataSource.getRepository(Movie);
  const genreRepository = appDataSource.getRepository(Genre);

  const movieMap = new Map();

  // Organize actors by movie
  for (const pair of pairs) {
    if (!movieMap.has(pair.id_movie)) {
      movieMap.set(pair.id_movie, []);
    }
    movieMap.get(pair.id_movie).push(pair.id_genre);
  }

  // Process each movie
  for (const [movieId, genresIds] of movieMap) {
    const movie = await movieRepository.findOne({
      where: { id_movie: movieId },
      relations: ['movie_genre'],
    });
    if (movie) {
      const genres = await genreRepository.findByIds(genresIds);
      movie.movie_genre = [...new Set([...movie.movie_genre, ...genres])]; // Use Set to avoid duplicates
      await movieRepository.save(movie);
    }
  }
}
async function seedMovieGenreDB(movies) {
  try {
    // Initialize the data source
    await appDataSource.initialize();
    console.log('Data Source has been initialized!');
    const movieGenreTable = extractMovieGenre(movies);
    await add_movie_genres(movieGenreTable);
    console.log('Movies have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }
}
async function add_actors(pairs) {
  const movieRepository = appDataSource.getRepository(Movie);
  const actorRepository = appDataSource.getRepository(Actor);

  const movieMap = new Map();

  // Organize actors by movie
  for (const pair of pairs) {
    if (!movieMap.has(pair.id_movie)) {
      movieMap.set(pair.id_movie, []);
    }
    movieMap.get(pair.id_movie).push(pair.id_actor);
  }

  // Process each movie
  for (const [movieId, actorsIds] of movieMap) {
    const movie = await movieRepository.findOne({
      where: { id_movie: movieId },
      relations: ['actors'],
    });
    if (movie) {
      const actors = await actorRepository.findByIds(actorsIds);
      movie.actors = [...new Set([...movie.actors, ...actors])]; // Use Set to avoid duplicates
      await movieRepository.save(movie);
    }
  }
}
async function seedMovieCastDB(movies) {
  try {
    // Initialize the data source
    await appDataSource.initialize();
    console.log('Data Source has been initialized!');
    const movieActorTable = extractMovieCast(movies);
    await add_actors(movieActorTable);
    console.log('Casts have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }
}
async function seedActorsDB(movies) {
  try {
    // Initialize the data source
    await appDataSource.initialize();
    console.log('Data Source has been initialized!');
    const actors = extractActorsFromMovies(movies);
    const actorRepository = appDataSource.getRepository(Actor);
    const newActors = actorRepository.create(actors);
    await actorRepository.insert(newActors);
    console.log('Movies have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }
}

async function seedDatabase() {
  const movies = await fetchMoviesFromApi();
  await seedGenresDB(movies);
  await seedMoviesDB(movies);
  await seedMovieGenreDB(movies);
  await seedActorsDB(movies);
  await seedMovieCastDB(movies);
}

seedDatabase();
