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
  for (let i = 0; i < movieIdList.length; i++) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieIdList[i]}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      moviesData.push({
        id_movie: response.data.id,
        title: response.data.title,
        release_date: response.data.release_date,
        description: response.data.overview,
        image: response.data.poster_path,
        genres: response.data.genres,
        rating_tmdb: response.data.popularity,
      });
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieIdList[i]}/videos`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      let link_suffix = '';
      if (response.data.results.length === 0) {
        moviesData.pop();
        continue;
      } else {
        link_suffix = response.data.results[0]['key'];
        for (let j = 0; j < response.data.results.length; j++) {
          if (
            response.data.results[j]['name'].toLowerCase().includes('trailer')
          ) {
            link_suffix = response.data.results[j]['key'];
            break;
          }
        }
        moviesData[moviesData.length - 1].trailer = link_suffix;
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieIdList[i]}/credits`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      const newResponse = [];
      for (let j = 0; j < response.data.cast.length; j++) {
        if (response.data.cast[j].profile_path !== null) {
          newResponse.push(response.data.cast[j]);
        }
      }
      const cast = newResponse.slice(0, Math.min(5, newResponse.length));
      if (cast.length === 0) {
        moviesData.pop();
        continue;
      }
      moviesData[moviesData.length - 1].cast = [];
      for (let j = 0; j < cast.length; j++) {
        moviesData[moviesData.length - 1].cast.push({
          id_actor: cast[j].id,
          actor_name: cast[j].name,
          image: cast[j].profile_path,
        });
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
    }
  }
  const uniqueArr = [];

  for (let i = 0; i < moviesData.length; i++) {
    let found = 0;
    for (let j = 0; j < uniqueArr.length; j++) {
      if (uniqueArr[j].id_movie === moviesData[i].id_movie) {
        found = 1;
      }
    }
    if (found === 0) {
      uniqueArr.push(moviesData[i]);
    }
  }

  return uniqueArr;
}

function extractGenresFromMovies(moviesData) {
  const genres = [];
  const id_to_genre = new Map();
  for (let i = 0; i < moviesData.length; i++) {
    for (let j = 0; j < moviesData[i].genres.length; j++) {
      //genres.push();
      id_to_genre.set(moviesData[i].genres[j].id, moviesData[i].genres[j].name);
    }
  }
  for (const [key, value] of id_to_genre) {
    genres.push({ id_genre: key, genre_type: value });
  }

  return genres;
}

function extractMovieGenre(moviesData) {
  const movieGenres = [];
  for (let i = 0; i < moviesData.length; i++) {
    for (let j = 0; j < moviesData[i].genres.length; j++) {
      movieGenres.push({
        id_movie: moviesData[i].id_movie,
        id_genre: moviesData[i].genres[j].id,
      });
    }
  }

  return movieGenres;
}
function extractMovieCast(moviesData) {
  const movieActors = [];
  for (let i = 0; i < moviesData.length; i++) {
    for (let j = 0; j < moviesData[i].cast.length; j++) {
      movieActors.push({
        id_movie: moviesData[i].id_movie,
        id_actor: moviesData[i].cast[j].id_actor,
      });
    }
  }

  return movieActors;
}

function extractActorsFromMovies(movies) {
  const actors = [];
  const id_to_actor = new Map();
  for (let i = 0; i < movies.length; i++) {
    for (let j = 0; j < movies[i].cast.length; j++) {
      //genres.push();
      id_to_actor.set(movies[i].cast[j].id_actor, [
        movies[i].cast[j].actor_name,
        movies[i].cast[j].image,
      ]);
    }
  }
  for (const [key, value] of id_to_actor) {
    if (value[1] !== undefined) {
      actors.push({ id_actor: key, actor_name: value[0], image: value[1] });
    }
  }

  return actors;
}

async function seedMoviesDB(movies) {
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
    console.log('Actors have been successfully seeded.');
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
