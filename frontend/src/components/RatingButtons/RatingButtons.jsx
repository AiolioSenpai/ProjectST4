import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

const RatingButtons = ({onThumbsUp, onThumbsDown }) => {
  return (
    <div style={{display:'flex' ,top: '10px', right: '10px',alignItems:"start" }}>
        <button
          onClick={onThumbsUp}
          style={{
            backgroundColor: 'green',
            borderRadius: '50%', // Make button fully round
            width: '40px', // Set width and height to create a circle
            height: '40px',
            border: 'none', // Remove default button border
            padding: 0, // Remove default button padding
            cursor: 'pointer', // Show pointer cursor on hover
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FontAwesomeIcon icon={faThumbsUp} style={{ color: 'white' }} />
        </button>
        <button
          onClick={onThumbsDown}
          style={{
            backgroundColor: 'red',
            borderRadius: '50%', // Make button fully round
            width: '40px', // Set width and height to create a circle
            height: '40px',
            border: 'none', // Remove default button border
            padding: 0, // Remove default button padding
            cursor: 'pointer', // Show pointer cursor on hover
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FontAwesomeIcon icon={faThumbsDown} style={{ color: 'white' }} />
        </button>
      </div>

  );
};

export default RatingButtons;
