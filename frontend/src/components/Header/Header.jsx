import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/login');
  };

  return (
    <div className="Header-container">
      <Link className="Link" to="/home">
        Home
      </Link>
      <div>|</div>
      <Link className="Link" to="/users">
        Account
      </Link>
      <div>|</div>
      <Link className="Link" to="/about">
        About
      </Link>
      <div>|</div>
      <Link className="Link" to="/login" onClick={handleLogout}>
        Log out
      </Link>
    </div>
  );
};

export default Header;
