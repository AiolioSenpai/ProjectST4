import express from 'express';
import { appDataSource } from '../datasource.js';
import Genre from '../entities/genres.js';

const router = express.Router();
const genreRepository = appDataSource.getRepository(Genre);



router.get('/', async (req, res) => {
  try {
    const allGenres = await  genreRepository.find()
    res.json(allGenres)
  
  } catch (err) {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error',
    });
}
})
;

export default router;
