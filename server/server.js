// =============================================================
//  Portfolio & Blog REST API — Application Entry Point
//  Node.js + Express + Mongoose (MVC structure)
// =============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./src/config/db');
const {
  notFound,
  errorHandler,
} = require('./src/middleware/errorHandler');

const app = express();

// ---------- Global middleware ----------
app.use(helmet()); // secure HTTP headers

// CORS — allow the configured front-end origin(s)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json()); // parse JSON bodies

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ---------- Routes ----------
app.use('/api/users', require('./src/routes/userRoutes'));
app.use('/api/projects', require('./src/routes/projectRoutes'));
app.use('/api/blog', require('./src/routes/blogRoutes'));
app.use('/api/contact', require('./src/routes/contactRoutes'));

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', timestamp: Date.now() });
});

// ---------- Error handling ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Start server ----------
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `[server] running in ${process.env.NODE_ENV} mode on port ${PORT}`
      )
    );
  })
  .catch((err) => {
    console.error(`[server] failed to start: ${err.message}`);
    process.exit(1);
  });
