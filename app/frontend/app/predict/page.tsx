import { PredictionConsole } from "../components/prediction-console";

export default function PredictPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8">
      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Live Prediction Console</h1>
        <p className="mt-2 text-slate-300">
          Score a single transaction against the fraud model and review three outputs in one place:
          fraud probability, model decision, and risk band.
        </p>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Before you submit</p>
          <p className="mt-1">
            Use a realistic amount and choose the card network/type when known. This page is built
            for quick demos and analyst walkthroughs, not only for technical users.
          </p>
        </div>
      </section>

      <PredictionConsole />
    </div>
  );
}
