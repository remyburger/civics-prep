import { QUESTIONS } from "../data/questions";
import { getMasteryLevel } from "./storage";

// Returns the list of accepted answers for a question, substituting the
// user's personalized answer for variable (time-sensitive / state-specific) questions.
export function resolveAnswers(question, settings) {
  if (!question.variable) return question.answers;
  const personalized = settings?.[question.variableKey];
  if (personalized && personalized.trim()) return [personalized.trim()];
  return ["(Set your personalized answer in Settings)"];
}

const WEIGHTS = {
  new: 5,
  review: 4,
  learning: 2,
  mastered: 1,
};

// Weighted-random pick of a single question, favoring unseen / struggling ones.
export function pickWeighted(progress, excludeId = null) {
  const pool = excludeId ? QUESTIONS.filter((q) => q.id !== excludeId) : QUESTIONS;
  const weighted = pool.map((q) => ({
    q,
    weight: WEIGHTS[getMasteryLevel(progress[q.id])],
  }));
  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.q;
  }
  return weighted[weighted.length - 1].q;
}

// Only questions that are not yet mastered (for a focused "weak questions" mode).
export function pickWeightedFromWeak(progress, excludeId = null) {
  const weak = QUESTIONS.filter((q) => getMasteryLevel(progress[q.id]) !== "mastered");
  if (weak.length === 0) return pickWeighted(progress, excludeId);
  const pool = excludeId ? weak.filter((q) => q.id !== excludeId) : weak;
  if (pool.length === 0) return weak[0];
  const weighted = pool.map((q) => ({ q, weight: WEIGHTS[getMasteryLevel(progress[q.id])] }));
  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  let r = Math.random() * total;
  for (const w of weighted) {
    r -= w.weight;
    if (r <= 0) return w.q;
  }
  return weighted[weighted.length - 1].q;
}

// Draws 20 unique random questions for a mock interview, in true random order
// (unweighted, like the real test draws from the full 128-question bank).
export function drawInterviewSet(size = 20) {
  const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, size);
}

export function computeStats(progress) {
  let mastered = 0,
    learning = 0,
    review = 0,
    fresh = 0;
  QUESTIONS.forEach((q) => {
    const level = getMasteryLevel(progress[q.id]);
    if (level === "mastered") mastered++;
    else if (level === "learning") learning++;
    else if (level === "review") review++;
    else fresh++;
  });
  const attempted = QUESTIONS.length - fresh;
  return { mastered, learning, review, fresh, total: QUESTIONS.length, attempted };
}
