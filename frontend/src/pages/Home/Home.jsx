import logo from './logo.svg';
import { useEffect, useState } from 'react';
import { useFetchMovies } from './useFetchmovies';
import Movie from '../../components/movie';
import './Home.css';

function Home() {
  const [movieName, setMovieName] = useState("");
  const { movies} = useFetchMovies();
  // console.log('Movies:', movies);
  // console.log(Object.values(movies).filter((el = Object.values(movies)) => el.title.includes("G")))

  return (
    <div className="App">
      <header className="App-header">
        Top Films
      </header>
      <input
      value = {movieName}
      onChange = {(event) => setMovieName(event.target.value )}/>
      {Object.values(movies).filter((el = Object.values(movies)) => el.title.toLowerCase().includes(movieName.toLowerCase())).length > 0 ? (
      <ul className='App-movies'>
        {Object.values(movies).filter((el = Object.values(movies)) => el.title.toLowerCase().includes(movieName.toLowerCase())).map((movie, index) => (
          <Movie key={index} movie={movie}/>
          
        ))}
      </ul>
      ):(
      <p>No results found for {movieName}</p>
      )}
    </div>
  );
}

export default Home;
