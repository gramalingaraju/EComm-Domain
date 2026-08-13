import React from "react";
import { DOMAIN_MODULES } from "../data/domainData";
import { Store, Network, Package, ShoppingCart, CreditCard, Truck, Code, ChevronRight } from "lucide-react";

export default function Sidebar({ activeModuleId, onSelectModule }) {
  const iconMap = {
    Store,
    Network,
    Package,
    ShoppingCart,
    CreditCard,
    Truck,
    Code
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: "280px",
        flexShrink: 0,
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem"
      }}
    >
      <div style={{ padding: "0.5rem 0.5rem 0.75rem 0.5rem", borderBottom: "1px solid var(--border-color)" }}>
        <h3 style={{ fontSize: "0.8rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          eCommerce Knowledge Curriculum
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", overflowY: "auto" }}>
        {DOMAIN_MODULES.map((mod) => {
          const isActive = activeModuleId === mod.id;
          const IconComponent = iconMap[mod.icon] || Package;

          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              style={{
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${isActive ? "var(--accent-primary)" : "transparent"}`,
                background: isActive ? "var(--accent-light)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "var(--radius-sm)",
                  background: isActive ? "var(--accent-primary)" : "var(--bg-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "white" : "var(--text-muted)"
                }}
              >
                <IconComponent size={16} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="badge badge-indigo" style={{ fontSize: "0.58rem", padding: "0.1rem 0.35rem" }}>
                  {mod.category}
                </span>
                <p style={{ fontSize: "0.82rem", fontWeight: isActive ? 700 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {mod.title}
                </p>
              </div>

              <ChevronRight size={14} color={isActive ? "var(--accent-primary)" : "var(--text-muted)"} />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
