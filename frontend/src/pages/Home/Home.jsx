import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchMovies } from './useFetchmovies';
import { useFetchGenres } from './useFetchGenres';
import { Button } from 'primereact/button';
import Movie from '../../components/movie';
import { Dropdown } from 'primereact/dropdown';

import { WithContext as ReactTagInput } from 'react-tag-input';

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
  const [searchQuery, setSearchQuery] = useState("");
  const { movies } = useFetchMovies();
  const { genresSuggestions } = useFetchGenres();
  const navigate = useNavigate();
  const [displayedMovies, setDisplayedMovies] = useState(36); 
  const moviesToDisplay = Object.values(movies).slice(0, displayedMovies);

  console.log(movies)
  const [tags, setTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // Reset displayedMovies to its initial value when the component mounts
  useEffect(() => {
    setDisplayedMovies(36);
  }, []);

  useEffect(() => {
    setFilteredSuggestions(genresSuggestions.filter(
      (genre) => !tags.find((tag) => tag.text === genre.text)
    ));
  }, [genresSuggestions, tags]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    const matchingMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchingMovies.length > 0) {
      navigate(`/movieDetails/${matchingMovies[0].id_movie}`);
    }
  };

  const dropdownOptions = movies
    .filter(movie => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(movie => ({
      label: movie.title,
      value: movie.title,
    }));

  const handleDropdownChange = (e) => {
    setSearchQuery(e.value);
    const selectedMovie = movies.find(movie => movie.title === e.value);
    if (selectedMovie) {
      navigate(`/movieDetails/${selectedMovie.id_movie}`);
    }
  };
  const handleLoadMore = () => {
    // Increment the number of displayed movies by 6
    setDisplayedMovies(prevDisplayedMovies => prevDisplayedMovies + 36);
  };

  const handleDelete = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  console.log(tags)

  const handleAddition = (tag) => {
    if (filteredSuggestions.some(suggestion => suggestion.text === tag.text)) {
      setTags((prevTags) => [...prevTags, tag]);
      console.log(tags)
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
    console.log("The tag at index " + index + " was clicked");
  };

  const onClearAll = () => {
    setTags([]);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
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
      <header className="App-header">
        Welcome to MovieMuse
      </header>
      <div>
        <Dropdown 
          className='custom-dropdown'
          value={searchQuery}
          options={dropdownOptions} 
          onChange={handleDropdownChange} 
          editable 
          placeholder="Search a movie..." 
        />
        <div>
      {/* <TagsInput
        value={tags}
        onChange={setTags}
        name="Genre"
        placeHolder="enter Genre"
      /> */}
    </div>
        <div className="tag-input-wrapper" style={{ zIndex: 1000 }}>
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
            placeholder="Choose from the available genres"
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
      {moviesToDisplay.filter(movie => 
      (
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()))&&
        (tags.every(element => movie.movie_genre.some(e => parseInt(e.id_genre) === parseInt(element.id))))
    ).length > 0 ? (
        <ul className='App-movies'>
          {
          moviesToDisplay.filter(
            movie => (movie.title.toLowerCase().includes(searchQuery.toLowerCase()))&&
        (tags.every(element => movie.movie_genre.some(e => parseInt(e.id_genre) === parseInt(element.id))))).map((movie, index) => (

            <Movie key={index} movie={movie}/>
          ))}
        </ul>
      ) : (
        <p>Pas de résultats trouvés pour {searchQuery}</p>
      )}
      {displayedMovies < Object.values(movies).length && ( 
        <Button label="Load More" onClick={handleLoadMore} className="p-button-outlined" />
      )}
    </div>
  );
}

export default Home;
