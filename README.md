# To-Do List — MERN

A mobile-first to-do app built from the Figma design: create, edit, delete and search tasks, schedule them by date & time, and track progress week by week (Monday → Sunday).

**Stack:** React 19 · Vite · Tailwind CSS v4 · TanStack Query · Express 5 · MongoDB / Mongoose · Zod

## Features

| Requirement | Where |
| --- | --- |
| Create task (title*, description, date & time*, priority) | `+` button → bottom sheet (`TaskFormSheet`) |
| Edit task | Tap a task or the pencil icon |
| Delete task | **Swipe left** on a task → *Delete* (or tap the bin icon) |
| Search by keyword (title / description) | Search bar → `/search?q=` with view / edit / delete on results |
| Weekly grouping, Mon–Sun | *All Weeks* cards with open / completed counts; tap to expand |
| Mark Completed / In Progress | Checkbox on every task; counts and progress update instantly |
| Home overview | Week day-picker, Task Complete / Pending cards, Weekly Progress bar, day list |

Extras: onboarding screen, optimistic status toggles, weeks grouped in the **user's time zone** on the server, client + server validation, two-column layout on desktop.

## Project structure

```
├── client/                     React app
│   └── src/
│       ├── api/                fetch wrapper + task endpoints
│       ├── hooks/              React Query hooks (useTasks, useWeeks, mutations)
│       ├── context/            shared add/edit sheet
│       ├── components/         TaskItem, WeekCard, WeekStrip, StatCards, …
│       │   └── ui/             BottomSheet, Checkbox, Icons
│       ├── pages/              Onboarding, Home, Search
│       └── utils/              date + task helpers
├── server/                     Express API
│   ├── src/
│   │   ├── config/             env + Mongo connection (cached for serverless)
│   │   ├── models/             Task schema + indexes
│   │   ├── validators/         Zod request schemas
│   │   ├── middleware/         validate, error handler
│   │   ├── services/           data access / aggregation
│   │   ├── controllers/        thin HTTP handlers
│   │   └── routes/
│   └── netlify/functions/      Express wrapped as a Netlify Function
└── netlify.toml                one deploy: static client + /api function
```

## API

Base URL: `/api`

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Health + DB status |
| GET | `/tasks?search=&from=&to=&status=&page=&limit=` | List / search tasks (paginated) |
| GET | `/tasks/weeks?tz=Asia/Kolkata` | Per-week summary `{ weekStart, weekEnd, total, open, completed }` |
| POST | `/tasks` | Create `{ title, description?, dueAt, endAt?, priority? }` |
| GET | `/tasks/:id` | Get one |
| PATCH | `/tasks/:id` | Update any field(s) |
| PATCH | `/tasks/:id/status` | `{ status: "in-progress" \| "completed" }` |
| DELETE | `/tasks/:id` | Delete |

Errors come back as `{ error: { message, details? } }` with the right status code.

## Run locally

Requires Node 20+ and MongoDB (local or Atlas).

```bash
npm run install:all
cp server/.env.example server/.env   # set MONGODB_URI if not local
npm run seed                         # optional demo data
npm run dev                          # API :5000 + web :5173
```

Open http://localhost:5173 — Vite proxies `/api` to the Express server.

## Deploy (Netlify, client + API together)

1. Create a free MongoDB Atlas cluster and allow access from anywhere (`0.0.0.0/0`).
2. Push this repo to GitHub, then on Netlify: **Add new site → Import from Git**. `netlify.toml` already sets the build command, publish dir and functions dir.
3. In **Site settings → Environment variables** add `MONGODB_URI` (and `NODE_ENV=production`).
4. Deploy. The React app is served statically and `/api/*` runs the Express app as a Netlify Function.

To host the API elsewhere (Render, Railway…), run `npm start` in `server/` and build the client with `VITE_API_URL=https://your-api.example.com/api`.
