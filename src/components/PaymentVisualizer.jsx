import React, { useState } from "react";
import { 
  CreditCard, 
  Lock, 
  RefreshCw,
  Smartphone,
  X
} from "lucide-react";

export default function PaymentVisualizer() {
  const [activeStep, setActiveStep] = useState(0);
  
  // Card Input Sandbox State
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [cardHolder, setCardHolder] = useState("Jane Doe");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [amount, setAmount] = useState(149.99);
  const [currency] = useState("USD");
  
  // Scenario Preset Selection
  const [scenario, setScenario] = useState("SUCCESS"); // SUCCESS | INSUFFICIENT_FUNDS | FRAUD_FLAG | THREEDS_FAIL
  
  // Interactive 3DS Challenge State
  const [show3DSModal, setShow3DSModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [is3DSVerified, setIs3DSVerified] = useState(false);
  const [threeDSError, setThreeDSError] = useState("");

  // Live Generated Token & Payloads State
  const [paymentToken, setPaymentToken] = useState("tok_1N8921A_visa_live");
  const [capturedAmount, setCapturedAmount] = useState(0);

  const STEPS = [
    {
      step: 1,
      title: "1. Client-Side Tokenization",
      actor: "Frontend Storefront -> PSP SDK (Stripe/Adyen)",
      detail: "Customer card input is sent directly from an isolated PCI-DSS iFrame to the Payment Gateway. A single-use secure token is generated and returned to the browser. Raw card details never touch your server.",
      payload: {
        event: "token.created",
        token_id: paymentToken,
        card_holder: cardHolder,
        card_brand: cardNumber.startsWith("4") ? "Visa" : cardNumber.startsWith("5") ? "Mastercard" : "Amex",
        last4: cardNumber.replace(/\s/g, "").slice(-4) || "4242",
        cvc_check: cvc ? "passed" : "unchecked",
        exp_month: expiry.split("/")[0] || "12",
        exp_year: `20${expiry.split("/")[1] || "28"}`,
        pci_compliance_status: "SAQ_A_VERIFIED"
      }
    },
    {
      step: 2,
      title: "2. 3D-Secure 2.0 SCA Challenge",
      actor: "Merchant Backend -> Issuing Bank 3DS Server",
      detail: "Strong Customer Authentication (SCA) verification under PSD2 regulation. The issuing bank evaluates transaction risk and issues a 3DS challenge (SMS OTP or Biometric prompt).",
      payload: {
        event: "3ds_challenge.triggered",
        three_ds_version: "2.2.0",
        authentication_status: scenario === "THREEDS_FAIL" ? "FAILED" : is3DSVerified ? "AUTHENTICATED" : "CHALLENGE_REQUIRED",
        sca_method: "SMS_OTP",
        cavv: "BwABBIIFkwAAAAAASQWSAAAAAAA=",
        transaction_risk_score: scenario === "FRAUD_FLAG" ? 92 : 14
      }
    },
    {
      step: 3,
      title: "3. Payment Authorization (Hold)",
      actor: "Merchant Backend -> Payment Gateway API",
      detail: "Merchant backend submits Token + Amount ($" + amount + ") + Idempotency Key. Issuing bank validates credit limit, places temporary financial authorization hold on customer card.",
      payload: scenario === "INSUFFICIENT_FUNDS" ? {
        status: "DECLINED",
        error_code: "insufficient_funds",
        message: "The card has insufficient funds to complete the purchase.",
        auth_code: null
      } : scenario === "FRAUD_FLAG" ? {
        status: "BLOCKED",
        error_code: "high_risk_fraud",
        message: "Transaction flagged by Stripe Radar risk rules (Score: 92/100).",
        auth_code: null
      } : {
        status: "AUTHORIZED",
        authorization_code: "AUTH_OK_90218",
        amount_authorized: parseFloat(amount),
        currency: currency,
        idempotency_key: "idempotency_hdr_88192a"
      }
    },
    {
      step: 4,
      title: "4. Asynchronous Webhook Event",
      actor: "Payment Gateway -> Merchant Webhook Receiver",
      detail: "Payment provider transmits an encrypted HTTP POST webhook event. Merchant verifies PSP signature header, updates Order DB state to PAYMENT_AUTHORIZED, and queues picking job.",
      payload: {
        id: "evt_1N8921_webhook",
        object: "event",
        type: scenario === "SUCCESS" ? "payment_intent.succeeded" : "payment_intent.payment_failed",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            id: "pi_3N8912A",
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            status: scenario === "SUCCESS" ? "succeeded" : "requires_payment_method"
          }
        },
        signature_verified: true
      }
    },
    {
      step: 5,
      title: "5. Settlement Capture & Dispatch",
      actor: "WMS / OMS -> Payment Gateway API",
      detail: "Physical item picked and shipped by warehouse. OMS issues Capture API call to officially transfer held funds from issuing bank to merchant merchant account.",
      payload: {
        capture_id: "cap_901281A",
        status: scenario === "SUCCESS" ? "CAPTURED" : "CANCELLED",
        captured_amount: scenario === "SUCCESS" ? (capturedAmount || amount) : 0,
        settlement_currency: currency,
        estimated_payout_date: "2026-08-15T00:00:00Z"
      }
    }
  ];

  const handleApplyPreset = (type) => {
    setScenario(type);
    setIs3DSVerified(false);
    setShow3DSModal(false);

    if (type === "SUCCESS") {
      setCardNumber("4242 4242 4242 4242");
      setPaymentToken("tok_1N8921A_visa_live");
      setCapturedAmount(amount);
    } else if (type === "INSUFFICIENT_FUNDS") {
      setCardNumber("4000 0000 0000 9999");
      setPaymentToken("tok_declined_insufficient_funds");
    } else if (type === "FRAUD_FLAG") {
      setCardNumber("4111 1111 1111 1111");
      setPaymentToken("tok_fraud_risk_blocked");
    } else if (type === "THREEDS_FAIL") {
      setCardNumber("4000 0000 0000 3002");
      setPaymentToken("tok_3ds_challenge_failed");
    }
  };

  const handleSimulateTokenize = () => {
    const randomTok = "tok_" + Math.random().toString(36).substring(2, 9) + "_demo";
    setPaymentToken(randomTok);
    setActiveStep(0);
  };

  const handleVerifyOTP = () => {
    if (otpCode === "123456" || otpCode.length === 6) {
      setIs3DSVerified(true);
      setShow3DSModal(false);
      setThreeDSError("");
      setActiveStep(2);
    } else {
      setThreeDSError("Invalid OTP. Enter test code 123456 to pass 3DS.");
    }
  };

  const currentStepObj = STEPS[activeStep];

  return (
    <div className="glass-panel" style={{ padding: "1.5rem", margin: "1rem 0" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CreditCard size={20} color="var(--emerald-accent)" />
            Payment Gateway, PCI-DSS Tokenization & 3DS 2.0 Sandbox
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
            Test card tokenization, 3D-Secure 2.0 authentication challenge, authorization holds, webhooks, and capture settlement.
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <button
            onClick={() => handleApplyPreset("SUCCESS")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${scenario === "SUCCESS" ? "var(--emerald-accent)" : "var(--border-color)"}`,
              background: scenario === "SUCCESS" ? "var(--emerald-light)" : "var(--bg-secondary)",
              color: scenario === "SUCCESS" ? "var(--emerald-accent)" : "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ✅ Success Flow
          </button>
          <button
            onClick={() => handleApplyPreset("INSUFFICIENT_FUNDS")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${scenario === "INSUFFICIENT_FUNDS" ? "var(--amber-accent)" : "var(--border-color)"}`,
              background: scenario === "INSUFFICIENT_FUNDS" ? "var(--amber-light)" : "var(--bg-secondary)",
              color: scenario === "INSUFFICIENT_FUNDS" ? "var(--amber-accent)" : "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            ⚠️ Insufficient Funds
          </button>
          <button
            onClick={() => handleApplyPreset("FRAUD_FLAG")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${scenario === "FRAUD_FLAG" ? "var(--rose-accent)" : "var(--border-color)"}`,
              background: scenario === "FRAUD_FLAG" ? "var(--rose-light)" : "var(--bg-secondary)",
              color: scenario === "FRAUD_FLAG" ? "var(--rose-accent)" : "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🛡️ Fraud Block
          </button>
          <button
            onClick={() => handleApplyPreset("THREEDS_FAIL")}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${scenario === "THREEDS_FAIL" ? "var(--rose-accent)" : "var(--border-color)"}`,
              background: scenario === "THREEDS_FAIL" ? "var(--rose-light)" : "var(--bg-secondary)",
              color: scenario === "THREEDS_FAIL" ? "var(--rose-accent)" : "var(--text-secondary)",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            🔒 3DS Auth Failed
          </button>
        </div>
      </div>

      {/* Interactive Card Form Sandbox Section */}
      <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-primary)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Lock size={14} /> HOSTED PCI-DSS COMPLIANT IFRAME (FRONTEND)
          </span>
          <span className="badge badge-emerald" style={{ fontSize: "0.62rem" }}>SAQ-A CERTIFIED</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.5fr 1fr 1fr 1fr", gap: "0.75rem", alignItems: "flex-end" }}>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Card Holder</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Expiry Date</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>CVC</label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.2rem" }}>Amount (${currency})</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem"
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: "0.75rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSimulateTokenize}
            className="btn btn-primary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
          >
            <RefreshCw size={14} /> Generate Single-Use PSP Token
          </button>
        </div>
      </div>

      {/* Stepper Navigation Pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", overflowX: "auto" }}>
        {STEPS.map((st, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={st.step}
              onClick={() => setActiveStep(idx)}
              style={{
                flex: 1,
                padding: "0.65rem 0.5rem",
                borderRadius: "var(--radius-md)",
                border: `1px solid ${isActive ? "var(--emerald-accent)" : "var(--border-color)"}`,
                background: isActive ? "var(--emerald-light)" : "var(--bg-secondary)",
                color: isActive ? "var(--emerald-accent)" : "var(--text-secondary)",
                fontWeight: 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              }}
            >
              Step {st.step}: {st.title.split(" ")[1]}
            </button>
          );
        })}
      </div>

      {/* Step Detail Content & Live API Payload Display */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        {/* Step Explanation & Interactive Action Trigger */}
        <div style={{ background: "var(--bg-secondary)", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-emerald">Step {currentStepObj.step}</span>
            <h3 style={{ fontSize: "1rem", fontWeight: 700 }}>{currentStepObj.title}</h3>
          </div>

          <p style={{ fontSize: "0.8rem", color: "var(--accent-primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
            Actor Node: {currentStepObj.actor}
          </p>

          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
            {currentStepObj.detail}
          </p>

          {/* Interactive Trigger Button inside Step 2 for 3DS Modal */}
          {activeStep === 1 && (
            <div style={{ background: "rgba(99, 102, 241, 0.1)", padding: "0.85rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-glow)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-primary)" }}>3DS Challenge Status:</span>
                  <p style={{ fontSize: "0.82rem", color: is3DSVerified ? "var(--emerald-accent)" : "var(--amber-accent)", fontWeight: 700 }}>
                    {is3DSVerified ? "AUTHENTICATED (PASSED)" : "PENDING SCA VERIFICATION"}
                  </p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShow3DSModal(true)}
                  style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem" }}
                >
                  <Smartphone size={14} /> Open 3DS OTP Popup
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Payload Display */}
        <div style={{ background: "#090d16", padding: "1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              API PAYLOAD SPECIFICATION
            </span>
            <Lock size={14} color="var(--emerald-accent)" />
          </div>

          <pre style={{ margin: 0, fontSize: "0.82rem", maxHeight: "250px" }}>
            {JSON.stringify(currentStepObj.payload, null, 2)}
          </pre>
        </div>
      </div>

      {/* Interactive 3DS 2.0 Challenge Popup Modal */}
      {show3DSModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          zIndex: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "420px", padding: "1.5rem", border: "1px solid var(--emerald-accent)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Lock size={20} color="var(--emerald-accent)" />
                <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Verified by Visa / 3DS 2.0</h3>
              </div>
              <button onClick={() => setShow3DSModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
              Enter the 6-digit SMS One-Time Passcode sent to your registered mobile device to authorize payment of <strong>${amount} {currency}</strong>.
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Enter test OTP: 123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "1rem",
                  letterSpacing: "0.2em",
                  textAlign: "center"
                }}
              />
              {threeDSError && (
                <p style={{ color: "var(--rose-accent)", fontSize: "0.75rem", marginTop: "0.35rem" }}>{threeDSError}</p>
              )}
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setScenario("THREEDS_FAIL");
                  setIs3DSVerified(false);
                  setShow3DSModal(false);
                }}
                style={{ flex: 1, fontSize: "0.8rem" }}
              >
                Simulate 3DS Fail
              </button>
              <button
                className="btn btn-primary"
                onClick={handleVerifyOTP}
                style={{ flex: 1, fontSize: "0.8rem" }}
              >
                Submit OTP (123456)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
