export const QA_TEST_SCENARIOS = [
  // --- Cart & Checkout ---
  {
    id: "TC-CART-001",
    title: "Guest Cart Merging on User Login",
    category: "Cart & Checkout",
    severity: "High",
    type: "Functional",
    precondition: "User has 2 items in anonymous guest cart. User possesses an existing account with 1 item in saved cart.",
    steps: [
      "1. Add SKU 'NIK-AM90-BLK-09' (Qty: 2) as Guest.",
      "2. Click 'Sign In' button on navigation bar.",
      "3. Enter credentials for existing account containing SKU 'PUM-RSX-WHT-10' (Qty: 1).",
      "4. Complete login authentication."
    ],
    expectedResult: "Cart updates automatically to reflect both guest items (NIK-AM90-BLK-09 Qty:2) and existing account items (PUM-RSX-WHT-10 Qty:1). Total line items count = 2, total unit count = 3.",
    edgeCaseRisk: "Duplicate lines created instead of quantity summation when same SKU exists in both guest and account carts."
  },
  {
    id: "TC-CART-002",
    title: "Stock Depletion During Active Checkout Session",
    category: "Cart & Checkout",
    severity: "Critical",
    type: "Edge Case",
    precondition: "Only 1 unit of SKU 'LIMITED-HOODIE-L' left in stock. User A adds item to cart. User B buys the last unit via 1-click checkout.",
    steps: [
      "1. User A navigates to Checkout Review screen with 'LIMITED-HOODIE-L'.",
      "2. User B completes order in parallel, reducing physical ATP stock to 0.",
      "3. User A clicks 'Place Order & Pay'."
    ],
    expectedResult: "Checkout blocks order creation, displays clear notification banner: 'Item LIMITED-HOODIE-L is out of stock', removes out-of-stock item or prompts user to review cart, and prevents card authorization.",
    edgeCaseRisk: "Payment is authorized for 0 available stock, causing immediate backorder or stuck order requiring manual customer support intervention."
  },
  {
    id: "TC-CART-003",
    title: "Coupon Code Stacking Rules Enforcement",
    category: "Cart & Checkout",
    severity: "Medium",
    type: "Functional",
    precondition: "Coupon 'WELCOME10' (Non-stackable 10% off) applied to cart. User attempts to enter coupon 'SUMMER20' (20% off).",
    steps: [
      "1. Apply 'WELCOME10' code in cart coupon field.",
      "2. Verify subtotal discounted by 10%.",
      "3. Type 'SUMMER20' in coupon input field and press Apply."
    ],
    expectedResult: "System enforces non-stackable rule. Prompt displayed: 'SUMMER20 cannot be combined with WELCOME10. Replace current promo?'. Applying replaces previous code without applying both.",
    edgeCaseRisk: "Double discounting leading to negative margin or $0 cart subtotal."
  },

  // --- Payment Gateway ---
  {
    id: "TC-PAY-001",
    title: "3D-Secure 2.0 Challenge Failure Handling",
    category: "Payment Gateway",
    severity: "High",
    type: "Security & Edge Case",
    precondition: "Customer selects Credit Card payment requiring 3DS OTP verification.",
    steps: [
      "1. Fill credit card details and click Pay.",
      "2. Bank 3DS Modal popup opens.",
      "3. User inputs incorrect OTP code 3 times or closes the modal iframe."
    ],
    expectedResult: "Checkout screen catches 3DS failure callback, displays friendly error: 'Payment authentication failed by issuing bank. Please try another card or payment method', order remains in UNPAID/DRAFT state without creating orphan OMS record.",
    edgeCaseRisk: "Order gets created in backend database despite payment authorization failure."
  },
  {
    id: "TC-PAY-002",
    title: "Network Timeout During Payment Gateway Webhook Delivery",
    category: "Payment Gateway",
    severity: "Critical",
    type: "Resilience & Asynchronous",
    precondition: "Customer payment succeeds on Stripe/Adyen, but merchant webhook server experiences 10-second DB connection pool timeout.",
    steps: [
      "1. Customer completes 3DS payment.",
      "2. Stripe sends HTTP POST webhook `payment_intent.succeeded`.",
      "3. Merchant server returns HTTP 504 Gateway Timeout on initial webhook request.",
      "4. Stripe retries webhook delivery with exponential backoff 5 minutes later."
    ],
    expectedResult: "Merchant webhook handler handles retry gracefully using Idempotency verification (checks if transaction reference was already recorded). Updates order state to `PAYMENT_AUTHORIZED` without duplicate ledger entries.",
    edgeCaseRisk: "Duplicate order confirmation emails sent or duplicate ledger transactions recorded."
  },
  {
    id: "TC-PAY-003",
    title: "Price Tampering via Client-Side Payload Modification",
    category: "Payment Gateway",
    severity: "Critical",
    type: "Security Penetration",
    precondition: "Attacker intercepts HTTP request POST /api/checkout using Burp Suite proxy tool.",
    steps: [
      "1. Add item worth $500.00 to cart.",
      "2. Intercept checkout payload and modify `subtotal: 500.00` to `subtotal: 1.00`.",
      "3. Forward modified request to server."
    ],
    expectedResult: "Server ignores client-passed prices entirely, recalculates subtotal authoritatively from server-side database catalog, and charges full $500.00 or rejects request with HTTP 400 Bad Request.",
    edgeCaseRisk: "Trusting client-side cart price, resulting in products sold for fractional amounts."
  },

  // --- Order Management System (OMS) ---
  {
    id: "TC-OMS-001",
    title: "Split Order Allocation Across Multiple Warehouses",
    category: "Order Management (OMS)",
    severity: "High",
    type: "Functional & Fulfillment",
    precondition: "Order contains Item A (Stock in Warehouse East) and Item B (Stock in Warehouse West).",
    steps: [
      "1. Customer places order containing both Item A and Item B.",
      "2. Order Service passes order to OMS Routing Engine."
    ],
    expectedResult: "OMS automatically splits parent order into 2 child fulfillment orders (Sub-Order A -> WH East, Sub-Order B -> WH West). Both warehouses receive separate picking lists. Customer tracking portal displays split tracking numbers.",
    edgeCaseRisk: "Order stuck in UNALLOCATED state because no single warehouse possesses 100% of line items."
  },
  {
    id: "TC-OMS-002",
    title: "Order Cancellation Window Before Warehouse Picking Begins",
    category: "Order Management (OMS)",
    severity: "Medium",
    type: "Functional",
    precondition: "Order is in `PAYMENT_AUTHORIZED` status (not yet picked in WMS).",
    steps: [
      "1. Customer opens 'My Orders' portal within 15 minutes of purchase.",
      "2. Clicks 'Cancel Order' button.",
      "3. Selects cancellation reason: 'Ordered by mistake'."
    ],
    expectedResult: "Order state changes to `CANCELLED`, payment authorization is voided immediately (releasing customer hold without capture fee), and allocated inventory is restored back to Available-to-Promise (ATP).",
    edgeCaseRisk: "Cancellation accepted online after warehouse has already picked and packed box."
  },

  // --- Inventory & Concurrency ---
  {
    id: "TC-INV-001",
    title: "Flash Sale Overselling Under High Concurrency Load",
    category: "Inventory & Concurrency",
    severity: "Critical",
    type: "Performance & Stress",
    precondition: "Exactly 10 units of SKU 'LIMITED-SNEAKER' in stock. 500 concurrent virtual users trigger 'Submit Order' at exact same millisecond.",
    steps: [
      "1. Launch JMeter load testing script with 500 threads executing POST /api/v1/orders simultaneously.",
      "2. Monitor Redis stock counters and Postgres inventory table."
    ],
    expectedResult: "Exactly 10 orders succeed (`201 Created`). 490 orders receive `409 Conflict - Out of Stock`. Final inventory stock count equals exactly 0 (No negative inventory values).",
    edgeCaseRisk: "Negative inventory balance (e.g. stock = -42) due to unhandled database race conditions."
  },

  // --- L2/L3 Operations & Maintenance ---
  {
    id: "TC-OPS-001",
    title: "Stuck Order Recovery from Database Deadlocks",
    category: "Operations & Maintenance",
    severity: "High",
    type: "Troubleshooting",
    precondition: "Order stuck in `PROCESSING` state for >2 hours due to crashed worker node during API call.",
    steps: [
      "1. Run L3 Operational Diagnostic Query to identify orders in state `PROCESSING` with `updated_at < NOW() - INTERVAL 2 HOURS`.",
      "2. Execute Order Re-drive cron job with Idempotent lock.",
      "3. Verify payment status via payment gateway reconciliation API."
    ],
    expectedResult: "Re-drive script safely transitions order to `PAYMENT_AUTHORIZED` if funds confirmed, or `CANCELLED` if payment expired, logging audit record in support portal.",
    edgeCaseRisk: "Double fulfillment of order if worker re-drives order while WMS was actively shipping."
  }
];
