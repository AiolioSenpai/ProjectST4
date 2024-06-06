import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id_user: {
      primary: true,
      type: Number,
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
    password: { type: String },
  },
  relations: {
    movies_rates: {
        type: 'one-to-many',
        target: 'rating',
        inverseSide: 'user_rate',
    }
}
});

export default User;
