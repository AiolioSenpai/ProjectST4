import express from 'express';
import { appDataSource } from '../datasource.js';
import User from '../entities/user.js';
import Movie from '../entities/movies.js';
import Rating from '../entities/rating.js';

const router = express.Router();
const userRepository = appDataSource.getRepository(User);
const movieRepository = appDataSource.getRepository(Movie);
const ratingRepository = appDataSource.getRepository(Rating);

router.get('/', function (req, res) {
  appDataSource
    .getRepository(User)
    .find({})
    .then(function (users) {
      res.json({ users: users });
    });
});

router.get('/home/:id_user', async (req, res) => {
  const userId = parseInt(req.params.id_user, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await userRepository.findOne({
      where: { id_user: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `Welcome home, ${user.firstname}`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: err.message,
    });
  }
});

router.get('/ratings', async (req, res) => {
  const userId = parseInt(req.query.id);
  console.log('Requested User ID:', userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await userRepository.findOne({
      where: { id_user: userId },
      relations: ['movies_rates', 'movies_rates.Movie_rate'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.movies_rates);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: err.message,
    });
  }
});

router.post('/ratings', async (req, res) => {
  const { id_user, id_movie, rate } = req.body;

  if (!id_user || !id_movie || !rate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await userRepository.findOne({ where: { id_user: id_user } });
    const movie = await movieRepository.findOne({
      where: { id_movie: id_movie },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const newRating = ratingRepository.create({
      id_user,
      id_movie,
      rate,
      user_rate: user,
      Movie_rate: movie,
    });

    await ratingRepository.save(newRating);

    res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
      details: err.message,
    });
  }
});

router.post('/new', function (req, res) {
  //const userRepository = appDataSource.getRepository(User);
  const newUser = userRepository.create({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  });

  userRepository
    .save(newUser)
    .then(function (savedUser) {
      res.status(201).json({
        message: 'User successfully created',
        id: savedUser.id,
      });
    })
    .catch(function (error) {
      console.error(error);
      if (error.code === '23505') {
        res.status(400).json({
          message: `User with email "${newUser.email}" already exists`,
        });
      } else {
        res.status(500).json({ message: 'Error while creating the user' });
      }
    });
});

router.delete('/:userId', function (req, res) {
  appDataSource
    .getRepository(User)
    .delete({ id_user: req.params.userId })
    .then(function () {
      res.status(204).json({ message: 'User successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
