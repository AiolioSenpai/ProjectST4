import { appDataSource } from './datasource.js';
import axios from 'axios';
import Movie from './entities/movies.js';

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

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

    const movies = await fetchMoviesFromApi();
    const filteredMovies = movies.map(movie => ({
      id : movie.id,
      title: movie.title,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      poster_path: movie.poster_path,
      genre_ids : movie.genre_ids,
      overview: movie.overview

    }));
    console.log(filteredMovies);

    const movieRepository = appDataSource.getRepository(Movie);
    const newMovies = movieRepository.create(filteredMovies);
    await movieRepository.insert(newMovies);
    console.log('Movies have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
   }  finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }
}

seedDatabase();
