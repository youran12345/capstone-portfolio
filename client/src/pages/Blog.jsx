import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client';
import BlogPostCard from '../components/BlogPostCard.jsx';
import { Loading, ErrorBox, EmptyState } from '../components/Feedback.jsx';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/blog');
        setPosts(data.data || []);
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
          <span className="eyebrow">Journal</span>
          <h1 className="page-title">The Blog</h1>
          <p className="page-sub">
            Notes, tutorials and thoughts on web development and technology.
          </p>
        </div>

        {status.loading && <Loading label="Loading posts..." />}
        {status.error && <ErrorBox message={status.error} />}
        {!status.loading && !status.error && posts.length === 0 && (
          <EmptyState message="No blog posts yet." />
        )}

        <div className="grid grid-2">
          {posts.map((p) => (
            <BlogPostCard key={p._id} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
