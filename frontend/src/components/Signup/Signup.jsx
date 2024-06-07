import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
} from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/signup`,
        {
          email: email,
          firstname: firstname,
          lastname: lastname,
          password: password
        }
      );
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user_id', response.data.user.id_user); // store user_id
      navigate('/first');
    } catch (error) {
      console.error('There was an error signing up!', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8} display="flex" flexDirection="column" alignItems="center">
        <Typography color="black" component="h1" variant="h5">
          <b>MovieMuse</b>: Sign Up Page
        </Typography>
        <form onSubmit={handleSignup} style={{ width: '100%', marginTop: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: 16 }}
          >
            Sign Up
          </Button>
          <Box mt={2}>
            <Link href="/login" variant="body2">
              {'Already have an account? Login'}
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
