.PHONY: dev down build logs install backend-install test lint format backend-test backend-lint

dev:
	docker compose up --build

down:
	docker compose down

build:
	docker compose build

logs:
	docker compose logs -f

install:
	cd frontend && npm ci

test: backend-test
	cd frontend && npm run build

lint: backend-lint
	cd frontend && npm run lint

backend-install:
	cd backend && python3 -m pip install -e '.[dev]'

format:
	cd frontend && npm run format

backend-test:
	cd backend && python3 -m pytest

backend-lint:
	cd backend && ruff check .
