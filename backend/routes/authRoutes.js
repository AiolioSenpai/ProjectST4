import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../entities/user.js';
import { appDataSource } from '../datasource.js';

const router = express.Router();

// Secret for JWT
const jwtSecret = 'your_jwt_secret';

// Sign Up Route
router.post('/signup', async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  //console.log(req.body);
  const userRepository = appDataSource.getRepository(User);

  try {
    const existingUser = await userRepository.findOne({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepository.create({
      email: email,
      firstname: firstname,
      lastname: lastname,
      password: hashedPassword,
    });

    const savedUser = await userRepository.save(newUser);
    const token = jwt.sign({ id: savedUser.id_user }, jwtSecret, {
      expiresIn: '1h',
    });
    res.status(201).json({ token, user: savedUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userRepository = appDataSource.getRepository(User);

  try {
    const user = await userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id_user }, jwtSecret, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
});

export default router;
