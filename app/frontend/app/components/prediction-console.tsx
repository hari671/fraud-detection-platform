"use client";

import { FormEvent, useMemo, useState } from "react";
import { CARD_NETWORK_OPTIONS, PRODUCT_OPTIONS } from "../lib/dashboard-data";

type PredictionResponse = {
  fraud_probability: number;
  predicted_isFraud: number | boolean;
  risk_band: string;
};

type TransactionFormState = {
  TransactionAmt: string;
  ProductCD: string;
  card4: string;
};

const initialFormState: TransactionFormState = {
  TransactionAmt: "",
  ProductCD: PRODUCT_OPTIONS[0],
  card4: CARD_NETWORK_OPTIONS[0],
};

function formatAsPercent(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}

function resultPillStyle(riskBand: string): string {
  if (riskBand === "High Risk") {
    return "bg-rose-500/20 text-rose-200 ring-1 ring-rose-300/30";
  }
  if (riskBand === "Medium Risk") {
    return "bg-amber-500/20 text-amber-200 ring-1 ring-amber-300/30";
  }
  return "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-300/30";
}

export function PredictionConsole() {
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

    if (!hasValidAmount || parsedAmount < 0) {
      setError("Please enter a valid non-negative TransactionAmt.");
      return;
    }

    setIsSubmitting(true);

    try {
      // card6 is hidden from UI because users rarely know it;
      // backend/model imputes missing or default-compatible values.
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
            card6: "debit or credit",
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Prediction request failed (${response.status}).`);
      }

      const payload = (await response.json()) as PredictionResponse;
      setResult(payload);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Unable to reach the prediction API.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFraud =
    result?.predicted_isFraud === 1 ||
    result?.predicted_isFraud === true ||
    String(result?.predicted_isFraud).toLowerCase() === "true";

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40">
      <h2 className="text-2xl font-semibold text-white">Single Transaction Prediction</h2>
      <p className="mt-2 text-sm text-slate-300">
        Enter known transaction details, submit to the live FastAPI endpoint, and review the model
        risk output in real time.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-slate-200">Transaction Amount</span>
          <input
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-200">Product Code (ProductCD)</span>
            <select
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
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

          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-slate-200">Card Network</span>
            <select
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
              value={formState.card4}
              onChange={(event) =>
                setFormState((previous) => ({ ...previous, card4: event.target.value }))
              }
            >
              {CARD_NETWORK_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          <p className="font-medium text-slate-200">Why no card type field?</p>
          <p className="mt-1">
            <span className="font-mono text-slate-100">card6</span> (debit/credit class) is often
            unavailable to end users. The app uses a stable backend-compatible default so form
            completion stays easy.
          </p>
        </div>

        <button
          className="mt-1 inline-flex items-center justify-center rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Scoring Transaction..." : "Run Fraud Prediction"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Prediction result
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Fraud Probability</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">
                {formatAsPercent(result.fraud_probability)}
              </p>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Predicted Label</p>
              <p
                className={`mt-1 text-2xl font-semibold ${
                  isFraud ? "text-rose-300" : "text-emerald-300"
                }`}
              >
                {isFraud ? "Fraud" : "Not Fraud"}
              </p>
            </article>

            <article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Risk Band</p>
              <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${resultPillStyle(result.risk_band)}`}>
                {result.risk_band}
              </span>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}
