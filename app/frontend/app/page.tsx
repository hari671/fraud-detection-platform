import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 shadow-2xl shadow-slate-950/40 sm:p-10">
        <div className="pointer-events-none absolute -right-28 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative">
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
            FraudShield
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Real-Time Fraud Detection and Risk Scoring Platform
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300 sm:text-lg">
            FraudShield helps teams screen transactions instantly using a trained machine learning
            model. Instead of manually guessing risk, the platform returns a clear fraud
            probability, decision label, and risk band so people can act quickly and confidently.
          </p>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
            <p className="font-semibold text-slate-100">What this site includes</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Live prediction page for single transaction risk scoring</li>
              <li>Model metrics page with plain-language explanations</li>
              <li>Risk guide page that explains low, medium, and high risk bands</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Prediction</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Run Live Fraud Scoring</h2>
          <p className="mt-2 text-sm text-slate-300">
            Enter transaction amount, card network, and card type to get a live model prediction
            from the backend API.
          </p>
          <Link
            href="/predict"
            className="mt-4 inline-flex rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Open Predict Page
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Metrics</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Understand Model Quality</h2>
          <p className="mt-2 text-sm text-slate-300">
            See ROC AUC and PR AUC scores with simple explanations so non-technical viewers can
            understand what each metric means.
          </p>
          <Link
            href="/metrics"
            className="mt-4 inline-flex rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Open Metrics Page
          </Link>
        </article>

        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-950/20">
          <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Risk Guide</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Interpret Risk Bands</h2>
          <p className="mt-2 text-sm text-slate-300">
            Learn what low, medium, and high risk mean and what actions are usually taken for each
            decision band.
          </p>
          <Link
            href="/risk-guide"
            className="mt-4 inline-flex rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Open Risk Guide
          </Link>
        </article>
      </section>
    </div>
  );
}
