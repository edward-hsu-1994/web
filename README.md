# Personal Website

A personal website monorepo with a React + Tailwind CSS frontend, a FastAPI backend, and a Docker Compose development environment.

## Quick start

```bash
cp .env.example .env
make dev
```

- Frontend: http://localhost:5173
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Commands

```bash
make install     # Install local development dependencies
make dev         # Start the Docker Compose services
make test        # Run backend tests
make lint        # Run backend and frontend linters
make build       # Build Docker images
make down        # Stop the services
```
