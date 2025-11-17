"use client";

import React, { useEffect, useRef, useState } from "react";

// Single-file Next.js page (App Router) — Tailwind CSS required
// Drop this into your project at: /app/page.tsx

const MODELS = [
  { name: "Random Forest", sub: "Ensemble classifier", body: `Trains many decision trees to learn attack patterns.\nCombines votes to produce stable, robust predictions.\nHandles noisy telemetry and mixed feature types.\nLowers overfitting compared to single trees.` },
  { name: "XGBoost", sub: "Boosted trees", body: `Gradient boosting learns from previous errors sequentially.\nExcellent for imbalanced intrusion labels with high accuracy.\nProduces feature importance for explainability.` },
  { name: "SVM", sub: "Margin classifier", body: `Finds optimal boundaries between normal and malicious events.\nWorks well when attack samples are few but separable.\nUseful as a specialist detector for edge cases.` },
  { name: "Logistic Regression", sub: "Interpretable baseline", body: `Simple probability-based classifier for quick scoring.\nEasy to interpret feature coefficients for analysts.\nVery fast in streaming or resource-constrained environments.` },
  { name: "KNN", sub: "Distance-based", body: `Flags anomalies by comparing to nearest neighbours.\nNo training required; ideal for quick prototypes.\nSensitive to feature scaling—use with scalers.` },
  { name: "Naive Bayes", sub: "Probabilistic", body: `Fast probabilistic scoring assuming feature independence.\nWorks well for high-dimension categorical telemetry.\nProduces interpretable likelihoods for events.` },
  { name: "Decision Tree", sub: "Rule model", body: `Learns human-readable rules from telemetry features.\nEasy to visualize and audit for security teams.\nFast inference and small memory footprint.` },
  { name: "Isolation Forest", sub: "Anomaly detector", body: `Specialized for unsupervised anomaly detection.\nIsolates rare events that deviate from normal patterns.\nGood for catching novel or zero-day anomalies.` },
  { name: "Autoencoder", sub: "Neural reconstruction", body: `Learns compact latent representation of normal traffic.\nHigh reconstruction error flags anomalous inputs.\nUseful in ensemble for deep anomaly signals.` },
  { name: "PCA", sub: "Dimensionality reduction", body: `Reduces feature dimensions while preserving variance.\nSpeeds up downstream models and reduces noise.\nGood pre-step for clustering or anomaly detection.` },
  { name: "Scaler", sub: "Preprocessing", body: `Normalizes feature ranges for fair comparisons.\nEssential for distance-based and gradient models.\nEnables consistent thresholds for alerts.` },
  { name: "Selected Features", sub: "Feature selection", body: `Picks the most predictive features for detection.\nReduces dimensionality and speeds inference.\nImproves generalization and reduces overfitting.` },
  { name: "Feature Engineering", sub: "Create signals", body: `Transforms raw telemetry into informative features.\nCreates aggregates, time-window stats and flags.\nOften yields the biggest accuracy improvements.` },
  { name: "Data Pre-processing", sub: "Cleaning & Impute", body: `Cleans logs, handles missing and malformed fields.\nRemoves duplicates and synchronizes timestamps.\nApplies encoding/scaling needed by models.` },
  { name: "Train–Test Split", sub: "Validation", body: `Separates data for honest evaluation of models.\nPrevents overfitting by testing on unseen samples.\nEnables hyperparameter tuning and model selection.` },
  { name: "Evaluation Metrics", sub: "Precision & recall", body: `Measures detection accuracy and trade-offs.\nUse precision, recall, F1, ROC-AUC for classification.\nTrack false positive rate to reduce alert fatigue.` },
];

const QA_SLIDES = [
  {
    text: "An attacker who steals credentials can quietly access resources. Detecting odd access patterns early blocks data theft.",
    example: "Example: A developer's account downloads backups at 3 AM — alert fired when download size & time deviate.",
  },
  {
    text: "Slow exfiltration hides inside normal traffic over days. ML spots statistical drifts across many features.",
    example: "Example: Small daily uploads to an external host — ensemble detector flags the rising trend.",
  },
  {
    text: "Some intrusions use legitimate tools (living-off-the-land). Models see behavior patterns rules miss.",
    example: "Example: A common admin tool is used in an unusual sequence — anomaly scoring raises priority.",
  },
  {
    text: "Explainable alerts help teams act correctly—showing which fields and events caused the alarm.",
    example: "Example: Feature importance reveals which IP & command triggered the alert, speeding investigation.",
  },
];

export default function Page() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [qaIndex, setQaIndex] = useState(0);
  const qaTimer = useRef<number | null>(null);

  useEffect(() => {
    // auto-advance QA
    qaTimer.current = window.setInterval(() => {
      setQaIndex((i) => (i + 1) % QA_SLIDES.length);
    }, 4200);
    return () => {
      if (qaTimer.current) window.clearInterval(qaTimer.current);
    };
  }, []);

  useEffect(() => {
    // adjust height of open card content
    contentRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (openIndex === idx) {
        el.style.height = el.scrollHeight + "px";
      } else {
        el.style.height = "0px";
      }
    });
  }, [openIndex]);

  useEffect(() => {
    const onResize = () => {
      if (openIndex !== null) {
        const el = contentRefs.current[openIndex];
        if (el) el.style.height = el.scrollHeight + "px";
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [openIndex]);

  function toggleCard(i: number) {
    setOpenIndex((cur) => (cur === i ? null : i));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06151a] via-[#021719] to-[#021719] text-[#e6fbf8] p-8 flex justify-center">
      <div className="w-full max-w-[1100px]">

        {/* Header */}
        <header className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-4">
            <div className="w-[56px] h-[56px] rounded-lg bg-gradient-to-b from-[#063b36] to-[#01423a] flex items-center justify-center font-extrabold text-[#0fffe0] text-lg">ID</div>
            <div>
              <div className="text-[#09d18a] font-extrabold text-sm">Data Intrusion Detection</div>
              <div className="text-sm text-[#9fc7c5]">AI + telemetry for real-time security</div>
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#models" className="font-bold text-sm text-white hover:opacity-90">Description</a>
            <a href="#why" className="font-bold text-sm text-white hover:opacity-90">Why it matters</a>
            <a href="#about" className="font-bold text-sm text-white hover:opacity-90">About</a>
            <a href="/dashboard" className="px-4 py-2 rounded-full bg-gradient-to-b from-[#09d18a] to-[#07a76a] text-[#04221a] font-extrabold shadow-md">Let's move</a>
          </nav>
        </header>

        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-7 mb-12">
          <div className="bg-white/3 rounded-xl p-8 shadow-[0_14px_44px_rgba(3,13,17,0.65)] border border-white/3">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/3 p-3 rounded-lg">🛡️</div>
              <div>
                <div className="text-sm text-[#9fc7c5]">Project</div>
                <div className="font-extrabold text-sm">Data Intrusion Detection System</div>
              </div>
            </div>

            <h1 className="text-4xl md:text-[48px] leading-tight font-extrabold text-white mb-3">AI monitoring to detect & stop data intrusions</h1>
            <p className="text-[#dff9f0] max-w-[820px] text-base">We transform telemetry into meaningful signals, feed robust models and produce prioritized alerts so security teams can act quickly and confidently.</p>

            <div className="flex gap-3 mt-6">
              <a href="/dashboard" className="px-4 py-2 rounded-full bg-gradient-to-b from-[#09d18a] to-[#07a76a] font-bold text-[#04221a]">Let's move forward</a>
              <a href="#models" className="px-4 py-2 rounded-full border border-white/5 text-[#9fc7c5] bg-transparent">Description — All Models Used</a>
            </div>
          </div>

          <aside className="bg-white/3 rounded-xl p-4">
            <h3 className="font-bold mb-3">Quick features</h3>
            <div className="flex flex-col gap-2">
              <span className="bg-white/2 rounded-md px-3 py-2 font-bold text-sm text-[#dff9f0]">Real-time alerts</span>
              <span className="bg-white/2 rounded-md px-3 py-2 font-bold text-sm text-[#dff9f0]">Explainable scoring</span>
              <span className="bg-white/2 rounded-md px-3 py-2 font-bold text-sm text-[#dff9f0]">Lightweight & scalable</span>
              <span className="bg-white/2 rounded-md px-3 py-2 font-bold text-sm text-[#dff9f0]">Stream-friendly</span>
            </div>
          </aside>
        </section>

        {/* MODELS GRID */}
        <section id="models" className="mt-16">
          <h3 className="text-[#cfeee8] text-lg font-bold mb-1">Description — All Models Used</h3>
          <div className="text-sm text-[#9fc7c5] mb-4">Two cards per row. Click a card to expand (only one open at a time).</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MODELS.map((m, i) => (
              <article
                key={m.name}
                tabIndex={0}
                onClick={() => toggleCard(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleCard(i); }}
                className={`relative bg-[rgba(255,255,255,0.03)] border border-white/4 rounded-xl p-4 transition-transform duration-200 overflow-visible ${openIndex === i ? 'translate-y-[-6px] shadow-[0_18px_48px_rgba(3,13,17,0.65)] bg-[rgba(255,255,255,0.04)]' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-[#eafff5]">{m.name}</div>
                    <div className="text-sm text-[#9fc7c5]">{m.sub}</div>
                  </div>

                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center border border-white/4 ${openIndex === i ? 'bg-gradient-to-b from-[#09d18a] to-[#07a76a]' : 'bg-[rgba(255,255,255,0.02)]'}`}>
                    <span className="block w-4 h-[2px] bg-[#9fc7c5] relative before:block before:absolute before:w-4 before:h-[2px] before:bg-[#9fc7c5] before:transform before:-translate-y-2 after:block after:absolute after:w-4 after:h-[2px] after:bg-[#9fc7c5] after:transform after:translate-y-2" />
                  </div>
                </div>

                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  className="mt-3 overflow-hidden transition-[height] duration-300 ease-in-out text-[#9fc7c5] text-sm leading-relaxed"
                  style={{ height: 0 }}
                >
                  <div className="whitespace-pre-line">{m.body}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BELOW GRID: Why + Q&A */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
          <section id="why" className="bg-[linear-gradient(180deg,rgba(255,255,255,0.01),rgba(255,255,255,0.005))] rounded-lg p-4 border border-white/6 max-h-[380px] overflow-auto">
            <h3 className="font-bold mb-3">Why this matters</h3>
            <ol className="list-decimal pl-5 text-[#eafff5] leading-7">
              <li><strong>Detect both known & unknown threats</strong> — ML finds subtle deviations conventional rules miss.</li>
              <li><strong>Reduce downtime</strong> — early detection prevents prolonged system outages.</li>
              <li><strong>Prevent data theft</strong> — identify exfiltration patterns quickly.</li>
              <li><strong>Improve incident response</strong> — prioritized alerts speed up remediation.</li>
              <li><strong>Lower false positives</strong> — ensembles & scoring reduce noise for ops teams.</li>
              <li><strong>Explainability</strong> — feature importance helps analysts understand alerts.</li>
              <li><strong>Adaptability</strong> — models retrain to catch new attack vectors.</li>
              <li><strong>Lightweight deployment</strong> — designed for streaming and low-latency scoring.</li>
              <li><strong>Scalability</strong> — handles large telemetry volumes efficiently.</li>
              <li><strong>Measurable security</strong> — track metrics to prove detection value.</li>
            </ol>
          </section>

          <aside className="space-y-3">
            <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.007))] rounded-lg p-4 border border-white/4 shadow-md" aria-live="polite">
              <div className="font-extrabold text-[#eafff5] text-sm mb-2">Q: Why is data intrusion important?</div>
              <div className="text-[#9fc7c5] min-h-[84px]" aria-atomic="true">
                <div className="mb-3">{QA_SLIDES[qaIndex].text}</div>
                <div className="text-xs bg-white/3 p-2 rounded-md">{QA_SLIDES[qaIndex].example}</div>
              </div>
              <div className="flex gap-2 mt-3" aria-hidden>
                {QA_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setQaIndex(i)}
                    className={`w-2 h-2 rounded-full ${qaIndex === i ? 'bg-[#09d18a] shadow-[0_6px_18px_rgba(4,65,52,0.15)]' : 'bg-white/6'}`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm text-[#9fc7c5]">Short animated story with examples — auto-plays</div>
          </aside>
        </div>

        {/* INFO & ABOUT */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="bg-[#0b2a31] p-4 rounded-md border border-white/6">
            <h3 className="text-white font-bold">Why it matters</h3>
            <ul className="text-[#e6fbf8] mt-2 list-disc pl-5 leading-7">
              <li>Detects both known and unknown intrusion attempts.</li>
              <li>Reduces downtime caused by hidden breaches.</li>
              <li>Identifies unusual behaviour in real time.</li>
              <li>Helps prevent critical data theft instantly.</li>
              <li>Improves accuracy using multiple ML models.</li>
            </ul>
          </section>

          <section id="about" className="bg-[#0b2a31] p-4 rounded-md border border-white/6">
            <h3 className="text-white font-bold">About us</h3>
            <p className="text-[#9fc7c5] mt-2 leading-6">We are a team of ML engineers researching real-time intrusion detection. Our goal is to build systems that detect threats early and accurately. We focus on explainable and efficient AI security tools.</p>
          </section>
        </div>

        <footer className="mt-16 text-center text-[#9fc7c5]">
          © {new Date().getFullYear()} Data Intrusion Detection — Built with ♥
        </footer>
      </div>
    </div>
  );
}
