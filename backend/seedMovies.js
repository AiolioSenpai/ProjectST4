import axios from 'axios';
import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';

const API_KEY =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo';

async function fetchMoviesFromApi() {
  const movieIdList = [];
  for (let i = 1; i <= 10; i++) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated?page=${i}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      for (let j = 0; j < response.data.results.length; j++) {
        movieIdList.push(response.data.results[j]['id']);
      }
      //return response.data.results;
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
    }
  }
  for (let i = 0; i < Math.min(10, movieIdList.length); i++) {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieIdList[i]}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      console.log([
        response.data.title,
        response.data.release_date,
        response.data.overview,
        response.data.genres,
      ]);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error;
    }
  }
}

//async function seedDatabase() {
/*try {
    // Initialize the data source
    await appDataSource.initialize();
    console.log('Data Source has been initialized!');

    const movies = await fetchMoviesFromApi();
    const filteredMovies = movies.map((movie) => ({
      title: movie.title,
      release_date: movie.release_date,
    }));
    console.log(filteredMovies);

    const movieRepository = appDataSource.getRepository(Movie);
    const newMovies = movieRepository.create(filteredMovies);
    await movieRepository.insert(newMovies);
    console.log('Movies have been successfully seeded.');
  } catch (err) {
    console.error('Error seeding the database:', err);
  } finally {
    // Destroy the data source to close the connection
    await appDataSource.destroy();
  }*/
//}

//seedDatabase();

fetchMoviesFromApi();
