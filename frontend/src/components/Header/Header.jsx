import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <div className="Header-container">
      <Link className="Link" to="/">
        Home
      </Link>
      <div>|</div>
      <div>|</div>
      <Link className="Link" to="/users">
        Account
      </Link>
      <div>|</div>
      <Link className="Link" to="/about">
        About
      </Link>
    </div>
  );
};

export default Header;
