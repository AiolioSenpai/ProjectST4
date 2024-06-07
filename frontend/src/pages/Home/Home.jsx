import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { WithContext as ReactTagInput } from 'react-tag-input';
import { useFetchMovies } from './useFetchmovies';
import { useFetchGenres } from './useFetchGenres';
import Movie from '../../components/movie';

import 'primereact/resources/themes/saga-blue/theme.css'; // PrimeReact theme
import 'primereact/resources/primereact.min.css'; // PrimeReact core CSS
import 'primeicons/primeicons.css'; // PrimeIcons
import './Home.css';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const id_user = localStorage.getItem('user_id');
  const { movies } = useFetchMovies(id_user);
  const { genresSuggestions } = useFetchGenres();
  const navigate = useNavigate();
  const [displayedMovies, setDisplayedMovies] = useState(36);
  const moviesToDisplay = Object.values(movies).slice(0, displayedMovies);

  console.log(movies);
  const [tags, setTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    setFilteredSuggestions(
      genresSuggestions.filter(
        (genre) => !tags.find((tag) => tag.text === genre.text)
      )
    );
  }, [genresSuggestions, tags]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    // Find the corresponding movie object based on the search query
    const matchingMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchingMovies.length > 0) {
      navigate(`/movieDetails/${matchingMovies[0].id_movie}`);
      //navigate(`/movieDetails/${matchingMovies[0].id}`);
      navigate(`/movieDetails/${matchingMovies[0].id_movie}`);
    }
  };

  // Filter dropdown options based on search query
  const dropdownOptions = movies
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((movie) => ({
      label: movie.title,
      value: movie.title,
    }));

  const handleDropdownChange = (e) => {
    setSearchQuery(e.value);
    const selectedMovie = movies.find((movie) => movie.title === e.value);
    if (selectedMovie) {
      console.log(selectedMovie.id);
      navigate(`/movieDetails/${selectedMovie.id_movie}`);
      navigate(`/movieDetails/${selectedMovie.id_movie}`);
    }
  };
  const handleLoadMore = () => {
    // Increment the number of displayed movies by 6
    setDisplayedMovies((prevDisplayedMovies) => prevDisplayedMovies + 36);
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
          options={dropdownOptions}
          onChange={handleDropdownChange}
          editable
          placeholder="Rechercher un film..."
        />
        <div>
          {/* <TagsInput
        value={tags}
        onChange={setTags}
        name="Genre"
        placeHolder="enter Genre"
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
        {/* <Button 
          label="Rechercher" 
          icon="pi pi-search" 
          onClick={handleSearchSubmit}
          className="p-button-outlined"
        /> */}
      </div>
      <div className="Movie-Grid">
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
                  movie.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) &&
                  tags.every((element) =>
                    movie.movie_genre.some(
                      (e) => parseInt(e.id_genre) === parseInt(element.id)
                    )
                  )
              )
              .map((movie, index) => (
                <Movie key={index} movie={movie} />
              ))}
          </ul>
        ) : (
          <p>No results found for {searchQuery}</p>
        )}
        {displayedMovies < Object.values(movies).length && (
          <Button
            label="Load More"
            onClick={handleLoadMore}
            className="p-button-outlined"
          />
        )}
      </div>
    </div>
  );
}

export default Home;
