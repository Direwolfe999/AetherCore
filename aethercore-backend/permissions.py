from collections.abc import Iterable


def normalize_string_collection(values: object) -> set[str]:
    if values is None:
        return set()

    if isinstance(values, str):
        return {value.strip() for value in values.split() if value.strip()}

    if isinstance(values, Iterable):
        return {str(value).strip() for value in values if str(value).strip()}

    return {str(values).strip()}


def normalize_scope_string(value: object) -> set[str]:
    if value is None:
        return set()

    if isinstance(value, str):
        return {scope.strip() for scope in value.split() if scope.strip()}

    return normalize_string_collection(value)


def has_required_values(principal_values: set[str], required_values: set[str]) -> bool:
    if not required_values:
        return True

    return bool(principal_values.intersection(required_values))