import { RISK_BANDS } from "../lib/dashboard-data";

function bandStyle(label: string): string {
  if (label === "High Risk") {
    return "border-rose-300/30 bg-rose-500/10";
  }
  if (label === "Medium Risk") {
    return "border-amber-300/30 bg-amber-500/10";
  }
  return "border-emerald-300/30 bg-emerald-500/10";
}

export default function RiskGuidePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Risk Band Guide</h1>
        <p className="mt-2 text-slate-300">
          Use risk bands to convert model output into practical fraud operations decisions.
        </p>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">How to read this page</p>
          <p className="mt-1">
            The model returns a probability first. FraudShield then maps that score into a simpler
            label: Low, Medium, or High Risk. These labels help teams make faster and more
            consistent decisions.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {RISK_BANDS.map((band) => (
          <article key={band.label} className={`rounded-2xl border p-5 ${bandStyle(band.label)}`}>
            <h2 className="text-xl font-semibold text-slate-100">{band.label}</h2>
            <p className="mt-2 text-sm/6 text-slate-300">{band.description}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h2 className="text-xl font-semibold text-white">Recommended Actions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-emerald-300">Low Risk:</span> Auto-approve while
            monitoring post-authorization behavior.
          </li>
          <li>
            <span className="font-semibold text-amber-300">Medium Risk:</span> Require OTP,
            challenge flow, or enhanced verification checks.
          </li>
          <li>
            <span className="font-semibold text-rose-300">High Risk:</span> Route to manual review
            queue or block according to policy.
          </li>
        </ul>
      </section>
    </div>
  );
}
