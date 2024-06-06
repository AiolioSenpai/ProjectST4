import { useEffect, useState } from 'react';
import axios from 'axios';
// import { API_KEY } from './config.js';

export function useFetchCast({ movieId }) {
  const [cast, setCast] = useState([]);



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
    fetchCast;
  }, []);

  return {cast };
}