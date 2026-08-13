import React, { useState } from "react";
import founderAvatar from "../assets/rr_avatar.jpg";
import { Award, Sparkles, CheckCircle2, ChevronRight, UserCheck } from "lucide-react";

export default function FounderSpotlight() {
  const [showBio, setShowBio] = useState(false);

  return (
    <div className="glass-panel animate-fade-in" style={{
      marginBottom: "1.5rem",
      padding: "1.5rem 1.75rem",
      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(16, 185, 129, 0.05) 50%, rgba(15, 23, 42, 0.65) 100%)",
      border: "1px solid rgba(99, 102, 241, 0.25)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Subtle Accent Glow */}
      <div style={{
        position: "absolute",
        top: "-40px",
        right: "-40px",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(0, 0, 0, 0) 70%)",
        pointerEvents: "none"
      }} />

      <div style={{ display: "flex", alignItems: "center", gap: "1.75rem", flexWrap: "wrap" }}>
        
        {/* Professional Circular Avatar Container */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          {/* Outer Animated Gradient Border Ring */}
          <div style={{
            padding: "4px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #10b981, #f59e0b)",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
            display: "inline-block"
          }}>
            <img
              src={founderAvatar}
              alt="Founder R. Raju"
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                objectFit: "cover",
                display: "block",
                border: "3px solid var(--bg-secondary)",
                transition: "transform 0.3s ease"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>

          {/* Verified Founder Badge Dot */}
          <div style={{
            position: "absolute",
            bottom: "4px",
            right: "4px",
            background: "#10b981",
            color: "white",
            borderRadius: "50%",
            padding: "3px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--bg-secondary)",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.5)"
          }} title="Verified Founder">
            <CheckCircle2 size={14} />
          </div>
        </div>

        {/* Founder Information & Description */}
        <div style={{ flex: 1, minWidth: "280px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
            <span className="badge badge-indigo" style={{ gap: "0.3rem" }}>
              <Award size={13} /> Platform Founder
            </span>
            <span className="badge badge-emerald" style={{ gap: "0.3rem" }}>
              <UserCheck size={13} /> Chief Architect
            </span>
            <span className="badge badge-amber" style={{ gap: "0.3rem" }}>
              <Sparkles size={13} /> eCommerce Specialist
            </span>
          </div>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            RR
          </h2>
          <p style={{ fontSize: "0.88rem", color: "var(--accent-primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
            Founder & Lead Platform Architect
          </p>

          <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, maxWidth: "780px" }}>
            Conceptualized and architected the <strong>eCommHub Platform</strong> to empower software engineers and QA teams with real-world enterprise domain knowledge, interactive system simulators, and end-to-end operational playbooks.
          </p>

          {/* Quick Expertise Tags */}
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
            <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.06)", padding: "0.2rem 0.6rem", borderRadius: "6px", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              High-Concurrency Architecture
            </span>
            <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.06)", padding: "0.2rem 0.6rem", borderRadius: "6px", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              Order & Inventory Management
            </span>
            <span style={{ fontSize: "0.75rem", background: "rgba(255,255,255,0.06)", padding: "0.2rem 0.6rem", borderRadius: "6px", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }}>
              3DS Payment Security
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexShrink: 0 }}>
          <button
            className="btn btn-secondary"
            onClick={() => setShowBio(!showBio)}
            style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem", gap: "0.4rem" }}
          >
            {showBio ? "Hide Founder Note" : "Founder's Vision"}
            <ChevronRight size={14} style={{ transform: showBio ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>

      </div>

      {/* Expandable Founder's Vision Statement */}
      {showBio && (
        <div style={{
          marginTop: "1.25rem",
          paddingTop: "1rem",
          borderTop: "1px dashed var(--border-color)",
          animation: "fadeIn 0.3s ease"
        }}>
          <blockquote style={{
            fontSize: "0.86rem",
            fontStyle: "italic",
            color: "var(--text-primary)",
            background: "rgba(0, 0, 0, 0.2)",
            padding: "0.85rem 1.15rem",
            borderRadius: "var(--radius-md)",
            borderLeft: "3px solid var(--accent-primary)",
            lineHeight: 1.6
          }}>
            "Building scalable eCommerce platforms is not just about writing code—it's about understanding complex business domain logic, handling race conditions during flash sales, ensuring PCI-DSS payment compliance, and creating seamless buyer experiences."
          </blockquote>
        </div>
      )}
    </div>
  );
}
