import { ArrowRight, Mic } from "lucide-react";
import { computeStats } from "../utils/quizEngine";

function readinessMessage(pct, attempted) {
  if (attempted === 0) {
    return "Let's begin. Start with Practice to see your first ten questions.";
  }
  if (pct >= 90) {
    return "You're in strong shape. Take a mock interview to confirm you're ready.";
  }
  if (pct >= 70) {
    return "Getting close — keep working the review pile in Practice.";
  }
  if (pct >= 40) {
    return "Solid progress. A little more repetition and this will stick.";
  }
  return "Just getting started — a few short sessions will move this fast.";
}

export default function Home({ progress, history, onNavigate }) {
  const stats = computeStats(progress);
  const pct = Math.round((stats.mastered / stats.total) * 100);
  const lastInterview = history[0];

  return (
    <div>
      <p className="app-eyebrow">Certificate of Study Progress</p>
      <h1 className="h1">128 Civics Questions</h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        2025 Naturalization Civics Test — 20 questions asked, 12 correct to pass.
      </p>

      <div className="card card-double-border">
        <div className="seal">
          <div className="seal-number">{pct}%</div>
          <div className="seal-label">Mastered</div>
        </div>
        <div className="stat-grid">
          <div className="stat-tile">
            <div className="num">{stats.mastered}</div>
            <div className="lbl">Sealed</div>
          </div>
          <div className="stat-tile">
            <div className="num">{stats.learning}</div>
            <div className="lbl">In progress</div>
          </div>
          <div className="stat-tile">
            <div className="num">{stats.review}</div>
            <div className="lbl">Needs review</div>
          </div>
        </div>
        <p className="muted" style={{ marginTop: 18, marginBottom: 0, textAlign: "center" }}>
          {readinessMessage(pct, stats.attempted)}
        </p>
      </div>

      <button className="btn btn-primary" onClick={() => onNavigate("practice")} style={{ marginBottom: 10 }}>
        Continue practicing <ArrowRight size={17} />
      </button>
      <button className="btn btn-secondary" onClick={() => onNavigate("interview")}>
        <Mic size={16} /> Take a mock interview
      </button>

      {lastInterview && (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="section-label">Last mock interview</p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="h2" style={{ marginBottom: 2 }}>
                {lastInterview.correct} / {lastInterview.asked} correct
              </div>
              <p className="muted" style={{ margin: 0 }}>
                {new Date(lastInterview.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className="pill"
              style={{
                color: lastInterview.passed ? "var(--stamp-green)" : "var(--stamp-red)",
                background: "transparent",
                border: `1.5px solid ${lastInterview.passed ? "var(--stamp-green)" : "var(--stamp-red)"}`,
              }}
            >
              {lastInterview.passed ? "PASS" : "RETRY"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
