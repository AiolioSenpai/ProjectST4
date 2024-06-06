import { WithContext as ReactTagsInput, SEPARATORS } from "react-tag-input";
import React, { useState } from "react";


function get_genres(){
  const [genresSuggestions,setGenresSuggestions]=useState([])
  axios
  .get(`${import.meta.env.VITE_BACKEND_URL}/genres/`)
  .then((response) => {
    setGenresSuggestions(response)
          })
    .catch((error) => {
      console.log(error)
    });
}
function GenreTags(suggestions,tags,handleDelete,handleAddition,handleDrag,handleTagClick,onTagUpdate,onClearAll){
  return (
    <div className="app">
      <h1> React Tags Example </h1>
      <div>
        <ReactTagsInput
          tags={tags}
          suggestions={suggestions}
          separators={[SEPARATORS.ENTER, SEPARATORS.COMMA]}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          handleDrag={handleDrag}
          handleTagClick={handleTagClick}
          onTagUpdate={onTagUpdate}
          inputFieldPosition="bottom"
          editable
          clearAll
          onClearAll={onClearAll}
          maxTags={18}
          allowAdditionFromPaste
        />
      </div>
    </div>
  );
}
export default GenreTags;
