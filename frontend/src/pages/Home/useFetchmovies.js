import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from './config.js';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);


  const fetchmovies = () => {
    axios
    .get('https://api.themoviedb.org/3/movie/top_rated', {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      })
    .then((response) => {
      setMovies(response.data.results)
    })
    .catch((error) => {
      console.log(error)
    });
  };


  // fetch movies on component mount
  useEffect(() => {
    fetchmovies();
  }, []);

  return { movies };
}