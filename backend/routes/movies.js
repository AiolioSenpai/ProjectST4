import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
import Actor from '../entities/actor.js';

const router = express.Router();
const movieRepository = appDataSource.getRepository(Movie);



router.get('/', async (req, res) => {
  try {
    const allMovies = await  movieRepository.find()
    res.json(allMovies)
  
  } catch (err) {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error',
    });
}
});
router.get('/movie', async (req, res) => {
  try {
    console.log(req.query.id_movie)
    const allMovies = await  movieRepository.findOne({where: { id_movie:req.query.id_movie }})
    res.json(allMovies)
  } catch (err) {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error',
    });
}
});

router.get('/cast', async (req, res) => {
  const id_movie = parseInt(req.query.id_movie);
  console.log({id_movie}  )
  if (isNaN(id_movie)) {
      return res.status(400).send({ error: 'Invalid movie ID' });
  }

  try {
      const movie = await movieRepository.findOne({ where: { id_movie: id_movie }, relations: ['actors'] });
      if (movie) {
          res.status(200).json(movie.actors);
      } else {
          res.status(404).json({ error: 'Movie not found' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});  

router.get('/genre', async (req, res) => {
  const id_movie = parseInt(req.query.id_movie);
  console.log({id_movie}  )
  if (isNaN(id_movie)) {
      return res.status(400).send({ error: 'Invalid movie ID' });
  }

  try {
      const movie = await movieRepository.findOne({ where: { id_movie: id_movie }, relations: ['movie_genre'] });
      if (movie) {
          res.status(200).json(movie.movie_genre);
      } else {
          res.status(404).json({ error: 'Movie not found' });
      }
  } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});  

router.post('/new', async (req, res) => {
  try {
      console.log(req.body);

      const newMovie = movieRepository.create({
          id_movie:req.body.id_movie,
          title: req.body.title,
          release_date: req.body.release_date,
          description: req.body.description,
          trailer: req.body.trailer,
          image: req.body.image,
          rating_tmdb:req.body.rating_tmdb
      });

      await movieRepository.insert(newMovie);

      
      res.status(201).json({
          message: 'HTTP 201 Created',
          movie: newMovie,
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({
          message: 'Internal Server Error',
      });
  }
});

router.get('/:movieId', async (req, res) => {
  try {
    const idMovie = await  movieRepository.find({
      where: {
        id_movie: req.params.movieId,
      },
  })
  if (idMovie.length != 0) {
  res.status(200).json({
    message: 'HTTP 200 OK',
    movie: idMovie,
  })
} else {
  res.status(404).json({
    message: 'HTTP 404 Not Found',
  })
}
  } catch (err) {
      console.error(err);
      res.status(500).json({
          message: 'Internal Server Error',
      });
}})




router.delete('/:movieId', function (req, res) {
  
    movieRepository.delete({ id_movie: req.params.movieId })
    .then(function () {
      res.status(200).json({ message: 'HTTP 200 OK' });
    })
    .catch(function () {
      res.status(404).json({ message: 'HTTP 404 Not Found' });
    });
});

export default router;