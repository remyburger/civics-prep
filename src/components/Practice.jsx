import { useState, useEffect, useCallback } from "react";
import { Check, X, Eye } from "lucide-react";
import { pickWeighted, pickWeightedFromWeak, resolveAnswers } from "../utils/quizEngine";
import { recordAnswer, getMasteryLevel } from "../utils/storage";

export default function Practice({ progress, setProgress, settings }) {
  const [weakOnly, setWeakOnly] = useState(false);
  const [question, setQuestion] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [stamp, setStamp] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);

  const nextQuestion = useCallback(
    (excludeId = null) => {
      const picker = weakOnly ? pickWeightedFromWeak : pickWeighted;
      setQuestion(picker(progress, excludeId));
      setRevealed(false);
      setStamp(null);
    },
    [weakOnly, progress]
  );

  useEffect(() => {
    nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weakOnly]);

  if (!question) return null;

  const level = getMasteryLevel(progress[question.id]);
  const answers = resolveAnswers(question, settings);

  function mark(wasCorrect) {
    setStamp(wasCorrect ? "correct" : "incorrect");
    setProgress(recordAnswer(progress, question.id, wasCorrect));
    setSessionCount((c) => c + 1);
  }

  return (
    <div>
      <p className="app-eyebrow">Practice</p>
      <h1 className="h1">Flashcards</h1>

      <div className="btn-row" style={{ marginBottom: 16 }}>
        <button
          className={weakOnly ? "btn btn-secondary" : "btn btn-primary"}
          style={{ fontSize: 13.5, padding: "10px 14px" }}
          onClick={() => setWeakOnly(false)}
        >
          All 128
        </button>
        <button
          className={weakOnly ? "btn btn-primary" : "btn btn-secondary"}
          style={{ fontSize: 13.5, padding: "10px 14px" }}
          onClick={() => setWeakOnly(true)}
        >
          Weak questions
        </button>
      </div>

      <div className="card flashcard">
        {stamp && <div className={`stamp stamp-${stamp}`}>{stamp === "correct" ? "Correct" : "Review"}</div>}
        <div className="flashcard-meta">
          <span className="section-label" style={{ margin: 0 }}>
            {question.section}
          </span>
          <span className={`mastery-dot mastery-${level}`} title={level}></span>
        </div>
        <p className="flashcard-question">{question.question}</p>

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
      ) : (
        <button className="btn btn-primary" onClick={() => nextQuestion(question.id)}>
          Next question
        </button>
      )}

      <p className="muted" style={{ textAlign: "center", marginTop: 16 }}>
        {sessionCount} question{sessionCount === 1 ? "" : "s"} this session
      </p>
    </div>
  );
}
