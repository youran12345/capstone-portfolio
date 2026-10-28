import { useEffect, useState, useCallback } from 'react';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Loading, ErrorBox } from '../components/Feedback.jsx';

const emptyProject = { title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '' };
const emptyPost = { title: '', content: '' };

const Admin = () => {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState('projects');

  return (
    <section className="page admin-page">
      <div className="container container-wide">
        <div className="page-head row-between">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1 className="page-title">Admin</h1>
            <p className="page-sub">
              Welcome back, <strong>{user?.username}</strong>. Manage your
              projects and blog posts below.
            </p>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab${tab === 'projects' ? ' active' : ''}`}
            onClick={() => setTab('projects')}
          >
            Projects
          </button>
          <button
            className={`tab${tab === 'blog' ? ' active' : ''}`}
            onClick={() => setTab('blog')}
          >
            Blog Posts
          </button>
        </div>

        {tab === 'projects' ? <ProjectsPanel /> : <BlogPanel />}
      </div>
    </section>
  );
};

/* ---------------- Projects management ---------------- */
const ProjectsPanel = () => {
  const [projects, setProjects] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data || []);
      setStatus({ loading: false, error: null });
    } catch (err) {
      setStatus({ loading: false, error: getErrorMessage(err) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(emptyProject);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
        setMsg('Project updated.');
      } else {
        await api.post('/projects', form);
        setMsg('Project created.');
      }
      resetForm();
      await load();
    } catch (err) {
      setMsg({ error: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({
      title: p.title || '',
      description: p.description || '',
      imageUrl: p.imageUrl || '',
      repoUrl: p.repoUrl || '',
      liveUrl: p.liveUrl || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      await load();
    } catch (err) {
      setMsg({ error: getErrorMessage(err) });
    }
  };

  return (
    <div className="admin-grid">
      <div className="card form-card">
        <h3 className="card-title">
          {editingId ? 'Edit Project' : 'Add Project'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={change} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea name="description" rows="3" value={form.description} onChange={change} required />
          </div>
          <div className="field">
            <label>Image URL (optional)</label>
            <input name="imageUrl" value={form.imageUrl} onChange={change} placeholder="https://..." />
          </div>
          <div className="field">
            <label>Live URL (optional)</label>
            <input name="liveUrl" value={form.liveUrl} onChange={change} placeholder="https://..." />
          </div>
          <div className="field">
            <label>Repository URL (optional)</label>
            <input name="repoUrl" value={form.repoUrl} onChange={change} placeholder="https://..." />
          </div>

          {msg?.error && <p className="form-error">{msg.error}</p>}
          {msg && !msg.error && <p className="form-success">{msg}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list">
        <h3 className="card-title">All Projects ({projects.length})</h3>
        {status.loading && <Loading />}
        {status.error && <ErrorBox message={status.error} />}
        {!status.loading && projects.length === 0 && (
          <p className="muted">No projects yet.</p>
        )}
        {projects.map((p) => (
          <div className="admin-item" key={p._id}>
            <div className="admin-item-body">
              <strong>{p.title}</strong>
              <span className="muted clamp-1">{p.description}</span>
            </div>
            <div className="admin-item-actions">
              <button className="btn btn-sm btn-outline" onClick={() => startEdit(p)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Blog management ---------------- */
const BlogPanel = () => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: null });
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get('/blog');
      setPosts(data.data || []);
      setStatus({ loading: false, error: null });
    } catch (err) {
      setStatus({ loading: false, error: getErrorMessage(err) });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm(emptyPost);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      if (editingId) {
        await api.put(`/blog/${editingId}`, form);
        setMsg('Post updated.');
      } else {
        await api.post('/blog', form);
        setMsg('Post created.');
      }
      resetForm();
      await load();
    } catch (err) {
      setMsg({ error: getErrorMessage(err) });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p._id);
    setForm({ title: p.title || '', content: p.content || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      await api.delete(`/blog/${id}`);
      await load();
    } catch (err) {
      setMsg({ error: getErrorMessage(err) });
    }
  };

  return (
    <div className="admin-grid">
      <div className="card form-card">
        <h3 className="card-title">
          {editingId ? 'Edit Post' : 'Write Post'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={change} required />
          </div>
          <div className="field">
            <label>Content</label>
            <textarea name="content" rows="7" value={form.content} onChange={change} required />
          </div>

          {msg?.error && <p className="form-error">{msg.error}</p>}
          {msg && !msg.error && <p className="form-success">{msg}</p>}

          <div className="form-actions">
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Post' : 'Publish Post'}
            </button>
            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="admin-list">
        <h3 className="card-title">All Posts ({posts.length})</h3>
        {status.loading && <Loading />}
        {status.error && <ErrorBox message={status.error} />}
        {!status.loading && posts.length === 0 && (
          <p className="muted">No posts yet.</p>
        )}
        {posts.map((p) => (
          <div className="admin-item" key={p._id}>
            <div className="admin-item-body">
              <strong>{p.title}</strong>
              <span className="muted clamp-1">{p.content}</span>
            </div>
            <div className="admin-item-actions">
              <button className="btn btn-sm btn-outline" onClick={() => startEdit(p)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
