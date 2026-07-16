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

## Localization

Localized API data uses locale keys such as `en-US` and `zh-TW`. The frontend uses `en-US` as its fallback locale.

Objects and items that support localization declare their localized fields with `l10n_supported_fields`. For example, the home API uses `hero.l10n_supported_fields: ["content"]`, while each hero button uses `l10n_supported_fields: ["text"]`.

```json
{
  "hero": {
    "l10n_supported_fields": ["content"],
    "content": {
      "en-US": {
        "greeting": "Hi, I'm ",
        "name": "Edward Hsu"
      },
      "zh-TW": {
        "greeting": "你好，我是 ",
        "name": "Edward Hsu"
      }
    },
    "buttons": {
      "items": [
        {
          "text": {
            "en-US": "Explore my GitHub",
            "zh-TW": "瀏覽我的 GitHub"
          },
          "type": "link",
          "link": "https://github.com/edward-hsu-1994",
          "class": "primary-button",
          "l10n_supported_fields": ["text"]
        }
      ]
    }
  }
}
```

The navigation API follows the same pattern. Its `items` array contains shared link metadata, while each item's `text` field stores the localized labels.
