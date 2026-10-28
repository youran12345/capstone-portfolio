import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavLinkItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `nav-link${isActive ? ' active' : ''}`
    }
    onClick={onClick}
  >
    {children}
  </NavLink>
);

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={close}>
          <span className="brand-mark">悠</span>
          <span className="brand-text">王悠然<span className="brand-dot">.</span></span>
        </Link>

        <button
          className={`nav-toggle${open ? ' open' : ''}`}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav${open ? ' open' : ''}`}>
          <NavLinkItem to="/" onClick={close}>Home</NavLinkItem>
          <NavLinkItem to="/projects" onClick={close}>Projects</NavLinkItem>
          <NavLinkItem to="/blog" onClick={close}>Blog</NavLinkItem>
          <NavLinkItem to="/contact" onClick={close}>Contact</NavLinkItem>

          {isAuthenticated ? (
            <>
              <NavLinkItem to="/admin" onClick={close}>Admin</NavLinkItem>
              <div className="nav-user">
                <span className="nav-avatar">
                  {(user?.username || 'U')[0].toUpperCase()}
                </span>
                <button className="btn btn-ghost" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-actions">
              <Link to="/login" className="btn btn-ghost" onClick={close}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={close}>
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
