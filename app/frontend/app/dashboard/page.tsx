import Link from "next/link";
import { PredictionConsole } from "../components/prediction-console";
import { MODEL_METRICS, RISK_BANDS } from "../lib/dashboard-data";

function riskBandCardStyle(label: string): string {
  if (label === "High Risk") {
    return "border-rose-300/30 bg-rose-500/10";
  }
  if (label === "Medium Risk") {
    return "border-amber-300/30 bg-amber-500/10";
  }
  return "border-emerald-300/30 bg-emerald-500/10";
}

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40 sm:p-10">
        <div className="pointer-events-none absolute -right-28 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            FraudShield Dashboard
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Monitor, Predict, and Interpret Fraud Risk in One Place
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            This dashboard combines model performance, real-time transaction scoring, and risk
            guidance so you can move from prediction to action quickly.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Model Metrics</h2>
          <Link
            href="/metrics"
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-600"
          >
            Open full metrics page
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {MODEL_METRICS.map((item) => (
            <article
              key={item.model}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:border-cyan-300/40"
            >
              <h3 className="text-lg font-semibold text-slate-100">{item.model}</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-400">ROC AUC</dt>
                  <dd className="font-semibold text-slate-100">{item.rocAuc.toFixed(4)}</dd>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
                  <dt className="text-slate-400">PR AUC</dt>
                  <dd className="font-semibold text-slate-100">{item.prAuc.toFixed(4)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-slate-400">{item.notes}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <PredictionConsole />

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30">
          <h2 className="text-2xl font-semibold text-white">Risk Band Explanation</h2>
          <p className="mt-2 text-sm text-slate-300">
            Raw probabilities are translated into operational risk bands to guide what to do next.
          </p>
          <div className="mt-6 space-y-3">
            {RISK_BANDS.map((band) => (
              <article
                key={band.label}
                className={`rounded-xl border px-4 py-3 ${riskBandCardStyle(band.label)}`}
              >
                <h3 className="text-sm font-semibold text-slate-100">{band.label}</h3>
                <p className="mt-1 text-sm/6 text-slate-300">{band.description}</p>
              </article>
            ))}
          </div>
          <Link
            href="/risk-guide"
            className="mt-5 inline-flex text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
          >
            Open full risk guide →
          </Link>
        </div>
      </section>
    </div>
  );
}
