import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

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


router.post('/new', async (req, res) => {
  try {
      console.log(req.body);

      const newMovie = movieRepository.create({
          title: req.body.title,
          release_date: req.body.release_date,
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
        id: req.params.movieId,
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
  
    movieRepository.delete({ id: req.params.movieId })
    .then(function () {
      res.status(200).json({ message: 'HTTP 200 OK' });
    })
    .catch(function () {
      res.status(404).json({ message: 'HTTP 404 Not Found' });
    });
});

export default router;