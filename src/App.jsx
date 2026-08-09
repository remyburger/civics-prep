import { useState } from "react";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Practice from "./components/Practice";
import Interview from "./components/Interview";
import Browse from "./components/Browse";
import SettingsView from "./components/Settings";
import { loadProgress, loadSettings, loadHistory } from "./utils/storage";

export default function App() {
  const [tab, setTab] = useState("home");
  const [progress, setProgress] = useState(loadProgress);
  const [settings, setSettings] = useState(loadSettings);
  const [history, setHistory] = useState(loadHistory);

  function refreshAfterReset() {
    setProgress({});
    setHistory([]);
  }

  function refreshHistory() {
    setHistory(loadHistory());
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        {tab === "home" && <Home progress={progress} history={history} onNavigate={setTab} />}
        {tab === "practice" && (
          <Practice progress={progress} setProgress={setProgress} settings={settings} />
        )}
        {tab === "interview" && (
          <Interview
            progress={progress}
            setProgress={setProgress}
            settings={settings}
            onFinished={refreshHistory}
          />
        )}
        {tab === "browse" && <Browse progress={progress} settings={settings} />}
        {tab === "settings" && (
          <SettingsView settings={settings} setSettings={setSettings} onReset={refreshAfterReset} />
        )}
      </main>
      <NavBar active={tab} onChange={setTab} />
    </div>
  );
}
