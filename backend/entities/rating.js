import typeorm from 'typeorm';

const rating = new typeorm.EntitySchema({
  name: 'rating',
  columns: {
    id_movie: {
      primary: true,
      type: Number,
    },
    id_user: {
        primary: true,
        type: Number,
      },
      rate: {
        type: String,
      }
  },
  
  relations: {
    Movie_rate: {
        type: 'many-to-one',
        target: 'Movie',
        joinColumn: { name: 'id_movie' },
        inverseSide: 'rating',
    },
    user_rate: {
        type: 'many-to-one',
        target: 'User',
        joinColumn: { name: 'id_user' },
        inverseSide: 'rating',
    },
    
  }
}
);

export default rating;