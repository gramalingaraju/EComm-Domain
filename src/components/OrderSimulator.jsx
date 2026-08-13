import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause,
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Database, 
  Send, 
  ShieldCheck, 
  Package, 
  Truck,
  Copy,
  Check,
  SlidersHorizontal,
  Server
} from "lucide-react";

export default function OrderSimulator() {
  const [orderId, setOrderId] = useState("ORD-2026-9901");
  const [customerId, setCustomerId] = useState("CUST-48821");
  const [sku, setSku] = useState("NIK-AM90-BLK-09");
  const [totalAmount, setTotalAmount] = useState(149.99);

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const STATES = [
    {
      id: "CREATED",
      name: "1. Order Created",
      badge: "badge-indigo",
      icon: Package,
      serviceNode: "Storefront / Checkout API",
      description: "Customer submits cart at checkout. Draft order record created in PostgreSQL in PENDING_PAYMENT state.",
      dbTable: `orders (status: PENDING_PAYMENT, total: $${totalAmount})`,
      kafkaTopic: "ecomm.orders.created",
      payload: {
        order_id: orderId,
        customer_id: customerId,
        status: "CREATED",
        items: [{ sku: sku, qty: 1, unit_price: parseFloat(totalAmount) }],
        total_amount: parseFloat(totalAmount)
      }
    },
    {
      id: "PAYMENT_AUTHORIZED",
      name: "2. Payment Authorized",
      badge: "badge-emerald",
      icon: ShieldCheck,
      serviceNode: "Payment Service (Stripe / Adyen)",
      description: "Payment gateway processes 3DS authentication and places temporary authorization hold on funds.",
      dbTable: "payments (status: AUTHORIZED, psp_ref: ch_3N8912A)",
      kafkaTopic: "ecomm.payments.authorized",
      payload: {
        order_id: orderId,
        status: "PAYMENT_AUTHORIZED",
        payment_reference: "tok_3N8912A_stripe",
        auth_code: "AUTH_88201"
      }
    },
    {
      id: "ALLOCATED",
      name: "3. Inventory Allocated",
      badge: "badge-cyan",
      icon: Database,
      serviceNode: "Order Management System (OMS)",
      description: "OMS reserves inventory from Warehouse East. Available-to-Promise (ATP) decremented in Redis.",
      dbTable: "inventory_allocations (wh_id: WH-EAST, reserved_qty: 1)",
      kafkaTopic: "ecomm.inventory.allocated",
      payload: {
        order_id: orderId,
        status: "ALLOCATED",
        warehouse_assigned: "WH-EAST-NJ",
        picking_bin: "BIN-A-44"
      }
    },
    {
      id: "FULFILLING",
      name: "4. Warehouse Picking & Packing",
      badge: "badge-amber",
      icon: Package,
      serviceNode: "Warehouse Management (WMS)",
      description: "WMS pick list dispatched. Staff picks item from bin, packs box, and scans barcode.",
      dbTable: "wms_picking_tasks (status: COMPLETED, packer_id: OP-901)",
      kafkaTopic: "ecomm.wms.packed",
      payload: {
        order_id: orderId,
        status: "FULFILLING",
        package_weight_kg: 0.95,
        box_type: "BOX-MEDIUM-02"
      }
    },
    {
      id: "SHIPPED",
      name: "5. Carrier Label & Dispatched",
      badge: "badge-indigo",
      icon: Truck,
      serviceNode: "Logistics & Carrier Gateway",
      description: "Shipping label printed, payment capture confirmed, FedEx pickup scanned.",
      dbTable: "shipments (carrier: FedEx, tracking_no: 788290192801)",
      kafkaTopic: "ecomm.shipments.dispatched",
      payload: {
        order_id: orderId,
        status: "SHIPPED",
        carrier: "FEDEX_EXPRESS",
        tracking_number: "788290192801",
        captured_amount: parseFloat(totalAmount)
      }
    },
    {
      id: "DELIVERED",
      name: "6. Delivered to Customer",
      badge: "badge-emerald",
      icon: CheckCircle2,
      serviceNode: "Notifications & Customer Portal",
      description: "Delivery notification Webhook received from carrier. Order lifecycle marked COMPLETED.",
      dbTable: "orders (status: DELIVERED, delivered_at: 2026-08-13T10:00:00Z)",
      kafkaTopic: "ecomm.orders.delivered",
      payload: {
        order_id: orderId,
        status: "DELIVERED",
        proof_of_delivery: "Signed by Customer"
      }
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState([`[INIT] Order Simulator Initialized for ${orderId}`]);

  const currentState = STATES[currentIndex];

  const handleNext = () => {
    if (currentIndex < STATES.length - 1) {
      const nextState = STATES[currentIndex + 1];
      setCurrentIndex((prev) => prev + 1);
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Event Published -> '${nextState.kafkaTopic}' (${nextState.id})`,
        ...prev
      ]);
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsAutoPlaying(false);
    setLogs([`[RESET] Simulator reset to initial state: CREATED`]);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(currentState.payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  useEffect(() => {
    let timer;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < STATES.length - 1) {
            return prev + 1;
          } else {
            setIsAutoPlaying(false);
            return prev;
          }
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isAutoPlaying, STATES.length]);

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Play size={20} color="var(--accent-primary)" />
            Order Lifecycle State Machine & Microservices Simulator
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Simulate how eCommerce orders transition through DB states, Kafka topics, and Microservice handlers.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button className="btn btn-secondary" onClick={() => setShowConfig(!showConfig)} style={{ fontSize: "0.78rem" }}>
            <SlidersHorizontal size={14} /> Order Params
          </button>
          <button className="btn btn-secondary" onClick={handleReset} style={{ fontSize: "0.78rem" }}>
            <RotateCcw size={14} /> Reset
          </button>
          <button className="btn btn-secondary" onClick={handlePrev} disabled={currentIndex === 0} style={{ fontSize: "0.78rem" }}>
            <ArrowLeft size={14} /> Back
          </button>
          <button
            className={`btn ${isAutoPlaying ? "btn-secondary" : "btn-primary"}`}
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            style={{ fontSize: "0.78rem" }}
          >
            {isAutoPlaying ? <Pause size={14} /> : <Play size={14} />} {isAutoPlaying ? "Pause Auto" : "Auto Play"}
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleNext} 
            disabled={currentIndex === STATES.length - 1}
            style={{ fontSize: "0.78rem" }}
          >
            Next Step <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Optional Order Configuration Panel */}
      {showConfig && (
        <div className="animate-fade-in" style={{ background: "var(--bg-secondary)", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-glow)", marginBottom: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            <div>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Order ID</label>
              <input type="text" value={orderId} onChange={(e) => setOrderId(e.target.value)} style={{ width: "100%", padding: "0.45rem", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "0.82rem" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Customer ID</label>
              <input type="text" value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ width: "100%", padding: "0.45rem", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "0.82rem" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>SKU Code</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} style={{ width: "100%", padding: "0.45rem", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "0.82rem" }} />
            </div>
            <div>
              <label style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Total Amount ($)</label>
              <input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} style={{ width: "100%", padding: "0.45rem", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: "0.82rem" }} />
            </div>
          </div>
        </div>
      )}

      {/* State Progress Stepper */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${STATES.length}, 1fr)`,
        gap: "0.5rem",
        marginBottom: "1.25rem",
        overflowX: "auto"
      }}>
        {STATES.map((st, idx) => {
          const isActive = idx === currentIndex;
          const isPassed = idx < currentIndex;
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                background: isActive ? "var(--accent-light)" : isPassed ? "rgba(16, 185, 129, 0.1)" : "var(--bg-secondary)",
                border: `1px solid ${isActive ? "var(--accent-primary)" : isPassed ? "var(--emerald-accent)" : "var(--border-color)"}`,
                borderRadius: "var(--radius-md)",
                padding: "0.75rem",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: isPassed ? "var(--emerald-accent)" : isActive ? "var(--accent-primary)" : "var(--text-muted)" }}>
                  Step {idx + 1}
                </span>
                <Icon size={16} color={isActive ? "var(--accent-primary)" : isPassed ? "var(--emerald-accent)" : "var(--text-muted)"} />
              </div>
              <p style={{ fontSize: "0.8rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {st.id}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Microservice Node Indicator */}
      <div style={{ background: "rgba(99, 102, 241, 0.08)", padding: "0.65rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-glow)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Server size={16} color="var(--accent-primary)" />
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>ACTIVE MICROSERVICE COMPONENT:</span>
        <strong style={{ fontSize: "0.85rem", color: "var(--accent-primary)" }}>{currentState.serviceNode}</strong>
      </div>

      {/* Active State Detail Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* State Information */}
        <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span className={`badge ${currentState.badge}`}>{currentState.id}</span>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700 }}>{currentState.name}</h3>
          </div>

          <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
            {currentState.description}
          </p>

          <div style={{ marginBottom: "0.85rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Database size={14} /> Database Table Mutation:
            </label>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--emerald-accent)", marginTop: "0.25rem" }}>
              {currentState.dbTable}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Send size={14} /> Kafka Event Published:
            </label>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--amber-accent)", marginTop: "0.25rem" }}>
              Topic: {currentState.kafkaTopic}
            </div>
          </div>
        </div>

        {/* Live Payload Viewer */}
        <div style={{ background: "#090d16", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              ASYNCHRONOUS JSON EVENT PAYLOAD
            </span>
            <button
              onClick={handleCopyPayload}
              className="btn btn-secondary"
              style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem" }}
            >
              {copiedPayload ? <Check size={12} color="var(--emerald-accent)" /> : <Copy size={12} />}
              {copiedPayload ? "Copied" : "Copy"}
            </button>
          </div>

          <pre style={{ margin: 0, fontSize: "0.82rem", maxHeight: "200px" }}>
            {JSON.stringify(currentState.payload, null, 2)}
          </pre>
        </div>
      </div>

      {/* Execution Log Stream */}
      <div style={{ marginTop: "1rem", background: "rgba(0,0,0,0.3)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "0.35rem" }}>
          MICROSERVICES EVENT LOG AUDIT STREAM:
        </p>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.2rem", maxHeight: "100px", overflowY: "auto" }}>
          {logs.map((lg, i) => (
            <div key={i} style={{ color: i === 0 ? "var(--cyan-accent)" : "inherit" }}>
              {lg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
