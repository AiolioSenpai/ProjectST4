import express from 'express';
import { appDataSource } from '../datasource.js';
import Actor from '../entities/actor.js';

const router = express.Router();
const actorRepository = appDataSource.getRepository(Actor);

router.get('/', async (req, res) => {
  try {
    const allActors = await actorRepository.find();
    res.json(allActors);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

router.get('/:actorId', async (req, res) => {
  try {
    const idActor = await actorRepository.find({
      where: {
        id_actor: req.params.actorId,
      },
    });
    if (idActor.length != 0) {
      res.status(200).json({
        message: 'HTTP 200 OK',
        actor: idActor,
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

router.delete('/:actorId', function (req, res) {
  actorRepository
    .delete({ id_actor: req.params.actorId })
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

    const newActor = actorRepository.create({
      id_actor: req.body.id_actor,
      actor_name: req.body.actor_name,
      image: req.body.image,
    });

    await actorRepository.insert(newActor);

    res.status(201).json({
      message: 'HTTP 201 Created',
      actor: newActor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Internal Server Error',
    });
  }
});

export default router;
