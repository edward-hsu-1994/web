# Personal Website

A personal website built with React, TypeScript, and Tailwind CSS. Content is stored as local JSON files in `frontend/api/`, so the project currently runs as a frontend-only application.

## Quick start

```bash
make dev
```

- Frontend: http://localhost:5173

The project is currently frontend-only. The FastAPI backend and PostgreSQL services are paused and are not started by Docker Compose. The backend source remains in `backend/` for possible future use.

## Local content

The frontend imports its content directly from JSON files in `frontend/api/`:

- `home.json` — homepage hero content and buttons
- `about.json` — profile, experience, skills, and education
- `portfolio.json` — localized portfolio project metadata
- `navigation.json` — site navigation and localized labels
- `life-records.json` — localized life photo metadata
- `health.json` — reserved health status data

There are no runtime API requests in the frontend. Updating a JSON file updates the corresponding page content after Vite reloads.

### Page status markers

When a page is still being prepared, place a `page-status-badge` next to its title in the page header. The marker must include localized labels for both supported languages:

```tsx
<span className="page-status-badge">{isChinese ? '建置中' : 'In progress'}</span>
```

Remove the marker once the page is ready for regular use.

## Commands

```bash
make install     # Install frontend dependencies
make dev         # Start the frontend development server
make test        # Build the frontend
make lint        # Run the frontend linter
make build       # Build the frontend image
make down        # Stop the frontend service
```

## GitHub Pages

GitHub Actions builds the frontend on every push to `main` and publishes the generated `frontend/dist/` files to the `gh-pages` branch. The workflow is defined in `.github/workflows/deploy-pages.yml` and can also be started manually from the Actions tab.

To display the site, configure the repository's Pages settings to deploy from the `gh-pages` branch and the root directory. The project-site URL is:

```text
https://edward-hsu-1994.github.io/web/
```

The production build uses `/` as its base path for the custom domain and includes a `404.html` SPA fallback so client-side routes continue to work on GitHub Pages.

## Localization

Localized content uses locale keys such as `en-US` and `zh-TW`. The frontend uses `en-US` as its fallback locale. Content is organized under `frontend/api/` using the former API names: `home.json`, `about.json`, `navigation.json`, and `health.json`.

Objects and items that support localization declare their localized fields with `l10n_supported_fields`. For example, `home.json` uses `hero.l10n_supported_fields: ["content"]`, while each hero button uses `l10n_supported_fields: ["text"]`.

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
