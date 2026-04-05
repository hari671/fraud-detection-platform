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
            FraudShield helps teams detect suspicious payment behavior in real time. Use a guided
            interface to test transactions, understand model confidence, and interpret risk levels
            in plain language.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Open Dashboard
            </Link>
            <Link
              href="/predict"
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Run Prediction
            </Link>
            <Link
              href="/metrics"
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Explore Metrics
            </Link>
            <Link
              href="/risk-guide"
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              Read Risk Guide
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">How predictions work</h2>
          <p className="mt-2 text-sm text-slate-300">
            The model reads transaction signals (amount, card network, and card type), then returns:
            a fraud probability, a binary fraud/not-fraud decision, and an easy risk band.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">Designed for non-technical users</h2>
          <p className="mt-2 text-sm text-slate-300">
            Every page includes simple explanations so analysts, product teams, and recruiters can
            understand what the model is saying and what action to take next.
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Platform Areas</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            {
              title: "Dashboard",
              description: "Combined overview with metrics, prediction form, and risk cards.",
              href: "/dashboard",
            },
            {
              title: "Predict",
              description: "Focused single-transaction scoring experience.",
              href: "/predict",
            },
            {
              title: "Metrics",
              description: "Model performance breakdown and metric interpretation.",
              href: "/metrics",
            },
            {
              title: "Risk Guide",
              description: "Actionable response playbook by Low/Medium/High risk.",
              href: "/risk-guide",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-cyan-400/40"
            >
              <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-2 text-xs text-slate-400">{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
