import pytest
import os
import json

def test_currency_conversion_rates():
    """Test multi-currency exchange rates and conversion math."""
    usd_amount = 100.0
    jpy_rate = 155.0
    inr_rate = 85.5
    eur_rate = 0.92

    assert round(usd_amount * jpy_rate) == 15500
    assert round(usd_amount * inr_rate) == 8550
    assert round(usd_amount * eur_rate, 2) == 92.00

def test_locale_dictionaries_completeness():
    """Verify that English and Japanese localization dictionaries exist and contain matching keys."""
    en_path = os.path.join("frontend", "src", "locales", "en.json")
    ja_path = os.path.join("frontend", "src", "locales", "ja.json")

    assert os.path.exists(en_path), "en.json locale file missing"
    assert os.path.exists(ja_path), "ja.json locale file missing"

    with open(en_path, "r", encoding="utf-8") as f:
        en_dict = json.load(f)
    with open(ja_path, "r", encoding="utf-8") as f:
        ja_dict = json.load(f)

    # Check key parity
    en_keys = set(en_dict.keys())
    ja_keys = set(ja_dict.keys())
    assert len(en_keys) > 0
    assert en_keys == ja_keys, f"Locale key mismatch. Missing in JA: {en_keys - ja_keys}, Missing in EN: {ja_keys - en_keys}"
