import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id_movie: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
    },
    release_date: { 
      type: String
     },
     description:{
      type: String
     },
    trailer: { 
      type: String
     },
     image: { 
      type: String
     },
     rating_tmdb:{
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

export default Movie;
