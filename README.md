# Personal Website

A personal website built with React, TypeScript, and Tailwind CSS. Content is stored as local JSON files in `frontend/api/`, so the project currently runs as a frontend-only application.

## Quick start

```bash
make dev
```

- Frontend: http://localhost:5173

## Commands

```bash
make install     # Install frontend dependencies
make dev         # Start the frontend development server
make test        # Build the frontend
make lint        # Run the frontend linter
make build       # Build the frontend image
make down        # Stop the frontend service
```

## Localization

Localized content uses locale keys such as `en-US` and `zh-TW`. The frontend uses `en-US` as its fallback locale. Content is organized under `frontend/api/` using the former API names: `home.json`, `about.json`, `navigation.json`, and `health.json`.

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

The navigation data follows the same pattern. Its `items` array contains shared link metadata, while each item's `text` field stores the localized labels.
