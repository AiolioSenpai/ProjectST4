import './Layout.css';
import Header from '../Header/Header';

const Layout = ({ children }) => {
  return (
    <div className="Layout-container">
      <Header />
      <div className="Layout-content">{children}</div>
    </div>
  );
};

export default Layout;
