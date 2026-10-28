# Full-Stack Portfolio & Blog Application

> **Course:** Web Data Management and Application · **Type:** Cumulative Full-Stack Capstone Project · **Total Marks:** 100

A complete, production-ready full-stack **Personal Portfolio Website** with an integrated **Blog**, built with the **MERN** stack (MongoDB, Express, React, Node.js). It includes a secure REST API with JWT authentication, an admin dashboard, comments, and a contact form.

---

## 📌 Live Links

| Component | URL |
|-----------|-----|
| Front-End (React SPA) | `https://YOUR-PROJECT.vercel.app` *(replace with your deployed URL)* |
| Back-End (REST API) | `https://YOUR-API.onrender.com` *(replace with your deployed URL)* |

---

## ✨ Features

### Back-End (Node.js + Express + Mongoose)
- **MVC structure** — separated `models`, `routes`, `controllers`, `middleware`.
- **5 Mongoose models**: `User`, `Project`, `BlogPost`, `Comment`, `Message` — with schema validation and references (`populate()`).
- **Authentication**: bcrypt password hashing + JWT issued on login/register.
- **Authorization**: `protect` middleware guards protected routes; blog posts can only be updated/deleted by their author.
- **CRUD** for projects and blog posts, plus comment and contact endpoints.
- **Security**: `helmet` for secure headers, `dotenv` for secrets, central error-handling middleware.
- Cloud-hosted **MongoDB Atlas** database.

### Front-End (React SPA)
- **React Router** with public routes (`/`, `/projects`, `/blog`, `/blog/:id`, `/contact`, `/login`, `/register`) and a **protected** route (`/admin`).
- **Context API** manages global auth state (token + user) — the header is auth-aware (shows Login/Register when logged out, Logout + Admin when logged in).
- **Reusable components**: `Header`, `Footer`, `ProjectCard`, `BlogPostCard`, `ProtectedRoute`, feedback helpers.
- **Loading / Error** states handled on every API call.
- Modern, responsive **dark-theme** design (custom CSS with design tokens).
- Admin Dashboard can **create / update / delete** both projects and blog posts, sending the JWT automatically.

---

## 📁 Project Structure

```
├── server/                     # Back-End API (Node.js + Express + Mongoose)
│   ├── server.js               # Entry point
│   ├── .env.example            # Template for environment variables
│   └── src/
│       ├── config/db.js        # MongoDB connection
│       ├── models/             # User, Project, BlogPost, Comment, Message
│       ├── controllers/        # Business logic per resource
│       ├── routes/             # Express route definitions
│       ├── middleware/         # protect (JWT) + error handlers
│       ├── utils/              # generateToken helper
│       └── seed.js             # Sample data seeder
│
├── client/                     # Front-End SPA (React + Vite)
│   ├── index.html
│   ├── .env.example            # VITE_API_URL template
│   └── src/
│       ├── main.jsx / App.jsx  # Entry + routing
│       ├── api/client.js       # Axios instance (JWT interceptor)
│       ├── context/AuthContext.jsx
│       ├── components/         # Header, Footer, cards, ProtectedRoute, ...
│       ├── pages/              # Home, Projects, Blog, BlogDetail, Contact,
│       │                       #   Login, Register, Admin
│       └── styles/index.css    # Global design system
│
└── README.md
```

---

## 🔌 API Endpoints

Base URL: `https://YOUR-API.onrender.com/api`

### Users — Authentication
| Method | Endpoint | Access | Purpose | Body |
|--------|----------|--------|---------|------|
| POST | `/api/users/register` | Public | Create a user (password is hashed), returns JWT | `{ username, email, password }` |
| POST | `/api/users/login` | Public | Authenticate and return a JWT | `{ email, password }` |

### Projects
| Method | Endpoint | Access | Purpose | Body / Params |
|--------|----------|--------|---------|---------------|
| GET | `/api/projects` | Public | List all projects | — |
| GET | `/api/projects/:id` | Public | Get a single project | `:id` |
| POST | `/api/projects` | Protected | Create a project linked to `req.user` | `{ title, description, imageUrl?, repoUrl?, liveUrl? }` |
| PUT | `/api/projects/:id` | Protected | Update a project | `:id` + any of the above fields |
| DELETE | `/api/projects/:id` | Protected | Delete a project | `:id` |

### Blog
| Method | Endpoint | Access | Purpose | Body / Params |
|--------|----------|--------|---------|---------------|
| GET | `/api/blog` | Public | List all posts (populated with author) | — |
| GET | `/api/blog/:id` | Public | Get a post (author + all comments) | `:id` |
| POST | `/api/blog` | Protected | Create a post linked to `req.user` | `{ title, content }` |
| PUT | `/api/blog/:id` | Protected (author only) | Update a post | `:id` + `{ title?, content? }` |
| DELETE | `/api/blog/:id` | Protected (author only) | Delete a post (removes its comments) | `:id` |

### Comments
| Method | Endpoint | Access | Purpose | Body / Params |
|--------|----------|--------|---------|---------------|
| GET | `/api/blog/:postId/comments` | Public | List comments for a post | `:postId` |
| POST | `/api/blog/:postId/comments` | Protected | Add a comment to a post | `:postId` + `{ body }` |

### Contact
| Method | Endpoint | Access | Purpose | Body |
|--------|----------|--------|---------|------|
| POST | `/api/contact` | Public | Save a contact message | `{ name, email, message }` |

> **Protected endpoints** expect an `Authorization: Bearer <token>` header (sent automatically by the client's axios interceptor).

---

## 🚀 Run Locally

### 1. Back-End (`server`)
```bash
cd server
npm install
cp .env.example .env   # then fill in real values
npm run dev            # or npm start  (default port 5000)
```

`.env` variables:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

> **MongoDB Atlas**: create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), add a database user, whitelist `0.0.0.0/0`, and copy the connection string into `MONGO_URI`.

**(Optional) Seed sample data** (creates `admin@example.com` / `admin123` plus sample projects and posts):
```bash
npm run seed
```

### 2. Front-End (`client`)
```bash
cd client
npm install
cp .env.example .env.local   # set VITE_API_URL
npm run dev                  # http://localhost:5173
```

`.env.local` variable — point the client at your API:
```
VITE_API_URL=http://localhost:5000/api
```

> The front-end uses **axios with a JWT interceptor**, so once you log in, every protected request automatically carries the token.

---

## ☁️ Deployment

### Back-End → Render (or Heroku)
1. Push the `server` folder to a GitHub repo.
2. On [render.com](https://render.com), create a **New Web Service** from that repo.
3. Set build: `npm install`, start command: `npm start`.
4. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL=<frontend URL>`.
5. Deploy — you'll get a URL like `https://your-api.onrender.com`. Test `/api/health`.

### Front-End → Vercel (or Netlify)
1. Push the `client` folder to a GitHub repo.
2. On [vercel.com](https://vercel.com), **Import** that repo.
3. Framework preset: **Vite** · Build command: `npm run build` · Output directory: `dist`.
4. Add environment variable: `VITE_API_URL=https://your-api.onrender.com/api`.
5. Deploy — you'll get a URL like `https://your-project.vercel.app`.

> **Note:** on free tiers, the API may sleep when idle; the first request after a pause can take ~10s.

---

## 🧪 Test the API Quickly

```bash
# Health
curl https://YOUR-API.onrender.com/api/health

# Register
curl -X POST https://YOUR-API.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123"}'

# Create a project (with token)
curl -X POST https://YOUR-API.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"My App","description":"A demo project"}'
```

---

## 📦 Submission Notes (Chaoxing)

- Package `server` + `client` into a single `.zip` named `StudentID_StudentName_CapstoneProject.zip`.
- **Delete/Exclude** both `server/node_modules` and `client/node_modules` before zipping.
- Submit the README, the two live URLs, and the zip on Chaoxing (超星学习通).
- **Project demo & viva:** Wednesday 04 November 2026, 10:10 – 11:45.

---

## 🧰 Tech Stack
React · Vite · React Router · Context API · Node.js · Express · Mongoose · MongoDB Atlas · JSON Web Tokens · bcrypt · Helmet · Axios · CSS
