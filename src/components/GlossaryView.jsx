import React, { useState } from "react";
import { ECOMM_GLOSSARY } from "../data/glossaryData";
import { BookMarked, Search } from "lucide-react";

export default function GlossaryView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const categories = ["ALL", ...new Set(ECOMM_GLOSSARY.map((g) => g.category))];

  const filtered = ECOMM_GLOSSARY.filter((item) => {
    const matchesCat = selectedCategory === "ALL" || item.category === selectedCategory;
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BookMarked size={20} color="var(--accent-primary)" />
          eCommerce Domain Acronyms & Terminology Dictionary
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
          Instant search and category filtering for standard eCommerce industry terms, acronyms, and technical definitions.
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search terms, SKU, OMS, ATP, PCI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem 0.6rem 2.4rem",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: "0.85rem",
              outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontSize: "0.78rem",
                fontWeight: selectedCategory === cat ? 700 : 500,
                background: selectedCategory === cat ? "var(--accent-primary)" : "var(--bg-secondary)",
                color: selectedCategory === cat ? "white" : "var(--text-secondary)",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
        {filtered.map((item) => (
          <div
            key={item.term}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-color)",
              padding: "1.1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--accent-primary)" }}>{item.term}</h3>
                <span className="badge badge-indigo" style={{ fontSize: "0.62rem" }}>{item.category}</span>
              </div>
              <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                {item.fullName}
              </h4>
              <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {item.definition}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
