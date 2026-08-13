import React, { useState, useEffect } from "react";
import { Search, X, ArrowRight } from "lucide-react";
import { DOMAIN_MODULES } from "../data/domainData";
import { QA_TEST_SCENARIOS } from "../data/qaTestData";
import { ECOMM_GLOSSARY } from "../data/glossaryData";
import { OPERATIONAL_PLAYBOOKS } from "../data/playbookData";

export default function SearchModal({ isOpen, onClose, onSelectResult }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) && !isOpen) {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search indexing
  let results = [];
  if (query.trim().length > 1) {
    const q = query.toLowerCase();

    // 1. Modules
    DOMAIN_MODULES.forEach((mod) => {
      if (mod.title.toLowerCase().includes(q) || mod.summary.toLowerCase().includes(q)) {
        results.push({ type: "module", title: mod.title, detail: mod.summary, item: mod, targetTab: "modules" });
      }
    });

    // 2. QA Scenarios
    QA_TEST_SCENARIOS.forEach((tc) => {
      if (tc.id.toLowerCase().includes(q) || tc.title.toLowerCase().includes(q) || tc.expectedResult.toLowerCase().includes(q)) {
        results.push({ type: "qa", title: `${tc.id}: ${tc.title}`, detail: tc.expectedResult, item: tc, targetTab: "qa" });
      }
    });

    // 3. Glossary
    ECOMM_GLOSSARY.forEach((gl) => {
      if (gl.term.toLowerCase().includes(q) || gl.fullName.toLowerCase().includes(q) || gl.definition.toLowerCase().includes(q)) {
        results.push({ type: "glossary", title: `${gl.term} - ${gl.fullName}`, detail: gl.definition, item: gl, targetTab: "glossary" });
      }
    });

    // 4. Ops Playbooks
    OPERATIONAL_PLAYBOOKS.forEach((pb) => {
      if (pb.title.toLowerCase().includes(q) || pb.symptom.toLowerCase().includes(q)) {
        results.push({ type: "ops", title: pb.title, detail: pb.symptom, item: pb, targetTab: "ops" });
      }
    });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "5rem"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-in glass-panel"
        style={{
          width: "100%",
          maxWidth: "650px",
          overflow: "hidden",
          border: "1px solid var(--border-glow)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6)"
        }}
      >
        {/* Search Input Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)" }}>
          <Search size={20} color="var(--accent-primary)" />
          <input
            autoFocus
            type="text"
            placeholder="Instant search across modules, QA test cases, glossary, playbooks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text-primary)",
              fontSize: "1rem",
              fontFamily: "var(--font-sans)"
            }}
          />
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
            <X size={20} />
          </button>
        </div>

        {/* Results Stream */}
        <div style={{ maxHeight: "400px", overflowY: "auto", padding: "0.75rem" }}>
          {query.trim().length <= 1 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Type at least 2 characters to search across the eCommerce domain knowledge base...
            </div>
          ) : results.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No matching domain topics found for "{query}".
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {results.map((res, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelectResult(res);
                    onClose();
                  }}
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                      <span className="badge badge-indigo" style={{ fontSize: "0.6rem" }}>{res.type.toUpperCase()}</span>
                      <h4 style={{ fontSize: "0.88rem", fontWeight: 700 }}>{res.title}</h4>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "480px" }}>
                      {res.detail}
                    </p>
                  </div>
                  <ArrowRight size={16} color="var(--accent-primary)" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
