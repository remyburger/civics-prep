import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import { QUESTIONS } from "../data/questions";
import { resolveAnswers } from "../utils/quizEngine";
import { getMasteryLevel } from "../utils/storage";

export default function Browse({ progress, settings }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? QUESTIONS.filter((item) => item.question.toLowerCase().includes(q)) : QUESTIONS;
    const map = new Map();
    filtered.forEach((item) => {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section).push(item);
    });
    return Array.from(map.entries());
  }, [query]);

  return (
    <div>
      <p className="app-eyebrow">Reference</p>
      <h1 className="h1">All 128 Questions</h1>

      <div className="field" style={{ position: "relative", marginBottom: 18 }}>
        <Search
          size={17}
          style={{ position: "absolute", left: 12, top: 12, color: "var(--ink-faint)" }}
        />
        <input
          style={{ paddingLeft: 36 }}
          placeholder="Search questions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {grouped.length === 0 && (
        <div className="empty-state">No questions match "{query}".</div>
      )}

      {grouped.map(([section, items]) => (
        <div key={section} style={{ marginBottom: 18 }}>
          <p className="section-label">{section}</p>
          {items.map((item) => {
            const level = getMasteryLevel(progress[item.id]);
            const open = openId === item.id;
            return (
              <div key={item.id} className="card" style={{ padding: "14px 16px", marginBottom: 8 }}>
                <button
                  onClick={() => setOpenId(open ? null : item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    width: "100%",
                    padding: 0,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span className={`mastery-dot mastery-${level}`} style={{ marginTop: 6 }}></span>
                  <span style={{ flex: 1, fontSize: 15, color: "var(--ink)", lineHeight: 1.4 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-faint)" }}>
                      {item.id}.{" "}
                    </span>
                    {item.question}
                  </span>
                  <ChevronDown
                    size={17}
                    style={{
                      color: "var(--ink-faint)",
                      transform: open ? "rotate(180deg)" : "none",
                      transition: "transform 150ms",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  />
                </button>
                {open && (
                  <ul className="answer-list">
                    {resolveAnswers(item, settings).map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
