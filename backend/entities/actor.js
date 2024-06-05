import typeorm from 'typeorm';

const Actor = new typeorm.EntitySchema({
  name: 'Actor',
  columns: {
    id_actor: {
      primary: true,
      type: Number,
    },
    actor_name: { type: String },
    image: { type: String },
  },
  relations: {
    movie_rate: {
      type: 'many-to-many',
      target: 'Movie',
      joinTable: {
        name: 'cast', // Name of the join table
        joinColumn: { name: 'id_actor', referencedColumnName: 'id_actor' },
        inverseJoinColumn: {
          name: 'id_movie',
          referencedColumnName: 'id_movie',
        },
      },
    },
  },
});

export default Actor;
