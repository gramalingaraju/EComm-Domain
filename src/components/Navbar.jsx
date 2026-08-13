import React from "react";
import founderAvatar from "../assets/rr_avatar.jpg";
import { 
  BookOpen, 
  Search, 
  Sun, 
  Moon, 
  CheckCircle2, 
  ShieldCheck, 
  Wrench, 
  BookMarked, 
  GraduationCap, 
  Zap 
} from "lucide-react";

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  theme, 
  toggleTheme, 
  openSearch,
  onboardingProgress 
}) {
  const navItems = [
    { id: "modules", label: "Domain Modules", icon: BookOpen },
    { id: "simulators", label: "Interactive Simulators", icon: Zap },
    { id: "qa", label: "QA Test Matrix", icon: ShieldCheck },
    { id: "ops", label: "Ops Playbooks", icon: Wrench },
    { id: "glossary", label: "Glossary", icon: BookMarked },
    { id: "onboarding", label: "Onboarding Tracker", icon: CheckCircle2 },
    { id: "quiz", label: "Readiness Quiz", icon: GraduationCap }
  ];

  return (
    <header className="glass-panel" style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      margin: "0.75rem 1rem",
      padding: "0.75rem 1.25rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
      flexWrap: "wrap"
    }}>
      {/* Brand Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #6366f1, #10b981)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
        }}>
          <Zap size={22} />
        </div>
        <div>
          <h1 style={{ fontSize: "1.15rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            eComm<span style={{ color: "var(--accent-primary)" }}>Hub</span>
          </h1>
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Engineer & QA Onboarding Portal
          </p>
        </div>
      </div>

      {/* Main Navigation Pills */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        background: "rgba(0, 0, 0, 0.2)",
        padding: "0.3rem",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border-color)",
        overflowX: "auto"
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "white" : "var(--text-secondary)",
                background: isActive ? "var(--accent-primary)" : "transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              }}
            >
              <Icon size={16} />
              {item.label}
              {item.id === "onboarding" && onboardingProgress > 0 && (
                <span className="badge badge-emerald" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>
                  {onboardingProgress}%
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Action Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
        {/* Founder Badge Chip */}
        <div
          onClick={() => setActiveTab("modules")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.45rem",
            padding: "0.25rem 0.65rem 0.25rem 0.25rem",
            background: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            borderRadius: "9999px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          className="btn-secondary"
          title="Founder & Lead Architect: R. Raju"
        >
          <div style={{ position: "relative", width: "28px", height: "28px" }}>
            <img
              src={founderAvatar}
              alt="Founder"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1.5px solid var(--accent-primary)",
                display: "block"
              }}
            />
          </div>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-primary)" }}>
            R. Raju <span style={{ color: "var(--accent-primary)", fontSize: "0.68rem", fontWeight: 600 }}>(Founder)</span>
          </span>
        </div>

        {/* Global Search Trigger */}
        <button
          onClick={openSearch}
          className="btn btn-secondary"
          style={{
            padding: "0.45rem 0.85rem",
            fontSize: "0.8rem",
            gap: "0.5rem"
          }}
          title="Search Knowledge Base (Press /)"
        >
          <Search size={15} />
          <span style={{ display: "inline-block" }}>Search</span>
          <kbd style={{
            background: "rgba(255, 255, 255, 0.15)",
            padding: "0.15rem 0.35rem",
            borderRadius: "4px",
            fontSize: "0.7rem",
            fontFamily: "var(--font-mono)"
          }}>
            /
          </kbd>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary"
          style={{ padding: "0.5rem", borderRadius: "50%" }}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
        </button>
      </div>
    </header>
  );
}
