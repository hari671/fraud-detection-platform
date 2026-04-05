import { MODEL_METRICS } from "../lib/dashboard-data";

export default function MetricsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Model Metrics</h1>
        <p className="mt-2 text-slate-300">
          Compare how each model separates fraud from non-fraud transactions, and learn what each
          metric means in plain language.
        </p>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">What is ROC AUC?</h2>
          <p className="mt-2 text-sm text-slate-300">
            ROC AUC measures how well a model ranks risky transactions above safe ones across all
            possible thresholds. Closer to 1.0 means better overall separation.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-lg font-semibold text-white">What is PR AUC?</h2>
          <p className="mt-2 text-sm text-slate-300">
            PR AUC focuses on fraud cases specifically, balancing precision (how many flagged are
            truly fraud) and recall (how many frauds are caught). This is especially important when
            fraud is rare.
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {MODEL_METRICS.map((item) => (
          <article
            key={item.model}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/20"
          >
            <h2 className="text-xl font-semibold text-slate-100">{item.model}</h2>
            <dl className="mt-4 space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                <dt className="text-slate-400">ROC AUC</dt>
                <dd className="font-semibold text-slate-100">{item.rocAuc.toFixed(4)}</dd>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                <dt className="text-slate-400">PR AUC</dt>
                <dd className="font-semibold text-slate-100">{item.prAuc.toFixed(4)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-slate-300">{item.notes}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
