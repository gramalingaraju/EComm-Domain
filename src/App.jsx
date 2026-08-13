import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DomainModule from "./components/DomainModule";
import FounderSpotlight from "./components/FounderSpotlight";
import OrderSimulator from "./components/OrderSimulator";
import PaymentVisualizer from "./components/PaymentVisualizer";
import ConcurrencySim from "./components/ConcurrencySim";
import QATestMatrix from "./components/QATestMatrix";
import OperationsGuide from "./components/OperationsGuide";
import GlossaryView from "./components/GlossaryView";
import OnboardingTracker from "./components/OnboardingTracker";
import KnowledgeQuiz from "./components/KnowledgeQuiz";
import SearchModal from "./components/SearchModal";
import { DOMAIN_MODULES } from "./data/domainData";
import { Play, CreditCard, Zap } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("modules");
  const [activeModuleId, setActiveModuleId] = useState("overview");
  const [activeSimulator, setActiveSimulator] = useState("order");
  const [theme, setTheme] = useState(() => localStorage.getItem("ecomm_theme") || "dark");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ecomm_theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && !isSearchOpen) {
        const activeEl = document.activeElement;
        const isInput = activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable);
        if (!isInput) {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleSelectSearchResult = (result) => {
    setActiveTab(result.targetTab);
    if (result.type === "module") {
      setActiveModuleId(result.item.id);
    }
  };

  const currentModule = DOMAIN_MODULES.find((m) => m.id === activeModuleId) || DOMAIN_MODULES[0];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        openSearch={() => setIsSearchOpen(true)}
        onboardingProgress={onboardingProgress}
      />

      {/* Main Content Layout */}
      <main style={{ flex: 1, padding: "0 1rem 2rem 1rem", maxWidth: "1600px", margin: "0 auto", width: "100%" }}>
        {activeTab === "modules" && (
          <div>
            {activeModuleId === "overview" && <FounderSpotlight />}
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", alignItems: "flex-start" }}>
              <Sidebar activeModuleId={activeModuleId} onSelectModule={setActiveModuleId} />
              <div style={{ flex: 1, minWidth: "320px" }}>
                <DomainModule module={currentModule} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "simulators" && (
          <div>
            {/* Simulator Switcher Pills */}
            <div className="glass-panel" style={{ padding: "0.75rem", marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                className={`btn ${activeSimulator === "order" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveSimulator("order")}
                style={{ fontSize: "0.85rem" }}
              >
                <Play size={16} /> Order Lifecycle Simulator
              </button>
              <button
                className={`btn ${activeSimulator === "payment" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveSimulator("payment")}
                style={{ fontSize: "0.85rem" }}
              >
                <CreditCard size={16} /> Payment Auth & 3DS Flow
              </button>
              <button
                className={`btn ${activeSimulator === "concurrency" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setActiveSimulator("concurrency")}
                style={{ fontSize: "0.85rem" }}
              >
                <Zap size={16} /> Flash Sale Concurrency Simulator
              </button>
            </div>

            {activeSimulator === "order" && <OrderSimulator />}
            {activeSimulator === "payment" && <PaymentVisualizer />}
            {activeSimulator === "concurrency" && <ConcurrencySim />}
          </div>
        )}

        {activeTab === "qa" && <QATestMatrix />}
        {activeTab === "ops" && <OperationsGuide />}
        {activeTab === "glossary" && <GlossaryView />}
        {activeTab === "onboarding" && <OnboardingTracker onProgressChange={setOnboardingProgress} />}
        {activeTab === "quiz" && <KnowledgeQuiz />}
      </main>

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
