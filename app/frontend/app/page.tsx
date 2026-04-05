"use client";

import { FormEvent, useMemo, useState } from "react";

type PredictionResponse = {
  fraud_probability: number;
  predicted_isFraud: number | boolean;
  risk_band: string;
};

type RiskBandLabel = "Low Risk" | "Medium Risk" | "High Risk";

type TransactionFormState = {
  TransactionAmt: string;
  ProductCD: string;
  card4: string;
  card6: string;
};

const MODEL_METRICS = [
  {
    model: "Logistic Regression",
    rocAuc: 0.7443,
    prAuc: 0.1325,
  },
  {
    model: "XGBoost",
    rocAuc: 0.9513,
    prAuc: 0.7136,
  },
  {
    model: "CatBoost",
    rocAuc: 0.9365,
    prAuc: 0.6436,
  },
];

const PRODUCT_OPTIONS = ["W", "H", "C", "S", "R"];
const CARD4_OPTIONS = ["visa", "mastercard", "american express", "discover", "other"];
const CARD6_OPTIONS = ["debit", "credit", "charge card", "debit or credit"];

const initialFormState: TransactionFormState = {
  TransactionAmt: "",
  ProductCD: PRODUCT_OPTIONS[0],
  card4: CARD4_OPTIONS[0],
  card6: CARD6_OPTIONS[0],
};

function formatAsPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function getRiskBandStyle(riskBand: string) {
  if (riskBand === "High Risk") {
    return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
  }
  if (riskBand === "Medium Risk") {
    return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
  }
  return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
}

function PredictionResult({
  result,
}: {
  result: PredictionResponse;
}) {
  const isFraud =
    result.predicted_isFraud === 1 ||
    result.predicted_isFraud === true ||
    String(result.predicted_isFraud).toLowerCase() === "true";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Prediction result
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Fraud probability</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {formatAsPercent(result.fraud_probability)}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Predicted label</p>
          <p
            className={`mt-1 text-2xl font-semibold ${
              isFraud ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {isFraud ? "Fraud" : "Not Fraud"}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">Risk band</p>
          <span
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRiskBandStyle(
              result.risk_band,
            )}`}
          >
            {result.risk_band}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [formState, setFormState] = useState<TransactionFormState>(initialFormState);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsedAmount = useMemo(() => Number(formState.TransactionAmt), [formState.TransactionAmt]);
  const hasValidAmount = formState.TransactionAmt.length > 0 && Number.isFinite(parsedAmount);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!hasValidAmount) {
      setError("Please enter a valid numeric TransactionAmt.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            TransactionAmt: parsedAmount,
            ProductCD: formState.ProductCD,
            card4: formState.card4,
            card6: formState.card6,
          },
        }),
      });

      if (!response.ok) {
        const message = `Prediction request failed (${response.status})`;
        throw new Error(message);
      }

      const payload = (await response.json()) as PredictionResponse;
      setResult(payload);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Unable to reach the API endpoint.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const riskBands: { label: RiskBandLabel; description: string; classes: string }[] = [
    {
      label: "Low Risk",
      description:
        "Likely legitimate behavior. Transactions in this band can be approved with minimal friction.",
      classes: "bg-emerald-50 border-emerald-200 text-emerald-700",
    },
    {
      label: "Medium Risk",
      description:
        "Signals warrant additional review. Useful trigger point for adaptive authentication checks.",
      classes: "bg-amber-50 border-amber-200 text-amber-700",
    },
    {
      label: "High Risk",
      description:
        "Strong fraud indicators. Consider step-up verification, manual review, or transaction blocking.",
      classes: "bg-rose-50 border-rose-200 text-rose-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <main className="mx-auto w-full max-w-6xl px-6 py-12 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="absolute -right-28 -top-24 h-64 w-64 rounded-full bg-sky-100 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-indigo-100 blur-3xl" />
          <div className="relative">
            <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              FraudShield
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Real-Time Fraud Detection and Risk Scoring Platform
            </h1>
            <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
              Production-style dashboard for instant fraud scoring. Submit transaction attributes,
              run the trained model pipeline, and receive calibrated probability, decision, and
              risk band in one flow.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Model Metrics</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Benchmark snapshot
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {MODEL_METRICS.map((item) => (
              <article
                key={item.model}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.model}</h3>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <dt className="text-slate-600">ROC AUC</dt>
                    <dd className="font-semibold text-slate-900">{item.rocAuc.toFixed(4)}</dd>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <dt className="text-slate-600">PR AUC</dt>
                    <dd className="font-semibold text-slate-900">{item.prAuc.toFixed(4)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Single Transaction Prediction
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter required fields and submit to the FastAPI endpoint.
            </p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-700">TransactionAmt</span>
                <input
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="e.g. 125.49"
                  value={formState.TransactionAmt}
                  onChange={(event) =>
                    setFormState((previous) => ({
                      ...previous,
                      TransactionAmt: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="grid gap-1">
                <span className="text-sm font-medium text-slate-700">ProductCD</span>
                <select
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  value={formState.ProductCD}
                  onChange={(event) =>
                    setFormState((previous) => ({ ...previous, ProductCD: event.target.value }))
                  }
                >
                  {PRODUCT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-slate-700">card4</span>
                  <select
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    value={formState.card4}
                    onChange={(event) =>
                      setFormState((previous) => ({ ...previous, card4: event.target.value }))
                    }
                  >
                    {CARD4_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1">
                  <span className="text-sm font-medium text-slate-700">card6</span>
                  <select
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                    value={formState.card6}
                    onChange={(event) =>
                      setFormState((previous) => ({ ...previous, card6: event.target.value }))
                    }
                  >
                    {CARD6_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scoring Transaction..." : "Run Fraud Prediction"}
              </button>
            </form>

            {error && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            {result && <div className="mt-4">{<PredictionResult result={result} />}</div>}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Risk Band Explanation</h2>
            <p className="mt-2 text-sm text-slate-600">
              Banding converts raw fraud probability into operational actions.
            </p>
            <div className="mt-6 space-y-3">
              {riskBands.map((band) => (
                <article
                  key={band.label}
                  className={`rounded-xl border px-4 py-3 ${band.classes}`}
                >
                  <h3 className="text-sm font-semibold">{band.label}</h3>
                  <p className="mt-1 text-sm/6">{band.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
