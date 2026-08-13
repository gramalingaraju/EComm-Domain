import React, { useState } from "react";
import { OPERATIONAL_PLAYBOOKS } from "../data/playbookData";
import { Wrench, AlertTriangle, Terminal, Copy, Check, Play } from "lucide-react";

export default function OperationsGuide() {
  const [selectedPlaybook, setSelectedPlaybook] = useState(OPERATIONAL_PLAYBOOKS[0]);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [cliOutput, setCliOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");

  const filteredPlaybooks = OPERATIONAL_PLAYBOOKS.filter((pb) => {
    return selectedSeverity === "ALL" || pb.severity.toUpperCase() === selectedSeverity.toUpperCase();
  });

  const handleCopyCmd = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleExecuteCmd = (cmd) => {
    setIsExecuting(true);
    setCliOutput(null);
    setTimeout(() => {
      setCliOutput(`$ ${cmd}\n[INFO] Connecting to Production Cluster (k8s-pod-oms-prod-882)...
[EXECUTE] Resolving incident locks...
[SUCCESS] Command completed successfully in 842ms. 14 items resynced.`);
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Wrench size={20} color="var(--rose-accent)" />
            L2 / L3 Operational Troubleshooting & Incident Playbooks
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Essential playbooks for application maintenance engineers to diagnose and resolve production incidents, stuck orders, and sync drops.
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["ALL", "CRITICAL", "HIGH"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              style={{
                padding: "0.4rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: selectedSeverity === sev ? 700 : 500,
                background: selectedSeverity === sev ? "var(--rose-accent)" : "var(--bg-secondary)",
                color: selectedSeverity === sev ? "white" : "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.25rem" }}>
        {/* Playbook List Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filteredPlaybooks.map((pb) => {
            const isSelected = selectedPlaybook.id === pb.id;
            return (
              <div
                key={pb.id}
                onClick={() => {
                  setSelectedPlaybook(pb);
                  setCliOutput(null);
                }}
                style={{
                  background: isSelected ? "var(--accent-light)" : "var(--bg-secondary)",
                  border: `1px solid ${isSelected ? "var(--accent-primary)" : "var(--border-color)"}`,
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <span className="badge badge-rose" style={{ fontSize: "0.65rem", marginBottom: "0.35rem" }}>
                  {pb.severity}
                </span>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.3 }}>{pb.title}</h4>
              </div>
            );
          })}
        </div>

        {/* Playbook Detail Content */}
        {selectedPlaybook && (
          <div className="animate-fade-in" style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span className="badge badge-rose">{selectedPlaybook.severity}</span>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{selectedPlaybook.title}</h3>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <AlertTriangle size={14} color="var(--amber-accent)" /> PRODUCTION SYMPTOM REPORTED:
              </span>
              <p style={{ fontSize: "0.88rem", color: "var(--amber-accent)", background: "var(--amber-light)", padding: "0.65rem 0.85rem", borderRadius: "var(--radius-sm)", marginTop: "0.35rem" }}>
                {selectedPlaybook.symptom}
              </p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>LIKELY ROOT CAUSES:</span>
              <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                {selectedPlaybook.rootCauses.map((rc, i) => (
                  <li key={i}>{rc}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>STEP-BY-STEP RESOLUTION PROCEDURE:</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", marginTop: "0.35rem" }}>
                {selectedPlaybook.resolutionSteps.map((st, i) => (
                  <div key={i} style={{ background: "var(--bg-primary)", padding: "0.6rem 0.85rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                    {st}
                  </div>
                ))}
              </div>
            </div>

            {selectedPlaybook.commandSnippet && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <Terminal size={14} /> CLI RECOVERY COMMAND SNIPPET:
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      onClick={() => handleCopyCmd(selectedPlaybook.commandSnippet)}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
                    >
                      {copiedCmd ? <Check size={12} color="var(--emerald-accent)" /> : <Copy size={12} />}
                      {copiedCmd ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleExecuteCmd(selectedPlaybook.commandSnippet)}
                      className="btn btn-primary"
                      style={{ padding: "0.25rem 0.65rem", fontSize: "0.7rem" }}
                      disabled={isExecuting}
                    >
                      <Play size={12} /> {isExecuting ? "Executing..." : "Simulate CLI Execution"}
                    </button>
                  </div>
                </div>

                <pre style={{ margin: 0, fontSize: "0.82rem" }}>
                  {selectedPlaybook.commandSnippet}
                </pre>

                {/* Simulated CLI Execution Terminal Output */}
                {cliOutput && (
                  <div className="animate-fade-in" style={{ marginTop: "0.75rem", background: "#04070d", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--emerald-accent)" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--emerald-accent)", fontFamily: "var(--font-mono)" }}>
                      TERMINAL OUTPUT LOG STREAM:
                    </span>
                    <pre style={{ margin: "0.35rem 0 0 0", background: "transparent !important", border: "none", color: "var(--emerald-accent)", fontSize: "0.78rem" }}>
                      {cliOutput}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
