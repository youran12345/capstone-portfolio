import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import ProjectCard from '../components/ProjectCard.jsx';
import { Loading, ErrorBox } from '../components/Feedback.jsx';

const skills = [
  'React',
  'Node.js',
  'Express',
  'MongoDB',
  'JavaScript',
  'REST APIs',
  'HTML & CSS',
  'Git',
];

const stats = [
  { value: '10+', label: 'Projects Built' },
  { value: '15+', label: 'Blog Posts' },
  { value: '100%', label: 'Passion' },
];

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.data || []);
        setStatus({ loading: false, error: null });
      } catch (err) {
        setStatus({ loading: false, error: getErrorMessage(err) });
      }
    };
    load();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-badge">Full-Stack Developer &amp; Blogger</div>
          <h1 className="hero-title">
            Hi, I'm <span className="gradient">王悠然</span>
          </h1>
          <p className="hero-sub">
            I craft modern, secure and scalable web applications — from the
            database to the pixels. Explore my projects, read my blog, or get
            in touch.
          </p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary btn-lg">
              View My Work
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Get in Touch
            </Link>
          </div>
          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="hero-stat">
                <strong className="gradient">{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">About</span>
            <h2 className="section-title">Who I Am</h2>
          </div>
          <div className="about-grid">
            <div className="about-card card">
              <p>
                I'm a computer science student passionate about building
                full-stack web applications. I enjoy turning complex problems
                into simple, beautiful and intuitive products.
              </p>
              <p>
                This site is my capstone project — a complete portfolio &amp;
                blog powered by a REST API, JWT authentication, an admin
                dashboard and a cloud database.
              </p>
            </div>
            <div className="skills-card">
              <h3>Tech I work with</h3>
              <div className="skills-cloud">
                {skills.map((s) => (
                  <span key={s} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured projects */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head row-between">
            <div>
              <span className="eyebrow">Portfolio</span>
              <h2 className="section-title">Featured Projects</h2>
            </div>
            <Link to="/projects" className="btn btn-outline">All Projects</Link>
          </div>

          {status.loading && <Loading label="Loading projects..." />}
          {status.error && <ErrorBox message={status.error} />}
          {!status.loading && !status.error && projects.length === 0 && (
            <p className="muted">No projects yet — check back soon.</p>
          )}

          <div className="grid grid-3">
            {projects.slice(0, 6).map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
