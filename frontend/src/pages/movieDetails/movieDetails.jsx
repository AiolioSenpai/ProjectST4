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
  const [rate, setRate] = useState(null);
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
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/users/rating/movie?id_movie=${id}&id_user=1`
      )
      .then((response) => {
        console.log(response.data);
        setRate(response.data.rate);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(rate);
    if (parseInt(rate) === 1) {
      setThumbsUpClicked(true);
    } else if (parseInt(rate) === -1) {
      setThumbsDownClicked(true);
    }

    // const foundMovie = movies.find(m => m.id === parseInt(id));
    // setMovie(foundMovie);
    console.log(movie);
  }, [movieId, movies, rate]);
  //   }, [id, movies]);

  if (!movie || !cast || !genre) {
    return <div>Loading...</div>;
  }
  console.log(thumbsUpClicked);
  console.log(thumbsDownClicked);

  const handleThumbsUp = (movie) => {
    if (!thumbsUpClicked) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
          id_user: userId,
          id_movie: movie.id_movie,
          rate: 1,
        })
        .then(() => {
          setThumbsUpClicked(true);
          setThumbsDownClicked(false);
        });

      console.log('Thumbs up clicked');
    } else {
      console.log(movie.id_movie);
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
          data: {
            id_user: userId,
            id_movie: movie.id_movie,
          },
        })
        .then(() => {
          setThumbsUpClicked(false);
          setThumbsDownClicked(false);
        });
    }
  };

  const handleThumbsDown = () => {
    if (!thumbsDownClicked) {
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
          id_user: userId,
          id_movie: movie.id_movie,
          rate: -1,
        })
        .then(() => {
          setThumbsDownClicked(true);
          setThumbsUpClicked(false);
        });
      console.log('Thumbs down clicked');
    } else {
      axios
        .delete(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
          data: {
            id_user: userId,
            id_movie: movie.id_movie,
          },
        })
        .then(() => {
          setThumbsUpClicked(false);
          setThumbsDownClicked(false);
        });
    }
  };
  // Format the release date
  const releaseDate = new Date(movie.release_date);
  const formattedReleaseDate = releaseDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="movie-details">
      <div className="movie-header">
        <h1 className="movie-titledets">{movie.title}</h1>
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
        <div className="movie-rate" style={{ gap: '10px' }}>
          <RatingButtons
            className="rating-button"
            onThumbsUp={() => handleThumbsUp(movie)}
            onThumbsDown={() => handleThumbsDown(movie)}
            thumbsUpClicked={thumbsUpClicked}
            thumbsDownClicked={thumbsDownClicked}
          />
        </div>
        <div className="movie-info">
          <p className="movie-release-date">
            Release Date: {formattedReleaseDate}
          </p>
          <p className="movie-overview">{movie.description}</p>
          <div className="movie-actors">
            <h3>Actors :</h3>
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
