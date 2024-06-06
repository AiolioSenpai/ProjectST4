import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useFetchMovies } from './useFetchmovies';
import Movie from '../../components/movie';
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primeicons/primeicons.css'; // PrimeIcons
import './Home.css';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const id_user = localStorage.getItem('user_id');
  console.log(id_user, 'hiiii');
  const { movies } = useFetchMovies(id_user);
  const navigate = useNavigate();

  // console.log(moviess.data)
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    // Find the corresponding movie object based on the search query
    const matchingMovies = Object.values(movies).filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchingMovies.length > 0) {
      navigate(`/movieDetails/${matchingMovies[0].id_movie}`);
      //navigate(`/movieDetails/${matchingMovies[0].id}`);
    }
  };

  // Filter dropdown options based on search query
  const dropdownOptions = Object.values(movies)
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((movie) => ({
      label: movie.title,
      value: movie.title,
    }));

  const handleDropdownChange = (e) => {
    setSearchQuery(e.value); // Update search query based on selected movie title
    const selectedMovie = Object.values(movies).find(
      (movie) => movie.title === e.value
    );
    if (selectedMovie) {
      console.log(selectedMovie.id);
      navigate(`/movieDetails/${selectedMovie.id_movie}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">Welcome to MovieMuse</header>
      <div>
        <Dropdown
          className="custom-dropdown"
          value={searchQuery}
          options={dropdownOptions}
          onChange={handleDropdownChange}
          editable
          placeholder="Search for a movie..."
        />
        <Button
          label="Search"
          icon="pi pi-search"
          onClick={handleSearchSubmit}
          className="p-button-outlined"
        />
      </div>
      {Object.values(movies).filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).length > 0 ? (
        <ul className="App-movies">
          {Object.values(movies)
            .filter((movie) =>
              movie.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((movie, index) => (
              <Movie key={index} movie={movie} id_user={id_user} />
            ))}
        </ul>
      ) : (
        <p>No results found for {searchQuery}</p>
      )}
    </div>
  );
}

export default Home;
