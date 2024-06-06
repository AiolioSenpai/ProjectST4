// updateRatings.ts
import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import axios from 'axios';

async function fetchMovieRating(id) {
  try {
    const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo'; 
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}`, 
        {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      
    });

    const movie = response.data;
    
    return movie.vote_average;
  } catch (error) {
    console.error('Error fetching movie rating:', error);
    return null;
  }
}

async function updateRatings() {
  await appDataSource.initialize();

  const movieRepository = appDataSource.getRepository(Movie);

  try {
    const movies = await movieRepository.find();

    for (const movie of movies) {
      const newRating = await fetchMovieRating(movie.id_movie);
      if (newRating) {
        movie.rating_tmdb = newRating;
        await movieRepository.save(movie);
        console.log(`Rating updated successfully for movie: ${movie.title}`);
      }
    }
  } catch (error) {
    console.error('Error updating ratings:', error);
  } finally {
    await appDataSource.destroy();
  }
}

updateRatings();