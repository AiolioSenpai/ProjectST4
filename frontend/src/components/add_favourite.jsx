import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './favourite.css';

function Add_favourite({
  movie,
  user,
  onRatingChange,
  ratedMoviesCount,
  selectedMovies,
  setSelectedMovies,
}) {
  const [userRatings, setUserRatings] = useState([]);

  // Base URL for movie images
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

  // Size of the image
  const IMAGE_SIZE = 'w200';

  // Construct the full URL for the movie poster image
  const posterUrl = `${IMAGE_BASE_URL}${IMAGE_SIZE}${movie.image}`;

  useEffect(() => {
    // Fetch user's ratings when the component mounts
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
        params: { id_user: user.id_user },
      })
      .then((response) => {
        setUserRatings(response.data);
        // Check if the current movie is in the user's ratings
        const isMovieRated = response.data.some(
          (rating) => rating.id_movie === movie.id_movie
        );
        setSelectedMovies((prevState) => ({
          ...prevState,
          [movie.id_movie]: isMovieRated,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.id_user]);

  console.log(selectedMovies);

  const handleClick = () => {
    const isMovieRated = userRatings.some(
      (rating) => rating.id_movie === movie.id_movie
    );

    // Add the film to the users favourites
    if (isMovieRated) {
      // Remove the film from the user's favorites
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
          data: {
            id_user: user.id_user,
            id_movie: movie.id_movie,
          },
        })
        .then(() => {
          // Update the local state to reflect the removal
          setUserRatings((prevRatings) =>
            prevRatings.filter((rating) => rating.id_movie !== movie.id_movie)
          );
          setSelectedMovies((prevState) => ({
            ...prevState,
            [movie.id_movie]: false,
          }));
          onRatingChange(false); // Decrement the count
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
          id_user: user.id_user,
          id_movie: movie.id_movie,
          rate: 1,
        })
        .then(() => {
          // Update the local state to reflect the addition
          setUserRatings((prevRatings) => [
            ...prevRatings,
            { id_movie: movie.id_movie, rate: 1 },
          ]);
          setSelectedMovies((prevState) => ({
            ...prevState,
            [movie.id_movie]: true,
          }));
          onRatingChange(true); // Increment the count
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div>
      <img
        src={posterUrl}
        alt={movie.title}
        onClick={handleClick}
        className={!selectedMovies[movie.id_movie] ? 'gray-filter' : ''}
      />
    </div>
  );
}

export default Add_favourite;
