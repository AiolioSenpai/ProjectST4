import { useEffect, useState } from 'react';
import axios from 'axios';
// import { API_KEY } from './config.js';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const [cast, setCast] = useState([]);


  const fetchMovies = () => {

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/movies-with-genres`)
      .then((response) => {
        
        setMovies(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const fetchCast = (movieId) => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/cast?id=${movieId}`)
      .then((response) => {
        setCast(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };



  // fetch movies on component mount
  useEffect(() => {
    fetchMovies(), fetchCast;
  }, []);

  return { movies, cast };
}