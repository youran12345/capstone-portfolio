import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import ProjectCard from '../components/ProjectCard.jsx';
import { Loading, ErrorBox, EmptyState } from '../components/Feedback.jsx';

const Projects = () => {
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
    <section className="page">
      <div className="container">
        <div className="page-head">
          <span className="eyebrow">Portfolio</span>
          <h1 className="page-title">My Projects</h1>
          <p className="page-sub">
            A selection of the things I've designed, built and shipped.
          </p>
        </div>

        {status.loading && <Loading label="Loading projects..." />}
        {status.error && <ErrorBox message={status.error} />}
        {!status.loading && !status.error && projects.length === 0 && (
          <EmptyState message="No projects have been published yet." />
        )}

        <div className="grid grid-3">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
