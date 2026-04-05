export type RiskBandLabel = "Low Risk" | "Medium Risk" | "High Risk";

export const MODEL_METRICS = [
  {
    model: "Logistic Regression",
    rocAuc: 0.7443,
    prAuc: 0.1325,
    notes: "Interpretable baseline model for comparison.",
  },
  {
    model: "XGBoost",
    rocAuc: 0.9513,
    prAuc: 0.7136,
    notes: "Best overall ranking and fraud recall performance.",
  },
  {
    model: "CatBoost",
    rocAuc: 0.9365,
    prAuc: 0.6436,
    notes: "Strong gradient boosting alternative for tabular data.",
  },
] as const;

export const PRODUCT_OPTIONS = ["W", "H", "C", "S", "R"] as const;

export const CARD_NETWORK_OPTIONS = [
  "visa",
  "mastercard",
  "american express",
  "discover",
  "other",
] as const;

export const RISK_BANDS: { label: RiskBandLabel; description: string }[] = [
  {
    label: "Low Risk",
    description:
      "Likely legitimate behavior. These transactions are usually approved with minimal friction.",
  },
  {
    label: "Medium Risk",
    description:
      "Some suspicious signals are present. Route these transactions to additional checks or step-up authentication.",
  },
  {
    label: "High Risk",
    description:
      "Strong fraud indicators. Consider manual review, temporary hold, or transaction blocking.",
  },
];
