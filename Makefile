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
	cd frontend && npm install

test:
	cd frontend && npm run build

lint:
	cd frontend && npm run lint

format:
	cd frontend && npm run format
