import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchGenres() {

  const [genresSuggestions,setGenresSuggestions]=useState([])


  const fetchGenres = () => {
  axios
  .get(`${import.meta.env.VITE_BACKEND_URL}/genres/`)
  .then((response) => {
    setGenresSuggestions(
      response.data.map((genre) => ({
        id: genre.id_genre.toString(),
        text: genre.genre_type,
      })).filter((genre)=> (genre.text!="Horro")&&(genre.text!="drama"))
    )
    console.log(genresSuggestions)
          })
    .catch((error) => {
      console.log(error)
    });
}


  // fetch movies on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  return { genresSuggestions };
}