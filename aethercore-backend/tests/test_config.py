"""Unit tests for config module.""""""Unit tests for config module."""










































































    assert settings.is_sqlite() is False    settings = Settings(database_url="postgresql://user:pass@localhost/db")    """Test nonlocal database detection."""def test_config_is_postgres():@pytest.mark.unit    assert settings.is_sqlite() is True    settings = Settings(database_url="sqlite:///./test.db")    """Test SQLite database detection."""def test_config_is_sqlite():@pytest.mark.unit    assert settings.resolved_m2m_client_id() == "regular_id"    )        auth0_m2m_client_id=""        auth0_client_id="regular_id",    settings = Settings(    """Test M2M client ID falls back to regular auth0_client_id."""def test_config_m2m_fallback_to_regular_client():@pytest.mark.unit    assert issuer == "https://mydomain.auth0.com"    issuer = settings.resolved_auth0_issuer()    settings = Settings(auth0_domain="https://mydomain.auth0.com")    """Test auth0 issuer removes https prefix if provided."""def test_config_auth0_issuer_removes_https_prefix():@pytest.mark.unit    assert issuer == "https://mydomain.auth0.com"    issuer = settings.resolved_auth0_issuer()    settings = Settings(auth0_domain="mydomain.auth0.com")    """Test auth0 issuer URL construction from domain."""def test_config_auth0_issuer_from_domain():@pytest.mark.unit    assert "http://localhost:3000" in origins    assert "*" not in origins    origins = settings.resolved_cors_origins()    settings = Settings(cors_origins=["*", "http://localhost:3000"])    """Test that wildcard origins are filtered out."""def test_config_cors_filters_wildcard():@pytest.mark.unit    assert "http://example.com" in origins    assert "http://localhost:3000" in origins    origins = settings.resolved_cors_origins()    )        cors_origins=["http://localhost:3000", "http://example.com"]    settings = Settings(    """Test CORS origin parsing from list."""def test_config_cors_origins_list():@pytest.mark.unit    assert "http://example.com" in origins    assert "http://localhost:3000" in origins    origins = settings.resolved_cors_origins()    )        cors_origins="http://localhost:3000,http://example.com"    settings = Settings(    """Test CORS origin parsing from comma-separated string."""def test_config_cors_origins_single():@pytest.mark.unitfrom config import Settingsimport pytestimport pytest
from config import Settings


def test_config_cors_origins_single():
    """Test CORS origin parsing from comma-separated string."""
    settings = Settings(
        cors_origins="http://localhost:3000,http://example.com"
    )
    origins = settings.resolved_cors_origins()
    assert "http://localhost:3000" in origins
    assert "http://example.com" in origins


def test_config_cors_origins_list():
    """Test CORS origin parsing from list."""
    settings = Settings(
        cors_origins=["http://localhost:3000", "http://example.com"]
    )
    origins = settings.resolved_cors_origins()
    assert "http://localhost:3000" in origins
    assert "http://example.com" in origins


def test_config_cors_filters_wildcard():
    """Test that wildcard origins are filtered out."""
    settings = Settings(cors_origins=["*", "http://localhost:3000"])
    origins = settings.resolved_cors_origins()
    assert "*" not in origins
    assert "http://localhost:3000" in origins


def test_config_auth0_issuer_from_domain():
    """Test auth0 issuer URL construction from domain."""
    settings = Settings(auth0_domain="mydomain.auth0.com")
    issuer = settings.resolved_auth0_issuer()
    assert issuer == "https://mydomain.auth0.com"


def test_config_auth0_issuer_removes_https_prefix():
    """Test auth0 issuer removes https prefix if provided."""
    settings = Settings(auth0_domain="https://mydomain.auth0.com")
    issuer = settings.resolved_auth0_issuer()
    assert issuer == "https://mydomain.auth0.com"


def test_config_m2m_fallback_to_regular_client():
    """Test M2M client ID falls back to regular auth0_client_id."""
    settings = Settings(
        auth0_client_id="regular_id",
        auth0_m2m_client_id=""
    )
    assert settings.resolved_m2m_client_id() == "regular_id"


def test_config_is_sqlite():
    """Test SQLite database detection."""
    settings = Settings(database_url="sqlite:///./test.db")
    assert settings.is_sqlite() is True


def test_config_is_postgres():
    """Test nonlocal database detection."""
    settings = Settings(database_url="postgresql://user:pass@localhost/db")
    assert settings.is_sqlite() is False
