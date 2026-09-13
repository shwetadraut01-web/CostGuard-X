"""
Creates the 5 academic Jupyter Notebooks for CostGuard-X.
"""
import os
import json

def make_notebook(cells):
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.13.1"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }

def code_cell(code_str):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [line + "\n" for line in code_str.split("\n")]
    }

def markdown_cell(md_str):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in md_str.split("\n")]
    }

def build_notebooks():
    os.makedirs("notebooks", exist_ok=True)
    
    # 01 Data Exploration Notebook
    nb1 = make_notebook([
        markdown_cell("# CostGuard-X: 01 - Data Exploration & Schema Validation\nThis notebook demonstrates raw AWS cost, resource metrics, metadata, and event dataset loading, schema validation, and missing value checks."),
        code_cell("import sys\nsys.path.append('..')\nfrom src.ingestion.data_loader import DataLoader\nfrom src.validation.schema_validator import SchemaValidator"),
        code_cell("loader = DataLoader('../data/sample')\ndf_cost = loader.load_cost_data()\ndf_metrics = loader.load_metrics_data()\ndf_meta = loader.load_metadata()\ndf_events = loader.load_events_data()"),
        code_cell("print('Cost Data Shape:', df_cost.shape)\nprint('Metrics Data Shape:', df_metrics.shape)\nprint('Metadata Shape:', df_meta.shape)\nprint('Events Data Shape:', df_events.shape)"),
        code_cell("df_cost.head(10)"),
        code_cell("is_valid, errors = SchemaValidator.validate_cost_schema(df_cost)\nprint('Cost Schema Valid:', is_valid)\nif errors:\n    print('Schema Errors:', errors)")
    ])
    
    # 02 EDA Notebook
    nb2 = make_notebook([
        markdown_cell("# CostGuard-X: 02 - Exploratory Data Analysis & Cost Breakdown\nAnalyzes cloud spend distributions across AWS services, regions, environments, and resources."),
        code_cell("import sys\nsys.path.append('..')\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom src.pipeline import CostGuardPipeline"),
        code_cell("pipeline = CostGuardPipeline('../data/sample', '../config', '../knowledge')\nresults = pipeline.run_pipeline()"),
        code_cell("df_srv = pd.DataFrame(results['cost_by_service'])\nprint('Cost by Service:')\ndisplay(df_srv)"),
        code_cell("df_trends = pd.DataFrame(results['daily_trends'])\ndf_trends['date'] = pd.to_datetime(df_trends['date'])\nplt.figure(figsize=(12, 5))\nplt.plot(df_trends['date'], df_trends['cost'], marker='o', color='#3b82f6')\nplt.title('Daily Total Cloud Spend Trend')\nplt.xlabel('Date')\nplt.ylabel('Cost ($)')\nplt.grid(True, linestyle='--', alpha=0.5)\nplt.show()")
    ])

    # 03 Statistical Analysis Notebook
    nb3 = make_notebook([
        markdown_cell("# CostGuard-X: 03 - Statistical Anomaly Detection (No-ML)\nCompares Moving Average, Standard Z-score, and Robust Z-score via Median Absolute Deviation (MAD)."),
        code_cell("import sys\nsys.path.append('..')\nimport pandas as pd\nfrom src.pipeline import CostGuardPipeline"),
        code_cell("pipeline = CostGuardPipeline('../data/sample', '../config', '../knowledge')\nresults = pipeline.run_pipeline()\ndf_anom = pd.DataFrame(results['anomalies'])"),
        code_cell("print('Total Flagged Anomalies:', len(df_anom))\ndisplay(df_anom.head(15))"),
        code_cell("print('Anomalies Breakdown by Severity:')\nprint(df_anom['severity'].value_counts())")
    ])

    # 04 Waste Analysis Notebook
    nb4 = make_notebook([
        markdown_cell("# CostGuard-X: 04 - Explainable Waste Fingerprinting & Confidence Scoring\nEvaluates rule-based waste categories (Idle Resource, Over-provisioning, Non-production Waste, Storage Growth, Legitimate Growth)."),
        code_cell("import sys\nsys.path.append('..')\nimport pandas as pd\nfrom src.pipeline import CostGuardPipeline"),
        code_cell("pipeline = CostGuardPipeline('../data/sample', '../config', '../knowledge')\nresults = pipeline.run_pipeline()\nwaste_cases = results['waste_cases']"),
        code_cell("for w in waste_cases:\n    print(f\"Resource: {w['resource_id']} | Category: {w['category']} | Confidence: {w['confidence']['score']}/100\")\n    print('  Evidence:', w['recommendation']['evidence'])\n    print('  Recommendation:', w['recommendation']['primary_recommendation'])\n    print('-'*80)")
    ])

    # 05 Counterfactual Analysis Notebook
    nb5 = make_notebook([
        markdown_cell("# CostGuard-X: 05 - Counterfactual Cost & What-If Scenario Modeling\nSimulates potential avoidable cloud spend under reduced runtime hours, resized instances, and storage lifecycle policies."),
        code_cell("import sys\nsys.path.append('..')\nimport pandas as pd\nfrom src.counterfactual.simulator import CounterfactualSimulator\nfrom src.pipeline import CostGuardPipeline"),
        code_cell("pipeline = CostGuardPipeline('../data/sample', '../config', '../knowledge')\nresults = pipeline.run_pipeline()\ndf_waste = pd.DataFrame([w for w in results['waste_cases'] if w['is_waste']])"),
        code_cell("what_if_res = CounterfactualSimulator.simulate_what_if_scenario(df_waste, custom_runtime_hours=10.0, custom_downsize_pct=40.0)\nprint('Total Current Monthly Spend: $', what_if_res['total_current_monthly_cost'])\nprint('Total Avoidable Monthly Spend: $', what_if_res['total_potential_avoidable_monthly'])\nprint('Overall Percentage Savings: ', what_if_res['overall_percentage_savings'], '%')")
    ])

    with open("notebooks/01_data_exploration.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb1, f, indent=2)
    with open("notebooks/02_eda.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb2, f, indent=2)
    with open("notebooks/03_statistical_analysis.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb3, f, indent=2)
    with open("notebooks/04_waste_analysis.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb4, f, indent=2)
    with open("notebooks/05_counterfactual_analysis.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb5, f, indent=2)

    print("Created 5 Jupyter Notebooks in 'notebooks/'.")

if __name__ == "__main__":
    build_notebooks()
