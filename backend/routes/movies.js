import express from 'express';
import { In } from 'typeorm';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
import Actor from '../entities/actor.js';
import getRecommendationForUser from '../recommendation.js';

const router = express.Router();
const movieRepository = appDataSource.getRepository(Movie);

router.get('/recommend', async (req, res) => {
  try {
    const recommended_movie_ids = await getRecommendationForUser(
      req.query.id_user
    );
    const recommendation = await movieRepository.find({
      where: { id_movie: In(recommended_movie_ids) },
      relations: ['movie_genre'],
    });
    const movie_id_to_order = new Map();
    for (let i = 0; i < recommended_movie_ids.length; i++) {
      movie_id_to_order.set(recommended_movie_ids[i], i);
    }
    recommendation.sort(function (a, b) {
      if (
        movie_id_to_order.get(a.id_movie) < movie_id_to_order.get(b.id_movie)
      ) {
        return -1;
      } else {
        return 1;
      }
    });
    res.json(recommendation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/cast', async (req, res) => {
  const id_movie = parseInt(req.query.id_movie);
  console.log({ id_movie });
  if (isNaN(id_movie)) {
    return res.status(400).send({ error: 'Invalid movie ID' });
  }

  try {
    const movie = await movieRepository.findOne({
      where: { id_movie: id_movie },
      relations: ['actors'],
    });
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
  console.log({ id_movie });
  if (isNaN(id_movie)) {
    return res.status(400).send({ error: 'Invalid movie ID' });
  }

  try {
    const movie = await movieRepository.findOne({
      where: { id_movie: id_movie },
      relations: ['movie_genre'],
    });
    if (movie) {
      res.status(200).json(movie.movie_genre);
    } else {
      res.status(404).json({ error: 'Movie not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allMovies = await movieRepository.find();
    res.json(allMovies);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/movies-with-genres', async (req, res) => {
  console.log('helo');
  try {
    // Fetch all movies with their genres
    const movies = await movieRepository.find({ relations: ['movie_genre'] });

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies with genres:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/movie', async (req, res) => {
  console.log('helo');
  try {
    console.log(req.query.id_movie);
    const allMovies = await movieRepository.findOne({
      where: { id_movie: req.query.id_movie },
    });
    res.json(allMovies);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/:movieId', async (req, res) => {
  try {
    const idMovie = await movieRepository.find({
      where: {
        id_movie: req.params.movieId,
      },
    });
    if (idMovie.length != 0) {
      res.status(200).json({
        message: 'HTTP 200 OK',
        movie: idMovie,
      });
    } else {
      res.status(404).json({
        message: 'HTTP 404 Not Found',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.delete('/:movieId', function (req, res) {
  movieRepository
    .delete({ id_movie: req.params.movieId })
    .then(function () {
      res.status(200).json({ message: 'HTTP 200 OK' });
    })
    .catch(function () {
      res.status(404).json({ message: 'HTTP 404 Not Found' });
    });
});

router.post('/new', async (req, res) => {
  try {
    console.log(req.body);

    const newMovie = movieRepository.create({
      id_movie: req.body.id_movie,
      title: req.body.title,
      release_date: req.body.release_date,
      description: req.body.description,
      trailer: req.body.trailer,
      image: req.body.image,
      rating_tmdb: req.body.rating_tmdb,
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

export default router;
