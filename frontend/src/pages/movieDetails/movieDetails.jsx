import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useFetchMovies } from '../Home/useFetchmovies.js';
import './movieDetails.css'

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { movies } = useFetchMovies();

  useEffect(() => {
    const foundMovie = movies.find(m => m.id_movie === parseInt(id));
    setMovie(foundMovie);
  }, [id, movies]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-details">
            <div className="movie-header">
                <h1 className="movie-title">{movie.title}</h1>
                <span className="movie-vote">
                    <FontAwesomeIcon icon={faStar} className="star-icon" /> {movie.rating_tmdb}
                </span>
            </div>
            <div className="movie-content">
                <div className='movie-media'>
                <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${movie.image}`} alt={movie.title} />
                <div className="movie-trailer">
                        <h3>Trailer :</h3>
                        <iframe
                            width="1024"
                            height="720"
                            src={`https://www.youtube.com/embed/${movie.trailer}`} 
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <div className="movie-info">
                    <p className="movie-overview">{movie.description}</p>
                    <p className="movie-release-date">Date de sortie : {movie.release_date}</p>
                    {/* <div className="movie-actors">
                        <h3>Acteurs :</h3>
                        <ul>
                            {movie.actors.map((actor, index) => (
                                <li key={index}>{actor.actor_name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="movie-genres">
                        <div className="genres-list">
                        <h3 className='genres-word'>Genres :</h3>
                            <div className="genres-list">
                                    {movie.movie_genre.map((genre) => (
                                    <span key={genre.id_genre} className="genre-tag">
                                        {genre.genre_type}
                                    </span>
                            ))}
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
  );
}

export default MovieDetails;
