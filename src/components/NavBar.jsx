import { Home, Layers, Mic, BookOpen, Settings } from "lucide-react";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "practice", label: "Practice", icon: Layers },
  { id: "interview", label: "Interview", icon: Mic },
  { id: "browse", label: "Browse", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function NavBar({ active, onChange }) {
  return (
    <nav className="tab-bar">
      <div className="tab-bar-inner">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`tab-btn${active === id ? " active" : ""}`}
            onClick={() => onChange(id)}
            aria-current={active === id ? "page" : undefined}
          >
            <Icon size={21} strokeWidth={active === id ? 2.3 : 1.8} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
