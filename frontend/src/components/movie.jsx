import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './movie_hover.css';

function Movie({ movie }) {
  const [hover, setHover] = useState(false);
  // Parse the release_date string into a Date object
  const releaseDate = new Date(movie.release_date);
  // Format the release_date to display the day and the name of the month in English
  const formattedReleaseDate = releaseDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'});
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
  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  return (
    <div className="App-movie"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    >
      <img src={posterUrl} alt={movie.title} onClick={handleClick} />
      {hover && (
        <div className="movie-info-hover">
          <p className="movie-title-hover">{movie.title}</p>
          <p className="movie-release-date-hover">Released: {formattedReleaseDate}</p>
        </div>
      )}
    </div>
  );
}

export default Movie;