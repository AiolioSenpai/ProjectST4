import './Layout.css';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';

const Layout = ({ children }) => {
  const id_user = localStorage.getItem('user_id');
  console.log(id_user);

  return (
    <div className="Layout-container">
      <Header id_user={id_user} />
      <div className="Layout-content">{children}</div>
    </div>
  );
};

export default Layout;
