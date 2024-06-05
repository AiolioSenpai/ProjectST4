import typeorm from 'typeorm';

const Genre = new typeorm.EntitySchema({
  name: 'Genre',
  columns: {
    id_genre: {
      primary: true,
      type: Number,
      generated: true,
    },
    genre_type: { type: String }
    
  },
  relations: {
    movie_genre: {
      type: 'many-to-many',
      target: 'Movie',
      joinTable: {
          name: 'movie_genre', // Name of the join table
          joinColumn: { name: 'id_genre', referencedColumnName: 'id_genre' },
          inverseJoinColumn: { name: 'id_movie', referencedColumnName: 'id_movie' },
      }
    }},
});

export default Genre;
