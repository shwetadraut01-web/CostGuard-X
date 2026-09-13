import os
import json
import yaml
from typing import Dict, Any

def load_yaml(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Configuration file not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

def load_json(file_path: str) -> Dict[str, Any]:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Knowledge file not found: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_thresholds(config_dir: str = "config") -> Dict[str, Any]:
    path = os.path.join(config_dir, "thresholds.yaml")
    return load_yaml(path)

def load_waste_rules(config_dir: str = "config") -> Dict[str, Any]:
    path = os.path.join(config_dir, "waste_rules.yaml")
    return load_yaml(path)

def load_settings(config_dir: str = "config") -> Dict[str, Any]:
    path = os.path.join(config_dir, "settings.yaml")
    return load_yaml(path)
