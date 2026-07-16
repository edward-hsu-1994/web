.PHONY: dev down build logs install test lint format

dev:
	docker compose up --build

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

install:
	python3 -m venv backend/.venv
	backend/.venv/bin/pip install -e 'backend[dev]'
	cd frontend && npm install

test:
	cd backend && .venv/bin/pytest

lint:
	cd backend && .venv/bin/ruff check app tests
	cd frontend && npm run lint

format:
	cd backend && .venv/bin/ruff format app tests
	cd frontend && npm run format

