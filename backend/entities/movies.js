import typeorm, { Any } from 'typeorm';

const MovieDB = new typeorm.EntitySchema({
  name: 'MovieDB',
  columns: {
    id: {
      primary: true,
      type: Number,
    },
    title: {
      type: String,
    },
    vote_average: {
      type: "float",
    },
    poster_path: {
      type: String,
    },
    genre_ids: {
      type: "int",
      array: true,
    },
    overview: {
      type: String,
    },
    release_date: {
      type: String,
    },
  },
});

export default MovieDB;
