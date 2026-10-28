const ProjectCard = ({ project }) => {
  return (
    <article className="card project-card">
      <div className="project-thumb">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} loading="lazy" />
        ) : (
          <div className="project-thumb-fallback">{project.title.charAt(0)}</div>
        )}
        <span className="project-tag">{project.user?.username || 'Owner'}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-text">{project.description}</p>
        <div className="project-links">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-primary"
            >
              Live
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-outline"
            >
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
