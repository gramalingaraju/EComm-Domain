import React, { useState, useEffect } from "react";
import { QA_TEST_SCENARIOS } from "../data/qaTestData";
import { ShieldCheck, Search, Copy, Check, ChevronDown, ChevronUp, AlertCircle, Download } from "lucide-react";

export default function QATestMatrix() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL"); // ALL | UNTESTED | PASSED | FAILED
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Local storage state for QA test execution tracking
  const [testStatuses, setTestStatuses] = useState(() => {
    const saved = localStorage.getItem("ecomm_qa_test_statuses");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("ecomm_qa_test_statuses", JSON.stringify(testStatuses));
  }, [testStatuses]);

  const categories = ["ALL", ...new Set(QA_TEST_SCENARIOS.map((t) => t.category))];

  const handleStatusChange = (testId, newStatus) => {
    setTestStatuses((prev) => ({
      ...prev,
      [testId]: newStatus
    }));
  };

  const filteredTests = QA_TEST_SCENARIOS.filter((test) => {
    const matchesCategory = selectedCategory === "ALL" || test.category === selectedCategory;
    const testStatus = testStatuses[test.id] || "UNTESTED";
    const matchesStatus = selectedStatus === "ALL" || testStatus === selectedStatus;
    const matchesSearch = 
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.expectedResult.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleCopy = (test) => {
    const textToCopy = `### ${test.id}: ${test.title}
**Category**: ${test.category} | **Severity**: ${test.severity} | **Type**: ${test.type}
**Precondition**: ${test.precondition}
**Steps**:
${test.steps.join("\n")}
**Expected Result**: ${test.expectedResult}
**Edge Case Risk**: ${test.edgeCaseRisk}`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(test.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const exportData = QA_TEST_SCENARIOS.map((tc) => ({
      ...tc,
      executionStatus: testStatuses[tc.id] || "UNTESTED"
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ecomm_qa_test_matrix_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTests = QA_TEST_SCENARIOS.length;
  const passedCount = Object.values(testStatuses).filter((s) => s === "PASSED").length;
  const failedCount = Object.values(testStatuses).filter((s) => s === "FAILED").length;

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      {/* Header & Export Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} color="var(--accent-primary)" />
            eCommerce QA & Testing Mastery Matrix
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Filterable end-to-end functional, boundary, security, and performance test scenarios with live execution tracking.
          </p>
        </div>

        <button className="btn btn-secondary" onClick={handleExportJSON} style={{ fontSize: "0.78rem" }}>
          <Download size={14} /> Export Test Plan (JSON)
        </button>
      </div>

      {/* Execution Metrics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "var(--bg-secondary)", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>TOTAL SCENARIOS</span>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)" }}>{totalTests} Tests</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>PASSED VERIFICATIONS</span>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--emerald-accent)" }}>{passedCount} Passed</p>
        </div>
        <div style={{ background: "var(--bg-secondary)", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: 700 }}>FAILED / OPEN BUGS</span>
          <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--rose-accent)" }}>{failedCount} Failed</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search test scenarios, IDs, expected results..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

        {/* Status Filter Pills */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {["ALL", "UNTESTED", "PASSED", "FAILED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: "0.45rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontSize: "0.75rem",
                fontWeight: selectedStatus === st ? 700 : 500,
                background: selectedStatus === st ? "var(--accent-primary)" : "var(--bg-secondary)",
                color: selectedStatus === st ? "white" : "var(--text-secondary)",
                cursor: "pointer"
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div style={{ display: "flex", gap: "0.35rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.45rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                border: "none",
                fontSize: "0.75rem",
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

      {/* Scenarios List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filteredTests.map((test) => {
          const isExpanded = expandedId === test.id;
          const isCopied = copiedId === test.id;
          const currentStatus = testStatuses[test.id] || "UNTESTED";

          return (
            <div
              key={test.id}
              style={{
                background: "var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${isExpanded ? "var(--accent-primary)" : "var(--border-color)"}`,
                padding: "1rem",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }} onClick={() => setExpandedId(isExpanded ? null : test.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flexWrap: "wrap" }}>
                  <span className="badge badge-indigo" style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}>
                    {test.id}
                  </span>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>{test.title}</h3>
                  <span className={`badge ${test.severity === "Critical" ? "badge-rose" : "badge-amber"}`} style={{ fontSize: "0.65rem" }}>
                    {test.severity}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={(e) => e.stopPropagation()}>
                  {/* Status Toggle Radio Pill */}
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(test.id, e.target.value)}
                    style={{
                      padding: "0.3rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      background: currentStatus === "PASSED" ? "var(--emerald-light)" : currentStatus === "FAILED" ? "var(--rose-light)" : "var(--bg-primary)",
                      color: currentStatus === "PASSED" ? "var(--emerald-accent)" : currentStatus === "FAILED" ? "var(--rose-accent)" : "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      cursor: "pointer"
                    }}
                  >
                    <option value="UNTESTED">Untested</option>
                    <option value="PASSED">Passed ✅</option>
                    <option value="FAILED">Failed ❌</option>
                  </select>

                  <button
                    onClick={() => handleCopy(test)}
                    className="btn btn-secondary"
                    style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem" }}
                    title="Copy Test Markdown"
                  >
                    {isCopied ? <Check size={14} color="var(--emerald-accent)" /> : <Copy size={14} />}
                    {isCopied ? "Copied" : "Copy"}
                  </button>
                  <div onClick={() => setExpandedId(isExpanded ? null : test.id)} style={{ cursor: "pointer", display: "flex" }}>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Detailed View */}
              {isExpanded && (
                <div className="animate-fade-in" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>PRECONDITION:</span>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{test.precondition}</p>
                  </div>

                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)" }}>TEST EXECUTION STEPS:</span>
                    <ul style={{ paddingLeft: "1.2rem", fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                      {test.steps.map((st, i) => (
                        <li key={i}>{st}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ marginBottom: "0.75rem", background: "rgba(16, 185, 129, 0.08)", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--emerald-accent)" }}>EXPECTED RESULT:</span>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginTop: "0.2rem" }}>{test.expectedResult}</p>
                  </div>

                  <div style={{ background: "rgba(244, 63, 94, 0.08)", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--rose-accent)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <AlertCircle size={14} /> EDGE CASE / PRODUCTION PITFALL RISK:
                    </span>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-primary)", marginTop: "0.2rem" }}>{test.edgeCaseRisk}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
