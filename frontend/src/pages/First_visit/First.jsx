import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { WithContext as ReactTagInput } from 'react-tag-input';

import axios from 'axios';
import Add_favourite from '../../components/add_favourite';
import { useFetchGenres } from '../Home/useFetchGenres';
import { useFetchMovies } from '../Home/useFetchmovies';
import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primeicons/primeicons.css'; // PrimeIcons
import './first.css';

function First() {
  const [searchQuery, setSearchQuery] = useState('');
  const Id_user = localStorage.getItem('user_id');
  const { movies } = useFetchMovies(Id_user);
  const { genresSuggestions } = useFetchGenres();
  const [ratedMoviesCount, setRatedMoviesCount] = useState(0);
  const [selectedMovies, setSelectedMovies] = useState({});
  const user = { id_user: Id_user };
  const [tags, setTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  console.log(genresSuggestions);
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const navigate = useNavigate();
  useEffect(() => {
    const initialSelectedMovies = {};
    Object.values(movies).forEach((movie) => {
      initialSelectedMovies[movie.id_movie] = false;
    });
    setSelectedMovies(initialSelectedMovies);
  }, [movies]);

  useEffect(() => {
    setFilteredSuggestions(
      genresSuggestions.filter(
        (genre) => !tags.find((tag) => tag.text === genre.text)
      )
    );
  }, [genresSuggestions, tags]);

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
    setRatedMoviesCount((prevCount) =>
      isAdding ? prevCount + 1 : prevCount - 1
    );
  };

  const handleSearchSubmit = () => {
    // Find the corresponding movie object based on the search query
    const matchingMovies = Object.values(movies).filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  console.log(tags);

  const handleAddition = (tag) => {
    if (
      filteredSuggestions.some((suggestion) => suggestion.text === tag.text)
    ) {
      setTags((prevTags) => [...prevTags, tag]);
      console.log(tags);
    }
    setShowSuggestions(false);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const onClearAll = () => {
    setTags([]);
  };

  const handleInputFocus = () => {
    setFilteredSuggestions(
      genresSuggestions.filter(
        (genre) => !tags.find((tag) => tag.text === genre.text)
      )
    );
  };

  const handleInputBlur = () => {
    setShowSuggestions(false);
  };

  const handleTagInputChange = (input) => {
    if (input) {
      setFilteredSuggestions(
        genresSuggestions.filter(
          (genre) =>
            genre.text.toLowerCase().includes(input.toLowerCase()) &&
            !tags.find((tag) => tag.text === genre.text)
        )
      );
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions(
        genresSuggestions.filter(
          (genre) => !tags.find((tag) => tag.text === genre.text)
        )
      );
      setShowSuggestions(true);
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
  };
  if (movies.length === 0) {
    return (
      <div className="App">
        <h1>Loading ...</h1>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        Please choose 7 movies you like from the list above :
      </header>
      <div>
        <Dropdown
          className="custom-dropdown"
          value={searchQuery}
          options={dropdownOptions}
          onChange={handleDropdownChange}
          editable
          placeholder="Rechercher un film..."
        />
        {/* <Button 
          label="Rechercher" 
          icon="pi pi-search" 
          onClick={handleSearchSubmit}
          className="p-button-outlined"
        /> */}
      </div>
      <div className="tag-input-wrapper">
        <ReactTagInput
          // className="custom-tags"
          tags={tags}
          // suggestions={genresSuggestions}
          delimiters={delimiters}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          inline
          inputFieldPosition="inline"
          autocomplete
          handleInputChange={handleTagInputChange}
          handleInputFocus={handleInputFocus}
          handleInputBlur={handleInputBlur}
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredSuggestions.map((genre, index) => (
              <div
                key={index}
                className="suggestion-item"
                onMouseDown={() => handleAddition(genre)}
              >
                {genre.text}
              </div>
            ))}
          </div>
        )}
      </div>
      {movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          tags.every((element) =>
            movie.movie_genre.some(
              (e) => parseInt(e.id_genre) === parseInt(element.id)
            )
          )
      ).length > 0 ? (
        <ul className="App-movies">
          {movies
            .filter(
              (movie) =>
                movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
                tags.every((element) =>
                  movie.movie_genre.some(
                    (e) => parseInt(e.id_genre) === parseInt(element.id)
                  )
                )
            )
            .map((movie, index) => (
              <Add_favourite
                key={index}
                movie={movie}
                user={user}
                onRatingChange={handleRatingChange}
                ratedMoviesCount={ratedMoviesCount}
                selectedMovies={selectedMovies}
                setSelectedMovies={setSelectedMovies}
              />
            ))}
        </ul>
      ) : (
        <p>No results for {searchQuery}</p>
      )}
      {ratedMoviesCount >= 7 ? (
        <Button
          label="Done"
          onClick={handleRedirect}
          className="p-button-success top-right-button"
        />
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default First;
