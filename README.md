# Resume Signal

Resume Signal is a MERN resume analyzer and ATS checker. It accepts PDF or DOCX resumes, parses recruiter-facing sections, scores them against a job description, stores report history, and enriches the report with OpenAI, Gemini, or Groq when a provider key is configured.

## What ships

- React/Vite SaaS UI with Tailwind, Framer Motion, Redux Toolkit, React Router, Dropzone upload, Recharts dashboards, responsive dark mode, report history, and admin views.
- Express/Mongo API with JWT cookies and bearer tokens, Google identity login, forgot/reset password flow, Multer memory uploads, PDF/DOCX text extraction, Mongoose models, validation, Helmet, CORS, rate limits, sanitization, Winston logging, and optional Redis AI-result caching.
- ATS pipeline for keyword match, target skill gaps, formatting, completeness, readability, ATS compatibility, strength/weak-area summaries, and deterministic fallback guidance.
- AI provider adapters for `openai`, `gemini`, `groq`, and a `mock` fallback. AI covers review, summary, bullet enhancement, ATS suggestions, projects, career suggestions, skill gap analysis, interview questions, and rewrite suggestions.
- Docker Compose, API/web Dockerfiles, Render blueprint, Vercel SPA rewrite config, GitHub Actions CI, environment examples, seed data, and a scoring test.

## Architecture

```text
.
|-- apps/
|   |-- api/
|   |   |-- src/config       # env, Mongo, Redis, logging
|   |   |-- src/models       # User, Resume, Analysis, JD, Feedback
|   |   |-- src/routes       # auth, analyses, admin, feedback
|   |   |-- src/services     # parsing, ATS scoring, AI, email
|   |   `-- scripts/seed.js
|   `-- web/
|       `-- src             # app store/router, pages, components, API client
|-- .github/workflows/ci.yml
|-- docker-compose.yml
`-- render.yaml
```

## Local setup

1. Use Node 20+, run `corepack enable`, and run `yarn install` from the repo root.
2. Copy `apps/api/.env.example` to `apps/api/.env`.
3. Copy `apps/web/.env.example` to `apps/web/.env`.
4. Start MongoDB and Redis locally, or run `docker compose up mongo redis`.
5. Run `yarn dev`.

The web app defaults to `http://localhost:5173`; the API defaults to `http://localhost:5000/api/v1`.

Seed demo data with `yarn seed`. The seed user is `demo@resumesignal.dev` with password `DemoPassword123!`; change or remove that account outside local demos.

## Environment

API essentials:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas or local Mongo connection |
| `JWT_SECRET` | At least 32 random characters |
| `CLIENT_URL` | Allowed frontend origin |
| `AI_PROVIDER` | `openai`, `gemini`, `groq`, or `mock` |
| `REDIS_URL` | Optional Redis cache |
| `GOOGLE_CLIENT_ID` | Google identity token audience |
| `SMTP_*` | Optional password reset mail transport |

Frontend essentials:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Versioned backend base URL |
| `VITE_GOOGLE_CLIENT_ID` | Enables the Google sign-in button |

Only one AI provider key is needed. Without one, scoring and stored reports still work with deterministic guidance.

## API surface

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/auth/signup` | Email/password signup |
| `POST` | `/api/v1/auth/login` | JWT session |
| `POST` | `/api/v1/auth/google` | Verify Google identity credential |
| `POST` | `/api/v1/auth/forgot-password` | Email reset request |
| `POST` | `/api/v1/auth/reset-password` | Set password with reset token |
| `GET` | `/api/v1/auth/me` | Current user |
| `POST` | `/api/v1/analyses` | Multipart resume plus job description |
| `GET` | `/api/v1/analyses` | Report history |
| `GET` | `/api/v1/analyses/dashboard` | Chart payloads |
| `GET` | `/api/v1/analyses/:id` | One owned report |
| `POST` | `/api/v1/feedback` | Store report feedback |
| `GET` | `/api/v1/admin/overview` | Admin analytics and feedback |

The analysis upload field is `resume`; accepted files are PDF and DOCX up to 5 MB.

## Deployment

- Web: import `apps/web` into Vercel or use the root workspace build command `yarn workspace @resume-signal/web build`. Set `VITE_API_URL` before build.
- API: `render.yaml` builds `apps/api/Dockerfile`; Railway can use the same Dockerfile or `yarn workspace @resume-signal/api start`.
- Data: use MongoDB Atlas. Redis is optional but recommended for repeated AI analyses.
- Containers: copy env files and run `docker compose up --build`.
- CI: GitHub Actions installs, tests ATS scoring, and builds both workspaces.

### Vercel frontend + hosted API checklist

If the deployed web app shows `Cannot reach the API`, the Vercel build is usually missing the backend URL.

1. Deploy the API first on Render/Railway and confirm `https://your-api-host/api/v1/health` returns JSON.
2. In Vercel, set `VITE_API_URL` to the versioned API URL, for example `https://your-api-host/api/v1`.
3. Redeploy the Vercel project after changing `VITE_API_URL`; Vite reads this value at build time.
4. In the API host, set `CLIENT_URL` to the Vercel app origin, for example `https://your-app.vercel.app`.

Do not use `localhost` for either deployed value. On a phone, `localhost` means the phone itself, not your laptop or Render service.

## Production notes

Use a strong `JWT_SECRET`, HTTPS origins, restricted Google OAuth origins, SMTP credentials from a secret manager, provider API keys with usage budgets, MongoDB indexes/backups, and external observability for logs/alerts. The deterministic ATS score is guidance, not a promise about a specific employer's ATS.
