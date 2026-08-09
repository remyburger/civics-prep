import { useState } from "react";
import { Check, X, Eye, Mic } from "lucide-react";
import { drawInterviewSet, resolveAnswers } from "../utils/quizEngine";
import { recordAnswer, addHistoryEntry } from "../utils/storage";

const PASS_AT = 12;
const FAIL_AT = 9;
const SET_SIZE = 20;

export default function Interview({ progress, setProgress, settings, onFinished }) {
  const [phase, setPhase] = useState("intro"); // intro | active | done
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stamp, setStamp] = useState(null);
  const [result, setResult] = useState(null);
  const [finishing, setFinishing] = useState(false);

  function begin() {
    setQuestions(drawInterviewSet(SET_SIZE));
    setIdx(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setRevealed(false);
    setStamp(null);
    setResult(null);
    setFinishing(false);
    setPhase("active");
  }

  function finish(finalCorrect, finalAsked) {
    const passed = finalCorrect >= PASS_AT;
    const entry = { date: Date.now(), correct: finalCorrect, asked: finalAsked, passed };
    addHistoryEntry(entry);
    setResult(entry);
    setPhase("done");
    if (onFinished) onFinished();
  }

  function mark(wasCorrect) {
    const q = questions[idx];
    setProgress(recordAnswer(progress, q.id, wasCorrect));
    const nextCorrect = correctCount + (wasCorrect ? 1 : 0);
    const nextIncorrect = incorrectCount + (wasCorrect ? 0 : 1);
    setCorrectCount(nextCorrect);
    setIncorrectCount(nextIncorrect);
    setStamp(wasCorrect ? "correct" : "incorrect");

    const asked = idx + 1;
    if (nextCorrect >= PASS_AT || nextIncorrect >= FAIL_AT || asked >= SET_SIZE) {
      setFinishing(true);
      setTimeout(() => finish(nextCorrect, asked), 550);
    }
  }

  function advance() {
    setIdx((i) => i + 1);
    setRevealed(false);
    setStamp(null);
  }

  if (phase === "intro") {
    return (
      <div>
        <p className="app-eyebrow">Mock Interview</p>
        <h1 className="h1">Simulated Naturalization Test</h1>
        <div className="card">
          <p className="muted" style={{ marginTop: 0 }}>
            The officer asks up to <strong>20 questions</strong> from the full pool of 128, drawn at
            random. You need <strong>12 correct</strong> to pass. The test stops as soon as you reach
            12 correct or 9 incorrect — same as the real interview.
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            Answer out loud before revealing the answer, just like you will in the interview room.
          </p>
        </div>
        <button className="btn btn-primary" onClick={begin}>
          <Mic size={17} /> Begin mock interview
        </button>
      </div>
    );
  }

  if (phase === "done" && result) {
    return (
      <div>
        <p className="app-eyebrow">Mock Interview</p>
        <h1 className="h1">Result</h1>
        <div className="card card-double-border" style={{ textAlign: "center" }}>
          <div
            className="seal"
            style={{ borderColor: result.passed ? "var(--stamp-green)" : "var(--stamp-red)" }}
          >
            <div className="seal-number">
              {result.correct}/{result.asked}
            </div>
            <div className="seal-label">{result.passed ? "Pass" : "Retry"}</div>
          </div>
          <p className="muted" style={{ marginTop: 16, marginBottom: 0 }}>
            {result.passed
              ? "That's a passing score. Run another round any time to stay sharp."
              : "Not quite a pass this time — review the missed questions in Practice, then try again."}
          </p>
        </div>
        <button className="btn btn-primary" onClick={begin}>
          Start another interview
        </button>
      </div>
    );
  }

  const q = questions[idx];
  if (!q) return null;
  const answers = resolveAnswers(q, settings);
  const pct = Math.round(((idx + (stamp ? 1 : 0)) / SET_SIZE) * 100);

  return (
    <div>
      <p className="app-eyebrow">Mock Interview</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="pill">Question {idx + 1} of {SET_SIZE}</span>
        <span className="pill">
          {correctCount} correct · {incorrectCount} missed
        </span>
      </div>
      <div className="progress-track" style={{ marginBottom: 18 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="card flashcard">
        {stamp && <div className={`stamp stamp-${stamp}`}>{stamp === "correct" ? "Correct" : "Review"}</div>}
        <p className="section-label" style={{ marginBottom: 10 }}>
          {q.section}
        </p>
        <p className="flashcard-question">{q.question}</p>
        {revealed && (
          <ul className="answer-list">
            {answers.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        )}
      </div>

      {!revealed ? (
        <button className="btn btn-outline-brass" onClick={() => setRevealed(true)}>
          <Eye size={17} /> Show answer
        </button>
      ) : !stamp ? (
        <div className="btn-row">
          <button className="btn btn-secondary" style={{ color: "var(--stamp-red)", borderColor: "var(--stamp-red)" }} onClick={() => mark(false)}>
            <X size={17} /> Missed it
          </button>
          <button className="btn btn-primary" onClick={() => mark(true)}>
            <Check size={17} /> Got it right
          </button>
        </div>
      ) : !finishing ? (
        <button className="btn btn-primary" onClick={advance}>
          Next question
        </button>
      ) : (
        <p className="muted" style={{ textAlign: "center" }}>Scoring interview…</p>
      )}
    </div>
  );
}
