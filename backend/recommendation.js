import { appDataSource } from './datasource.js';
import Movie from './entities/movies.js';
import Genre from './entities/genres.js';
import Actor from './entities/actor.js';
import User from './entities/user.js';
import constructCollection from './NLP.js';

async function constructMovieVector(
  movie_id,
  allActors,
  allGenres,
  collection
) {
  const movie_object = {};
  const movieRepository = appDataSource.getRepository(Movie);
  const movie = await movieRepository.findOne({
    where: { id_movie: movie_id },
    relations: ['actors', 'movie_genre'],
  });
  const actorsOfMovie = movie.actors;
  const genresOfMovie = movie.movie_genre;
  for (const actor of allActors) {
    movie_object[actor.id_actor.toString() + 'A'] = 0;
  }
  for (const genre of allGenres) {
    movie_object[genre.id_genre.toString() + 'G'] = 0;
  }
  for (const token of collection) {
    movie_object[token] = 0;
  }
  const wordSet = constructCollection([
    movie.release_date.substr(0, 3) +
      ' ' +
      movie.title +
      ' ' +
      movie.description,
  ]);
  for (const actor of actorsOfMovie) {
    movie_object[actor.id_actor.toString() + 'A'] = 1;
  }
  for (const genre of genresOfMovie) {
    movie_object[genre.id_genre.toString() + 'G'] = 1;
  }
  for (const token of wordSet) {
    movie_object[token] = 1;
  }

  return movie_object;
}
function norme(object) {
  let norm = 0;
  for (const property in object) {
    norm += object[property] * object[property];
  }
  norm = Math.sqrt(norm);

  return norm;
}

function score(user_object, movie_object) {
  let score_ = 0;
  for (const property in user_object) {
    score_ += user_object[property] * movie_object[property];
  }
  score_ /= norme(user_object);
  score_ /= norme(movie_object);

  return score_;
}

async function getRecommendationForUser(user_id) {
  console.log(user_id);
  if (!appDataSource.isInitialized) {
    await appDataSource.initialize();
  }
  const userRepository = appDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id_user: user_id },
    relations: ['movies_rates', 'movies_rates.Movie_rate'],
  });
  const allActors = await appDataSource.getRepository(Actor).find();
  const allGenres = await appDataSource.getRepository(Genre).find();
  const allMovies = await appDataSource.getRepository(Movie).find();
  const movie_ids = [];
  const all_desc_plus_title_plus_releasedate = [];
  for (const movie of allMovies) {
    movie_ids.push(movie.id_movie);
    all_desc_plus_title_plus_releasedate.push(
      movie.release_date.substr(0, 4) +
        ' ' +
        movie.title +
        ' ' +
        movie.description
    );
  }
  const collection = constructCollection(all_desc_plus_title_plus_releasedate);
  const ratingOfUser = user.movies_rates;
  const user_object = {};
  for (const actor of allActors) {
    user_object[actor.id_actor.toString() + 'A'] = 0;
  }
  for (const genre of allGenres) {
    user_object[genre.id_genre.toString() + 'G'] = 0;
  }
  for (const token of collection) {
    user_object[token] = 0;
  }
  const n = ratingOfUser.length;
  for (const movie of ratingOfUser) {
    const movie_object = await constructMovieVector(
      movie.id_movie,
      allActors,
      allGenres,
      collection
    );
    for (const property in user_object) {
      user_object[property] =
        user_object[property] +
        (parseInt(movie.rate) * movie_object[property]) / n;
    }
  }
  const movieVectorsArray = {};
  for (const movie of allMovies) {
    movieVectorsArray[movie.id_movie] = await constructMovieVector(
      movie.id_movie,
      allActors,
      allGenres,
      collection
    );
  }
  movie_ids.sort(function (a, b) {
    const A = score(user_object, movieVectorsArray[a]);
    const B = score(user_object, movieVectorsArray[b]);
    if (A < B) {
      return 1;
    } else if (B < A) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return -1;
    }
  });
  for (const movie of ratingOfUser) {
    const index = movie_ids.indexOf(movie.id_movie);
    if (index > -1) {
      movie_ids.splice(index, 1);
    }
  }

  return movie_ids;
}
export default getRecommendationForUser;

//console.log(await getRecommendationForUser(1));
