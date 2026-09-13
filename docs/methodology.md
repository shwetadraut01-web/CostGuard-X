# CostGuard-X Statistical & FinOps Analytical Methodology

## 1. No-Machine-Learning Rationale

In enterprise cloud cost optimization (FinOps), black-box machine learning models (Random Forest, XGBoost, Neural Networks, Isolation Forest) present critical drawbacks:
- **Lack of Transparency**: Engineering leads cannot trace why an instance was flagged.
- **Data Leakage & Instability**: Changing instance pricing or scaling patterns cause unexplainable classification drift.
- **Academic Evaluation**: Demonstrates rigorous statistical time-series analysis, descriptive statistics, feature engineering, and explainable rule matrices.

---

## 2. Statistical Anomaly Detection Equations

### A. Moving Average Baseline
Establishes a 7-day rolling window baseline ($\mu_{7d}$):
$$\mu_{7d}(t) = \frac{1}{7} \sum_{i=0}^{6} x(t-i)$$

An anomaly is flagged when actual daily spend $x(t)$ exceeds baseline by threshold $\tau_{ma} = 35\%$:
$$x(t) \ge \mu_{7d}(t) \cdot \left(1 + \frac{\tau_{ma}}{100}\right)$$

### B. Standard Z-Score
$$Z = \frac{x(t) - \mu}{\sigma}$$
- **Warning**: $Z \ge 2.0$
- **Critical**: $Z \ge 3.0$

### C. Robust Z-Score via Median Absolute Deviation (MAD)
Because cloud billing data exhibits extreme non-Gaussian skew, standard mean ($\mu$) and standard deviation ($\sigma$) can be distorted by historical spikes. The Robust Z-score uses the median and MAD:
$$\text{MAD} = \text{median}\left( |x_i - \text{median}(x)| \right)$$
$$\text{Robust } Z = \frac{0.6745 \cdot (x(t) - \text{median}(x))}{\text{MAD}}$$
- **Warning**: $\text{Robust } Z \ge 2.5$
- **Critical**: $\text{Robust } Z \ge 3.5$

---

## 3. Waste Fingerprint Classification Matrix

| Category | CPU Max | Runtime (hrs/day) | Env Type | Cost Condition |
| :--- | :--- | :--- | :--- | :--- |
| **Idle Resource** | $< 10\%$ | $\ge 18$ | Any | Spend $\ge \$1.00$/day |
| **Over-provisioning** | $< 20\%$ | Any | Any | Instance = Large/XLarge, Cost $\ge \$5.00$/day |
| **Non-prod Waste** | $< 15\%$ | $\ge 20$ | Dev / Test / Staging | Weekend 24/7 continuous runtime |
| **Abnormal Storage Growth** | N/A | Any | Any | Storage growth $> 15\%$/day with requests $< 5\%$ |
| **Legitimate Growth** | $\ge 40\%$ | Any | Any | Cost $\uparrow > 20\%$, Requests $\uparrow > 20\%$ (Not Waste) |
| **Cost Spike** | Any | Any | Any | Sudden cost jump $> 50\%$ above baseline |

---

## 4. Counterfactual Cost Equations

Let $C_{current}$ be daily cost and $h_{current}$ be daily runtime hours.
1. **Idle Resource Scenario**:
   $$C_{cf} = C_{current} \cdot \left( \frac{h_{target}}{h_{current}} \right) \quad (h_{target} = 10\text{ hours/day})$$
2. **Avoidable Savings**:
   $$\text{Avoidable Daily} = \max(0, C_{current} - C_{cf})$$
   $$\text{Avoidable Monthly} = \text{Avoidable Daily} \times 30$$
