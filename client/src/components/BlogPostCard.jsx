import { Link } from 'react-router-dom';

const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const BlogPostCard = ({ post }) => {
  return (
    <article className="card blog-card">
      <Link to={`/blog/${post._id}`} className="blog-card-link">
        <div className="card-body">
          <div className="blog-meta">
            <span className="avatar avatar-sm">
              {(post.author?.username || 'U')[0].toUpperCase()}
            </span>
            <span>{post.author?.username || 'Author'}</span>
            <span className="dot">·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <h3 className="card-title">{post.title}</h3>
          <p className="card-text clamp-2">{post.content}</p>
          <span className="read-more">Read more →</span>
        </div>
      </Link>
    </article>
  );
};

export default BlogPostCard;
