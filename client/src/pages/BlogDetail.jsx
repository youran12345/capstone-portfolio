import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Loading, ErrorBox } from '../components/Feedback.jsx';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const BlogDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [post, setPost] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });

  const [comment, setComment] = useState('');
  const [submit, setSubmit] = useState({ loading: false, error: null, ok: null });

  const load = async () => {
    setStatus({ loading: true, error: null });
    try {
      const { data } = await api.get(`/blog/${id}`);
      setPost(data.data);
      setStatus({ loading: false, error: null });
    } catch (err) {
      setStatus({ loading: false, error: getErrorMessage(err) });
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmit({ loading: true, error: null, ok: null });
    try {
      await api.post(`/blog/${id}/comments`, { body: comment });
      setComment('');
      setSubmit({ loading: false, error: null, ok: 'Comment posted!' });
      await load(); // refresh to show the new comment
    } catch (err) {
      setSubmit({ loading: false, error: getErrorMessage(err), ok: null });
    }
  };

  if (status.loading) return <Loading label="Loading post..." />;
  if (status.error) {
    return (
      <section className="page">
        <div className="container">
          <ErrorBox message={status.error} />
          <Link to="/blog" className="btn btn-outline">← Back to blog</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page">
      <div className="container container-narrow">
        <Link to="/blog" className="back-link">← All posts</Link>

        <article className="post">
          <div className="post-meta">
            <span className="avatar">
              {(post.author?.username || 'U')[0].toUpperCase()}
            </span>
            <span>{post.author?.username || 'Author'}</span>
            <span className="dot">·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-content">{post.content}</div>
        </article>

        {/* Comments */}
        <div className="comments">
          <h2 className="comments-title">
            Comments <span className="count-badge">{post.comments?.length || 0}</span>
          </h2>

          {isAuthenticated ? (
            <form className="comment-form" onSubmit={handleComment}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`Comment as ${user.username}...`}
                rows="3"
                required
              />
              {submit.error && <p className="form-error">{submit.error}</p>}
              {submit.ok && <p className="form-success">{submit.ok}</p>}
              <div className="comment-actions">
                <button className="btn btn-primary" disabled={submit.loading || !comment.trim()}>
                  {submit.loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          ) : (
            <p className="muted">
              <Link to="/login">Log in</Link> to join the conversation.
            </p>
          )}

          <div className="comment-list">
            {post.comments?.length === 0 && (
              <p className="muted">Be the first to comment.</p>
            )}
            {post.comments?.map((c) => (
              <div className="comment" key={c._id}>
                <div className="comment-meta">
                  <span className="avatar avatar-sm">
                    {(c.author?.username || 'U')[0].toUpperCase()}
                  </span>
                  <strong>{c.author?.username || 'Anonymous'}</strong>
                  <span className="dot">·</span>
                  <span>{formatDate(c.createdAt)}</span>
                </div>
                <p className="comment-body">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
