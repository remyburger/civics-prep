import { DEFAULT_VARIABLE_ANSWERS } from "../data/defaultAnswers";

const PROGRESS_KEY = "civics-prep-progress";
const SETTINGS_KEY = "civics-prep-settings";
const HISTORY_KEY = "civics-prep-interview-history";

// ---- Progress ----
// Shape: { [questionId]: { seen, correct, incorrect, streak, lastResult, lastSeenAt } }

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore quota errors
  }
}

export function recordAnswer(progress, questionId, wasCorrect) {
  const prev = progress[questionId] || {
    seen: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    lastResult: null,
    lastSeenAt: null,
  };
  const next = {
    seen: prev.seen + 1,
    correct: prev.correct + (wasCorrect ? 1 : 0),
    incorrect: prev.incorrect + (wasCorrect ? 0 : 1),
    streak: wasCorrect ? prev.streak + 1 : 0,
    lastResult: wasCorrect ? "correct" : "incorrect",
    lastSeenAt: Date.now(),
  };
  const updated = { ...progress, [questionId]: next };
  saveProgress(updated);
  return updated;
}

export function resetProgress() {
  saveProgress({});
  localStorage.removeItem(HISTORY_KEY);
}

export function getMasteryLevel(entry) {
  if (!entry || entry.seen === 0) return "new";
  if (entry.lastResult === "incorrect") return "review";
  if (entry.streak >= 3) return "mastered";
  return "learning";
}

// ---- Settings (personalized variable answers) ----

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const stored = raw ? JSON.parse(raw) : {};
    return { ...DEFAULT_VARIABLE_ANSWERS, ...stored };
  } catch {
    return { ...DEFAULT_VARIABLE_ANSWERS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

// ---- Mock interview history ----
// Shape: [{ date, correct, total, passed }]

export function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry) {
  const history = loadHistory();
  const updated = [entry, ...history].slice(0, 25);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}
