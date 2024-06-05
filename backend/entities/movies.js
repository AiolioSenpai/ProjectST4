import typeorm, { Any } from 'typeorm';

const MovieDB = new typeorm.EntitySchema({
  name: 'MovieDB',
  columns: {
    id_movie: {
      primary: true,
      type: Number,
    },
    title: {
      type: String,
    },
    release_date: { 
      type: String
     },
    trailer: { 
      type: String
     },
     image: { 
      type: String
     },rating_tmdb:{
      type:String    }
     ,
  },
  relations: {
    movie_genre: {
      type: 'many-to-many',
      target: 'Genre',
      joinTable: {
          name: 'movie_genre', // Name of the join table
          joinColumn: { name: 'id_movie', referencedColumnName: 'id_movie' },
          inverseJoinColumn: { name: 'id_genre', referencedColumnName: 'id_genre' },
      },
  },
    actors: {
      type: 'many-to-many',
      target: 'Actor',
      joinTable: {
          name: 'cast', // Name of the join table
          joinColumn: { name: 'id_movie', referencedColumnName: 'id_movie' },
          inverseJoinColumn: { name: 'id_actor', referencedColumnName: 'id_actor' },
      }
  },
  movies_rates: {
    type: 'one-to-many',
    target: 'rating',
    inverseSide: 'Movie',
},
  }
}
);

export default MovieDB;
