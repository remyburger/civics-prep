import { useState } from "react";
import { Save, Trash2, ExternalLink } from "lucide-react";
import { VARIABLE_FIELD_LABELS } from "../data/defaultAnswers";
import { saveSettings, resetProgress } from "../utils/storage";

const FIELD_ORDER = [
  "president",
  "vp",
  "speaker",
  "chiefJustice",
  "senators",
  "representative",
  "governor",
  "stateCapital",
];

export default function Settings({ settings, setSettings, onReset }) {
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  function update(key, value) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  function save() {
    saveSettings(draft);
    setSettings(draft);
    setSaved(true);
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetProgress();
    onReset();
    setConfirmReset(false);
  }

  return (
    <div>
      <p className="app-eyebrow">Settings</p>
      <h1 className="h1">Your Answers</h1>
      <p className="muted" style={{ marginBottom: 18 }}>
        Some questions depend on who currently holds office or on your state. Fill these in so
        Practice, Browse, and Mock Interview quiz you on the right answer.{" "}
        <a
          href="https://www.uscis.gov/citizenship/testupdates"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--brass)" }}
        >
          Verify against USCIS updates <ExternalLink size={12} style={{ verticalAlign: -1 }} />
        </a>
      </p>

      <div className="card">
        {FIELD_ORDER.map((key) => (
          <div className="field" key={key}>
            <label htmlFor={key}>{VARIABLE_FIELD_LABELS[key]}</label>
            <input
              id={key}
              value={draft[key] || ""}
              onChange={(e) => update(key, e.target.value)}
              placeholder="Not set"
            />
          </div>
        ))}
        <button className="btn btn-primary" onClick={save}>
          <Save size={16} /> {saved ? "Saved" : "Save answers"}
        </button>
      </div>

      <div className="card">
        <p className="section-label">Danger zone</p>
        <p className="muted">
          Clears every question's mastery level and your mock interview history. This can't be
          undone.
        </p>
        <button
          className="btn btn-secondary"
          style={{ color: "var(--stamp-red)", borderColor: "var(--stamp-red)" }}
          onClick={handleReset}
        >
          <Trash2 size={16} /> {confirmReset ? "Tap again to confirm" : "Reset all progress"}
        </button>
      </div>
    </div>
  );
}
