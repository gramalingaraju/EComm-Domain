export const OPERATIONAL_PLAYBOOKS = [
  {
    id: "INC-PLAY-001",
    title: "Resolving Stuck Orders in 'PAYMENT_PENDING' or 'ALLOCATING' State",
    category: "OMS & Payments",
    severity: "P2 - Major Impact",
    symptom: "Customer completed checkout 30 minutes ago, but order status remains stuck in PAYMENT_PENDING. Warehouse picking is not triggered.",
    rootCauses: [
      "Payment Gateway Webhook POST request failed or timed out during peak load.",
      "Asynchronous Kafka consumer node processing 'order.created' crashed before releasing lock.",
      "Database deadlock during inventory reservation."
    ],
    resolutionSteps: [
      "1. Query Order Database: Check order status and check `payment_intent_id` field in `orders` table.",
      "2. Check Payment PSP Dashboard (Stripe/Adyen): Search payment intent ID to verify if charge status is 'succeeded'.",
      "3. If Payment is Succeeded: Run administrative re-drive command via CLI/Admin Portal: `npm run ops:redrive-order -- --orderId=ORD-9981 --action=FORCE_ALLOCATE`.",
      "4. If Payment Failed on PSP: Execute manual status sync to transition order to `PAYMENT_FAILED` and notify customer via email.",
      "5. Verify: Check that inventory allocation event was produced on Kafka topic `ecomm.inventory.allocated`."
    ],
    commandSnippet: `// CLI Recovery Script for L2/L3 Maintenance Engineers
node scripts/order-recovery.js --order-id=ORD-2026-8812 --verify-psp=stripe`
  },
  {
    id: "INC-PLAY-002",
    title: "Inventory Discrepancy Between Storefront and Physical Warehouse (WMS)",
    category: "Inventory & WMS",
    severity: "P3 - Moderate Impact",
    symptom: "Customer orders SKU, but warehouse picking staff reports 0 units physically on shelf (Phantom Inventory).",
    rootCauses: [
      "Damaged or stolen inventory not written off in WMS system.",
      "Sync lag or dropped message between ERP and Storefront Redis inventory cache.",
      "Unreleased inventory holds from abandoned checkout sessions."
    ],
    resolutionSteps: [
      "1. Freeze SKU on Storefront: Set `is_purchasable = false` in PIM/Catalog dashboard to prevent further incoming orders.",
      "2. Initiate Order Substitution/Cancellation: Contact customer to offer alternate size/color variant or process immediate payment refund.",
      "3. Trigger Inventory Reconciliation Job: Run script to reconcile Redis cache with WMS actual count: `npm run ops:sync-inventory -- --sku=NIK-AM90-BLK-09`.",
      "4. Unfreeze SKU with updated ATP count."
    ],
    commandSnippet: `// Trigger Immediate Force Sync from WMS Master to Storefront Redis
curl -X POST https://api.storefront.internal/v1/ops/inventory/reconcile \\
  -H "Authorization: Bearer $OPS_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{"sku": "NIK-AM90-BLK-09", "force_wms_source": true}'`
  },
  {
    id: "INC-PLAY-003",
    title: "Flash Sale API Latency Spike & DB Connection Pool Starvation",
    category: "Performance & Infra",
    severity: "P1 - Critical Outage",
    symptom: "Checkout response times spike from 200ms to >15,000ms. HTTP 504 errors on PDP and Cart API.",
    rootCauses: [
      "Uncached database queries on product recommendations or promotion rule evaluations.",
      "PostgreSQL connection pool exhausted by unindexed queries.",
      "Redis cache stampede (key expiration of high-traffic homepage banner product)."
    ],
    resolutionSteps: [
      "1. Enable Circuit Breaker: Trip circuit breaker on recommendation engine to return fallback static popular products.",
      "2. Scale Out Redis Read Replicas and API Pods in Kubernetes cluster (`kubectl scale deployment cart-service --replicas=20`).",
      "3. Warm Cache: Re-populate expired high-traffic SKU cache keys using pre-warm script.",
      "4. Verify DB Connection Pool metric returns below 70% threshold."
    ],
    commandSnippet: `// Kubernetes Emergency Pod Scale Script
kubectl scale deployment/checkout-service --replicas=30 -n production
kubectl rollout status deployment/checkout-service -n production`
  }
];
