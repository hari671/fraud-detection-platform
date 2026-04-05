import { PredictionConsole } from "../components/prediction-console";

export default function PredictPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8">
      <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-bold tracking-tight text-white">Live Prediction Console</h1>
        <p className="mt-2 text-slate-300">
          Score one transaction in real time using plain-language inputs: amount, card network, and
          card type. Results include probability, predicted label, and risk band in one view.
        </p>
      </section>

      <PredictionConsole />
    </div>
  );
}
