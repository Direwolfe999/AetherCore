"""Unit tests for security and auth modules.""""""Unit tests for security and auth modules."""



















































    assert has_required_values(user_values, required) is False    required = {"read:data"}    user_values = set()    """Test permission check with user having no values."""def test_has_required_values_empty_user():@pytest.mark.unit    assert has_required_values(user_values, required) is True    required = set()    user_values = {"read:data"}    """Test permission check with no required values."""def test_has_required_values_empty_required():@pytest.mark.unit    assert has_required_values(user_values, required) is False    required = {"read:data", "admin:all"}    user_values = {"read:data"}    """Test permission check when required value is missing."""def test_has_required_values_missing_required():@pytest.mark.unit    assert has_required_values(user_values, required) is True    required = {"read:data"}    user_values = {"read:data", "write:data"}    """Test permission check with single required value."""def test_has_required_values_with_single_value():@pytest.mark.unit    assert all(s in normalized for s in ["read:data", "write:data", "admin:all"])    normalized = normalize_scope_string(scopes)    scopes = "read:data write:data admin:all"    """Test normalizing space-separated scopes."""def test_normalize_scope_string_space_separated():@pytest.mark.unit    assert "read:data" in normalized    normalized = normalize_scope_string(scope)    scope = "read:data"    """Test normalizing a single scope."""def test_normalize_scope_string_single():@pytest.mark.unitfrom security.permissions import normalize_scope_string, has_required_valuesimport pytestimport pytest
from security.permissions import normalize_scope_string, has_required_values


def test_normalize_scope_string_single():
    """Test normalizing a single scope."""
    scope = "read:data"
    normalized = normalize_scope_string(scope)
    assert "read:data" in normalized


def test_normalize_scope_string_space_separated():
    """Test normalizing space-separated scopes."""
    scopes = "read:data write:data admin:all"
    normalized = normalize_scope_string(scopes)
    assert all(s in normalized for s in ["read:data", "write:data", "admin:all"])


def test_has_required_values_with_single_value():
    """Test permission check with single required value."""
    user_values = {"read:data", "write:data"}
    required = {"read:data"}
    assert has_required_values(user_values, required) is True


def test_has_required_values_missing_required():
    """Test permission check when required value is missing."""
    user_values = {"read:data"}
    required = {"read:data", "admin:all"}
    assert has_required_values(user_values, required) is False


def test_has_required_values_empty_required():
    """Test permission check with no required values."""
    user_values = {"read:data"}
    required = set()
    assert has_required_values(user_values, required) is True


def test_has_required_values_empty_user():
    """Test permission check with user having no values."""
    user_values = set()
    required = {"read:data"}
    assert has_required_values(user_values, required) is False
