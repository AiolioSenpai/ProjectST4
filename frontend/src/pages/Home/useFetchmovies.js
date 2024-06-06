import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_KEY } from './config.js';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);


  const fetchMovies = () => {

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
      .then((response) => {
        
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  // fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies };
}