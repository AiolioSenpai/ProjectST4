import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import MovieDetails from './pages/movieDetails/movieDetails';
import Users from './pages/Users/Users';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movieDetails/:id" element={<MovieDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />

      </Routes>
    </Layout>
  );
}

export default App;
