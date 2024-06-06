import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import RatingButtons from '../../components/RatingButtons/RatingButtons';
import ActorsImageList from '../../components/ActorsImageList/ActorsImageList';
import { useFetchMovies } from '../Home/useFetchmovies.js';
import './movieDetails.css';

function MovieDetails() {
  console.log('hello');
  const { movieId } = useParams();
  const userId = localStorage.getItem('user_id');
  //console.log(id);
  const [movie, setMovie] = useState(null);
  const [genre, setGenre] = useState(null);
  const [cast, setCast] = useState(null);
  const { movies } = useFetchMovies(userId);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  useEffect(() => {
    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/movies/movie/?id_movie=${movieId}`
      )
      .then((response) => {
        console.log(response.data);
        setMovie(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/movies/genre/?id_movie=${movieId}`
      )
      .then((response) => {
        console.log(response.data);
        setGenre(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL}/movies/cast/?id_movie=${movieId}`
      )
      .then((response) => {
        console.log(response.data);
        setCast(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // const foundMovie = movies.find(m => m.id === parseInt(id));
    // setMovie(foundMovie);
    console.log(movie);
  }, [movieId, movies]);
  //   }, [id, movies]);

  if (!movie || !cast || !genre) {
    return <div>Loading...</div>;
  }
  console.log(thumbsUpClicked);
  console.log(thumbsDownClicked);

  const handleThumbsUp = (movie) => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
        id_user: userId,
        id_movie: movie.id_movie,
        rate: 1,
      })
      .then(() => {
        setThumbsUpClicked(true);
      });

    console.log('Thumbs up clicked');
  };

  const handleThumbsDown = () => {
    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
        id_user: userId,
        id_movie: movie.id_movie,
        rate: -1,
      })
      .then(() => {
        setThumbsDownClicked(true);
      });
    console.log('Thumbs down clicked');
  };

  return (
    <div className="movie-details">
      <div className="movie-header">
        <h1 className="movie-title">{movie.title}</h1>
        <span className="movie-vote">
          <FontAwesomeIcon icon={faStar} className="star-icon" />{' '}
          {movie.rating_tmdb}
        </span>
      </div>
      <div className="movie-content">
        <div className="movie-media">
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w300${movie.image}`}
            alt={movie.title}
          />
          <div className="movie-trailer">
            <h3>Trailer :</h3>
            <iframe
              width="1024"
              height="720"
              src={`https://www.youtube.com/embed/${movie.trailer}`} //${movie.trailer_key}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="movie-rate">
          <RatingButtons
            onThumbsUp={() => handleThumbsUp(movie)}
            onThumbsDown={() => handleThumbsDown(movie)}
            thumbsUpClicked={thumbsUpClicked}
            thumbsDownClicked={thumbsDownClicked}
          />
        </div>
        <div className="movie-info">
          <p className="movie-overview">{movie.description}</p>
          <p className="movie-release-date">
            Date de sortie : {movie.release_date}
          </p>
          <div className="movie-actors">
            <h3>Acteurs :</h3>
          </div>
          <ActorsImageList images={cast} />
          <div className="movie-genres">
            <div className="genres-list">
              <h3 className="genres-word">Genres :</h3>
              {genre.map((genreOfMovie) => (
                <span key={genreOfMovie.id_genre} className="genre-tag">
                  {genreOfMovie.genre_type}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
