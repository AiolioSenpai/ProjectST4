import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetchMovies } from '../Home/useFetchmovies.js';
import './movieDetails.css'

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { movies } = useFetchMovies();

  useEffect(() => {
    const foundMovie = movies.find(m => m.id === parseInt(id));
    setMovie(foundMovie);
  }, [id, movies]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="movie-details">
            <h1 className="movie-title">{movie.title}</h1>
            <div className="movie-content">
                <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                <div className="movie-info">
                    <p className="movie-overview">{movie.overview}</p>
                    <p className="movie-release-date">Date de sortie : {movie.release_date}</p>
                    {/* <div className="movie-actors">
                        <h3>Acteurs :</h3>
                        <ul>
                            {movie.actors.map((actor, index) => (
                                <li key={index}>{actor.name}</li>
                            ))}
                        </ul>
                    </div> */}
                    <div className="movie-trailer">
                        <h3>Trailer :</h3>
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/PLl99DlL6b4`} //${movie.trailer_key}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div> 
                </div>
            </div>
        </div>
  );
}

export default MovieDetails;
