import { useState } from 'react';
import api, { getErrorMessage } from '../api/client';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, error: null, ok: null });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, ok: null });
    try {
      await api.post('/contact', form);
      setStatus({ loading: false, error: null, ok: 'Thanks! Your message has been sent.' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, error: getErrorMessage(err), ok: null });
    }
  };

  return (
    <section className="page">
      <div className="container container-narrow">
        <div className="page-head">
          <span className="eyebrow">Contact</span>
          <h1 className="page-title">Get in Touch</h1>
          <p className="page-sub">
            Have a project in mind or just want to say hi? Drop me a message.
          </p>
        </div>

        <div className="card form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                required
              />
            </div>

            {status.error && <p className="form-error">{status.error}</p>}
            {status.ok && <p className="form-success">{status.ok}</p>}

            <button className="btn btn-primary btn-lg btn-block" disabled={status.loading}>
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
