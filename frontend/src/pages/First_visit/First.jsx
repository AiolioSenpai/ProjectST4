import { useEffect, useState } from 'react';
import { useFetchMovies } from '../Home/useFetchmovies';
import Add_favourite from '../../components/add_favourite';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primeicons/primeicons.css'; // PrimeIcons
import './first.css';

function First() {
  const [searchQuery, setSearchQuery] = useState("");
  const { movies } = useFetchMovies();
  const [ratedMoviesCount, setRatedMoviesCount] = useState(0);
  const user = { id_user: 1 };
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's ratings when the component mounts
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/ratings`, {
        params: { id_user: user.id_user },
      })
      .then((response) => {
        setRatedMoviesCount(response.data.length);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.id_user]);

  const handleRedirect = () => {
    navigate('/home');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRatingChange = (isAdding) => {
    // Update the count whenever a rating changes
    setRatedMoviesCount(prevCount => isAdding ? prevCount + 1 : prevCount - 1);
  };

  const handleSearchSubmit = () => {
    // Find the corresponding movie object based on the search query
    const matchingMovies = Object.values(movies).filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

 // Filter dropdown options based on search query
  const dropdownOptions = Object.values(movies)
  .filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
  .map(movie => ({
    label: movie.title,
    value: movie.title,
   }));

  const handleDropdownChange = (e) => {
    setSearchQuery(e.value); // Update search query based on selected movie title
    const selectedMovie = Object.values(movies).find(movie => movie.title === e.value);
  };


  return (
    <div className="App">
      <header className="App-header">
        Parmi ces films proposés, choisissez 7 films que vous préférez:
      </header>
      <div>
        <Dropdown 
          className='custom-dropdown'
          value={searchQuery}
          options={dropdownOptions} 
          onChange={handleDropdownChange} 
          editable 
          placeholder="Rechercher un film..." 
        />
        <Button 
          label="Rechercher" 
          icon="pi pi-search" 
          onClick={handleSearchSubmit}
          className="p-button-outlined"
        />
      </div>
      {Object.values(movies).filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
        <ul className='App-movies'>
          {Object.values(movies).filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase())).map((movie, index) => (
            <Add_favourite 
            key={index} 
            movie={movie} 
            user={user} 
            onRatingChange={handleRatingChange}
            ratedMoviesCount={ratedMoviesCount}/>
          ))}
        </ul>
      ) : (
        <p>Pas de résultats trouvés pour {searchQuery}</p>
      )}
      {ratedMoviesCount >= 7 && (
      <Button 
        label="Done" 
        onClick={handleRedirect}
        className="p-button-success top-right-button"
      />
    )}
    </div>
  );
}

export default First;
