"""Unit tests for permission helpers."""

import pytest

from permissions import has_required_values, normalize_scope_string


@pytest.mark.unit
def test_normalize_scope_string_single() -> None:
    normalized = normalize_scope_string("read:data")
    assert "read:data" in normalized


@pytest.mark.unit
def test_normalize_scope_string_space_separated() -> None:
    normalized = normalize_scope_string("read:data write:data admin:all")
    assert all(value in normalized for value in ["read:data", "write:data", "admin:all"])


@pytest.mark.unit
def test_has_required_values_with_match() -> None:
    assert has_required_values({"read:data", "write:data"}, {"read:data"}) is True


@pytest.mark.unit
def test_has_required_values_without_match() -> None:
    assert has_required_values({"read:data"}, {"admin:all"}) is False
