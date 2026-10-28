// Small reusable UI helpers used across pages.

export const Loading = ({ label = 'Loading...' }) => (
  <div className="status status-loading">
    <span className="spinner" />
    <p>{label}</p>
  </div>
);

export const ErrorBox = ({ message }) => (
  <div className="status status-error">
    <p>⚠ {message}</p>
  </div>
);

export const EmptyState = ({ message }) => (
  <div className="status status-empty">
    <p>{message}</p>
  </div>
);
