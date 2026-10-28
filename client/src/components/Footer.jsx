import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-brand">
          王悠然<span className="brand-dot">.</span>
        </p>
        <ul className="footer-links">
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/blog">Blog</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/admin">Admin</Link></li>
        </ul>
        <p className="footer-copy">
          © {year} 王悠然 · Built with React, Node.js &amp; MongoDB
        </p>
      </div>
    </footer>
  );
};

export default Footer;
