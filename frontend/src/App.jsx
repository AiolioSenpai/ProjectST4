import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import First from './pages/First_visit/First'
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import MovieDetails from './pages/movieDetails/movieDetails';
import Users from './pages/Users/Users';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup'         ;
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/movieDetails/:movieId"
        element={
          <PrivateRoute>
            <Layout>
              <MovieDetails />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Layout>
              <Users />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/about"
        element={
          <PrivateRoute>
            <Layout>
              <About />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Login />} /> {/* Default to login */}
    </Routes>
  );
}

export default App;
