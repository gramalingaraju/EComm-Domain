import React, { useState, useEffect } from "react";
import { ONBOARDING_ROADMAP } from "../data/onboardingData";
import { CheckCircle2, Circle, Calendar, RotateCcw } from "lucide-react";

export default function OnboardingTracker({ onProgressChange }) {
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem("ecomm_onboarding_completed");
    return saved ? JSON.parse(saved) : [];
  });

  const totalTasks = ONBOARDING_ROADMAP.reduce((acc, week) => acc + week.tasks.length, 0);
  const progressPercent = Math.round((completedTasks.length / totalTasks) * 100);

  useEffect(() => {
    localStorage.setItem("ecomm_onboarding_completed", JSON.stringify(completedTasks));
    if (onProgressChange) onProgressChange(progressPercent);
  }, [completedTasks, progressPercent, onProgressChange]);

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const resetProgress = () => {
    if (window.confirm("Reset onboarding progress?")) {
      setCompletedTasks([]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      {/* Header & Overall Progress Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Calendar size={20} color="var(--emerald-accent)" />
            30-Day eCommerce Joiner Onboarding Checklist
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Track your 4-week onboarding journey from domain basics to local dev setup and first production ticket.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={resetProgress} style={{ fontSize: "0.78rem" }}>
          <RotateCcw size={14} /> Reset Progress
        </button>
      </div>

      {/* Progress Bar Container */}
      <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Overall Onboarding Progress</span>
          <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--emerald-accent)" }}>
            {completedTasks.length} / {totalTasks} Tasks Completed ({progressPercent}%)
          </span>
        </div>

        <div style={{ height: "10px", width: "100%", background: "rgba(0,0,0,0.3)", borderRadius: "9999px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progressPercent}%`,
              background: "linear-gradient(90deg, #6366f1, #10b981)",
              borderRadius: "9999px",
              transition: "width 0.4s ease"
            }}
          />
        </div>
      </div>

      {/* Weeks Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {ONBOARDING_ROADMAP.map((week) => (
          <div key={week.week} style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.35rem" }}>
              <span className="badge badge-emerald">{week.week}</span>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 800 }}>{week.title}</h3>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>{week.description}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {week.tasks.map((task) => {
                const isDone = completedTasks.includes(task.id);
                return (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: isDone ? "rgba(16, 185, 129, 0.08)" : "var(--bg-primary)",
                      border: `1px solid ${isDone ? "var(--emerald-accent)" : "var(--border-color)"}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isDone ? (
                      <CheckCircle2 size={20} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    ) : (
                      <Circle size={20} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    )}

                    <div>
                      <h4 style={{ fontSize: "0.88rem", fontWeight: 700, textDecoration: isDone ? "line-through" : "none", color: isDone ? "var(--text-secondary)" : "var(--text-primary)" }}>
                        {task.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                        {task.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
