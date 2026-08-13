import React from "react";

export default function DomainModule({ module }) {
  if (!module) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: "2rem" }}>
      {/* Module Title Header */}
      <div style={{ marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <span className="badge badge-indigo">{module.category}</span>
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{module.title}</h2>
        <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
          {module.summary}
        </p>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {module.sections.map((sec, idx) => (
          <div key={idx} style={{ background: "var(--bg-secondary)", padding: "1.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--accent-primary)" }}>
              {sec.subtitle}
            </h3>

            {sec.content && (
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                {sec.content}
              </p>
            )}

            {/* Bullets */}
            {sec.bullets && (
              <ul style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.45rem", marginBottom: "1rem" }}>
                {sec.bullets.map((b, i) => {
                  const parts = b.split("**");
                  return (
                    <li key={i} style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                      {parts.length > 1 ? (
                        <>
                          <strong style={{ color: "var(--text-primary)" }}>{parts[1]}</strong>
                          {parts[2]}
                        </>
                      ) : (
                        b
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Table */}
            {sec.table && (
              <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-primary)", borderBottom: "2px solid var(--border-color)" }}>
                      {sec.table.headers.map((h, i) => (
                        <th key={i} style={{ padding: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sec.table.rows.map((r, ri) => (
                      <tr key={ri} style={{ borderBottom: "1px solid var(--border-color)" }}>
                        {r.map((c, ci) => (
                          <td key={ci} style={{ padding: "0.75rem", color: ci === 0 ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: ci === 0 ? 700 : 400 }}>
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Code Block */}
            {sec.codeBlock && (
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginBottom: "0.35rem" }}>
                  {sec.codeBlock.language.toUpperCase()} SCHEMATIC / PAYLOAD SPECIFICATION:
                </div>
                <pre style={{ margin: 0 }}>
                  <code>{sec.codeBlock.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
