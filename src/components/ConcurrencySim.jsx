import React, { useState } from "react";
import { Zap, CheckCircle2, ShieldAlert, RefreshCw } from "lucide-react";

export default function ConcurrencySim() {
  const [strategy, setStrategy] = useState("RAW_SQL"); // RAW_SQL | OCC | REDIS_MUTEX
  const [initialStock, setInitialStock] = useState(5);
  const [buyersCount, setBuyersCount] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState(null);

  const runSimulation = () => {
    setIsRunning(true);
    setSimulationResults(null);

    setTimeout(() => {
      let successfulOrders = 0;
      let rejectedOrders = 0;
      let finalStock = initialStock;
      let isOversold = false;
      let logs = [];
      let threadStatuses = [];

      if (strategy === "RAW_SQL") {
        // Naive SQL lost updates race condition
        // e.g., out of 25 threads, 18 complete concurrently with stale stock = 5 read
        successfulOrders = Math.min(buyersCount, initialStock + 13);
        finalStock = initialStock - successfulOrders; // negative inventory!
        rejectedOrders = buyersCount - successfulOrders;
        isOversold = true;

        threadStatuses = Array.from({ length: buyersCount }, (_, i) => ({
          id: i + 1,
          status: i < successfulOrders ? "SUCCESS_RACE" : "REJECTED",
          message: i < successfulOrders ? "HTTP 200 OK (Stale Stock Read = 5)" : "HTTP 500 Connection Timeout"
        }));

        logs = [
          `[CRITICAL RACE CONDITION] ${buyersCount} concurrent threads executed 'UPDATE stock SET qty = qty - 1' simultaneously.`,
          `[LOST UPDATE DETECTED] Read-Modify-Write cycle read stock=${initialStock} for ${successfulOrders} concurrent transactions.`,
          `[OVERSOLD ALERT] ${successfulOrders} buyers charged for only ${initialStock} physical items! Final DB stock balance = ${finalStock}.`
        ];
      } else if (strategy === "OCC") {
        // Optimistic Concurrency Control (Version Check)
        // Only 1 thread gets version = 1, subsequent threads fail version check unless retried
        successfulOrders = initialStock;
        finalStock = 0;
        rejectedOrders = buyersCount - initialStock;
        isOversold = false;

        threadStatuses = Array.from({ length: buyersCount }, (_, i) => ({
          id: i + 1,
          status: i < initialStock ? "SUCCESS_OCC" : "OCC_CONFLICT",
          message: i < initialStock ? "HTTP 200 OK (Version Matched)" : "HTTP 409 Conflict (Stale Version Exceeded)"
        }));

        logs = [
          `[OCC VERSION CHECK] Executed 'UPDATE stock SET qty=qty-1, version=version+1 WHERE version=v'.`,
          `[VERSION MATCHED] ${initialStock} transactions matched version tag and updated inventory cleanly.`,
          `[OCC REJECTION] ${rejectedOrders} parallel threads aborted with HTTP 409 Conflict due to modified version.`
        ];
      } else {
        // Redis Atomic Mutex / DECRBY
        successfulOrders = initialStock;
        finalStock = 0;
        rejectedOrders = buyersCount - initialStock;
        isOversold = false;

        threadStatuses = Array.from({ length: buyersCount }, (_, i) => ({
          id: i + 1,
          status: i < initialStock ? "SUCCESS_REDIS" : "REDIS_OUT_OF_STOCK",
          message: i < initialStock ? `HTTP 200 OK (Atomic DECR -> ${initialStock - i - 1})` : "HTTP 409 Conflict (Redis Stock <= 0)"
        }));

        logs = [
          `[REDIS MUTEX LOCK] Atomic DECRBY executed in single-threaded Redis event loop.`,
          `[LIMIT ENFORCED] First ${initialStock} buyers decremented stock cleanly (${initialStock} -> 0).`,
          `[OUT OF STOCK] Remaining ${rejectedOrders} buyers immediately received 'HTTP 409 Conflict - Out of Stock'. Zero overselling!`
        ];
      }

      setSimulationResults({
        successfulOrders,
        rejectedOrders,
        finalStock,
        isOversold,
        logs,
        threadStatuses
      });
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Zap size={20} color="var(--amber-accent)" />
          Flash Sale Concurrency & Race Condition Simulator
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
          Simulate parallel buyer HTTP threads attempting to purchase limited inventory items under different locking algorithms.
        </p>
      </div>

      {/* Strategy Selector & Controls */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setStrategy("RAW_SQL")}
            style={{
              padding: "0.55rem 0.85rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${strategy === "RAW_SQL" ? "var(--rose-accent)" : "var(--border-color)"}`,
              background: strategy === "RAW_SQL" ? "var(--rose-light)" : "var(--bg-secondary)",
              color: strategy === "RAW_SQL" ? "var(--rose-accent)" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            ❌ Naive SQL (Lost Updates)
          </button>

          <button
            onClick={() => setStrategy("OCC")}
            style={{
              padding: "0.55rem 0.85rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${strategy === "OCC" ? "var(--cyan-accent)" : "var(--border-color)"}`,
              background: strategy === "OCC" ? "var(--cyan-light)" : "var(--bg-secondary)",
              color: strategy === "OCC" ? "var(--cyan-accent)" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            🔄 Optimistic Control (OCC)
          </button>

          <button
            onClick={() => setStrategy("REDIS_MUTEX")}
            style={{
              padding: "0.55rem 0.85rem",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${strategy === "REDIS_MUTEX" ? "var(--emerald-accent)" : "var(--border-color)"}`,
              background: strategy === "REDIS_MUTEX" ? "var(--emerald-light)" : "var(--bg-secondary)",
              color: strategy === "REDIS_MUTEX" ? "var(--emerald-accent)" : "var(--text-secondary)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer"
            }}
          >
            ⚡ Redis Atomic Mutex
          </button>
        </div>

        <button
          className="btn btn-primary"
          onClick={runSimulation}
          disabled={isRunning}
          style={{ padding: "0.55rem 1.25rem", whiteSpace: "nowrap" }}
        >
          {isRunning ? (
            <>
              <RefreshCw size={16} className="glow-effect" /> Simulating {buyersCount} Threads...
            </>
          ) : (
            `🚀 Launch ${buyersCount} Concurrent Requests`
          )}
        </button>
      </div>

      {/* Interactive Parameter Sliders */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ background: "var(--bg-secondary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>INITIAL INVENTORY UNITS</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--accent-primary)" }}>{initialStock} Units</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={initialStock}
            onChange={(e) => setInitialStock(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-primary)" }}
          />
        </div>

        <div style={{ background: "var(--bg-secondary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)" }}>CONCURRENT BUYER THREADS</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--amber-accent)" }}>{buyersCount} Threads</span>
          </div>
          <input
            type="range"
            min="10"
            max="50"
            step="5"
            value={buyersCount}
            onChange={(e) => setBuyersCount(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: "var(--amber-accent)" }}
          />
        </div>
      </div>

      {/* Results View */}
      {simulationResults && (
        <div className="animate-fade-in" style={{ background: simulationResults.isOversold ? "rgba(244, 63, 94, 0.08)" : "rgba(16, 185, 129, 0.08)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: `1px solid ${simulationResults.isOversold ? "var(--rose-accent)" : "var(--emerald-accent)"}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            {simulationResults.isOversold ? (
              <ShieldAlert size={22} color="var(--rose-accent)" />
            ) : (
              <CheckCircle2 size={22} color="var(--emerald-accent)" />
            )}
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: simulationResults.isOversold ? "var(--rose-accent)" : "var(--emerald-accent)" }}>
              {simulationResults.isOversold ? "CRITICAL SYSTEM FAILURE: OVERSOLD!" : "CONCURRENCY TEST PASSED PERFECTLY!"}
            </h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Orders Created:</span>
              <p style={{ fontSize: "1.2rem", fontWeight: 800 }}>{simulationResults.successfulOrders}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Requests Rejected:</span>
              <p style={{ fontSize: "1.2rem", fontWeight: 800 }}>{simulationResults.rejectedOrders}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Final Stock Balance:</span>
              <p style={{ fontSize: "1.2rem", fontWeight: 800, color: simulationResults.finalStock < 0 ? "var(--rose-accent)" : "var(--emerald-accent)" }}>
                {simulationResults.finalStock}
              </p>
            </div>
          </div>

          {/* Concurrent Threads Visualizer Grid */}
          <div style={{ marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.35rem" }}>
              CONCURRENT WORKER THREAD RESPONSES ({buyersCount} PARALLEL REQUESTS):
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "0.4rem", maxHeight: "150px", overflowY: "auto" }}>
              {simulationResults.threadStatuses.map((t) => {
                const isOk = t.status.startsWith("SUCCESS");
                return (
                  <div
                    key={t.id}
                    style={{
                      padding: "0.35rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      background: isOk ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                      border: `1px solid ${isOk ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)"}`,
                      fontSize: "0.68rem",
                      fontFamily: "var(--font-mono)"
                    }}
                  >
                    <span style={{ fontWeight: 700, color: isOk ? "var(--emerald-accent)" : "var(--rose-accent)" }}>
                      Thread #{t.id}
                    </span>
                    <div style={{ color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: "#090d16", padding: "0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, marginBottom: "0.25rem" }}>
              TECHNICAL AUDIT LOG:
            </p>
            {simulationResults.logs.map((l, i) => (
              <div key={i} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: simulationResults.isOversold ? "var(--rose-accent)" : "var(--emerald-accent)", marginBottom: "0.2rem" }}>
                {l}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
