from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_about_declares_localized_fields() -> None:
    response = client.get("/api/about")
    assert response.status_code == 200
    assert response.json()["l10n_supported_fields"] == ["eyebrow", "title", "intro", "facts", "sections"]
