    # E-Tech Social Media Club

Full-stack social media club platform for the E-Tech Department. The project contains:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, and React Query
- **Backend:** Node.js, Express, SQLite, JWT authentication, and REST APIs

## Prerequisites

Install the following software on the machine where you want to run the project:

- [Git](https://git-scm.com/downloads)
- [Node.js 20.9 or later](https://nodejs.org/)
- npm (included with Node.js)

Confirm that Node.js and npm are available:

```bash
node --version
npm --version
```

Node.js 20.9+ is recommended because the frontend uses Next.js 16.

## 1. Get the Project

Clone the repository and enter its directory:

```bash
git clone <repository-url>
cd social_media_club
```

Replace `<repository-url>` with the URL of this repository.

## 2. Configure the Backend

Open a terminal in the project root and run:

```bash
cd backend
npm install
```

Create a file named `backend/.env` with the following contents:

```env
PORT=5000
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=replace-this-with-a-long-random-secret
DATABASE_PATH=./database.sqlite
```

The backend creates the SQLite database and all required tables when it starts. It also automatically loads the initial sample data when the database is empty.

To reset the local database and load the sample data again, stop the backend, remove `backend/database.sqlite` and its SQLite sidecar files if they exist, then start the backend again. You can also run the seed script manually:

```bash
npm run seed
```

> `npm run seed` clears and recreates the seeded content. Do not run it against a database containing data you want to keep.

## 3. Configure the Frontend

Open a second terminal in the project root and run:

```bash
cd frontend
npm install
```

For local development, the frontend already defaults to the backend at `http://localhost:5000/api`. To configure it explicitly, create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If the backend runs on another host or port, change this value to the complete API base URL, including `/api`.

## 4. Run the Project in Development

Start the backend in the first terminal:

```bash
cd backend
npm run dev
```

Start the frontend in the second terminal:

```bash
cd frontend
npm run dev
```

Open the application at:

- Frontend: <http://localhost:3000>
- Backend health check: <http://localhost:5000/api/health>

The backend API is available under `http://localhost:5000/api`.

If `nodemon` is not being used, the backend can be started without automatic restart:

```bash
cd backend
npm start
```

## 5. Run a Production Build Locally

Build the frontend:

```bash
cd frontend
npm run build
```

Start the backend and frontend in separate terminals:

```bash
cd backend
npm start
```

```bash
cd frontend
npm start
```

The production frontend is served at <http://localhost:3000>.

## Useful Commands

### Backend

```bash
npm install       # Install backend dependencies
npm run dev       # Start with automatic restart
npm start         # Start normally
npm run seed      # Clear and insert sample database data
```

### Frontend

```bash
npm install       # Install frontend dependencies
npm run dev       # Start the Next.js development server
npm run lint      # Run ESLint
npm run build     # Create a production build
npm start         # Serve the production build
```

## Troubleshooting

- **Frontend cannot load data:** Confirm that the backend is running and that `NEXT_PUBLIC_API_URL` points to the backend API, including `/api`.
- **CORS errors:** Confirm that `CORS_ORIGIN` in `backend/.env` matches the frontend URL, normally `http://localhost:3000`.
- **Port already in use:** Change `PORT` in `backend/.env`, then update `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to use the same backend port.
- **Database issues after changing `DATABASE_PATH`:** Stop the backend and confirm that the configured directory exists and is writable.
- **Dependency installation issues:** Delete the affected `node_modules` directory and run `npm install` again from that package directory.

## Project Structure

```text
social_media_club/
├── backend/       # Express REST API, SQLite database, authentication, and seed data
├── frontend/      # Next.js web application
├── render.yaml    # Render deployment configuration for the backend
└── README.md      # This setup guide
```
