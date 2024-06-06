import * as React from 'react';

function ActorsImageList  ({images} ){
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', overflowX: 'auto', alignItems: 'center',  }}>
      {images.map((image) => (
        <div key={image.id_actor} style={{ justifyContent: "center", textAlign: 'center',}}>
          <img
            src={`https://image.tmdb.org/t/p/w300/${image.image}`}
            alt={image.actor_name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <p style={{ textAlign: 'center' }}>{image.actor_name}</p>
        </div>
      ))}
    </div>
  );
};

export default ActorsImageList;
