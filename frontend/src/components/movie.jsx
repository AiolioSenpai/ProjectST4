import React from 'react';
import { useNavigate } from 'react-router-dom';

function Movie({ movie }) {

  const navigate = useNavigate();

    // Base URL for movie images
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

    // Size of the image you want (e.g., 'w500', 'original')
    const IMAGE_SIZE = 'w200';
    
    // Construct the full URL for the movie poster image
  const posterUrl = `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.image}`;

  const handleClick = () => {
    // Redirect to the movie details page
    navigate(`/movieDetails/${movie.id_movie}`);
  };

  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={posterUrl} alt={movie.title} onClick={handleClick} />
      <p>Date de sortie : {movie.release_date}</p>
    </div>
  );
}

export default Movie;