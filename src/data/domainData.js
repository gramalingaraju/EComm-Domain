export const DOMAIN_MODULES = [
  {
    id: "overview",
    title: "1. eCommerce Overview & Business Models",
    category: "Fundamentals",
    icon: "Store",
    summary: "Essential business models, customer journeys, core value chain, and key business KPIs driving eCommerce applications.",
    sections: [
      {
        subtitle: "Primary eCommerce Business Models",
        content: `Understanding the business model determines how product catalogs are structured, how checkout flows operate, and how multi-tenancy or multi-vendor logic is built.`,
        table: {
          headers: ["Model", "Full Form", "Target Customer", "Key Technical Complexities", "Examples"],
          rows: [
            ["B2C", "Business-to-Consumer", "End Consumers", "High traffic concurrency, personalized pricing, quick checkout, mobile responsiveness", "Amazon, Nike, Sephora"],
            ["B2B", "Business-to-Business", "Wholesalers & Businesses", "Custom tier pricing, purchase order (PO) billing, bulk checkout, credit limits, account hierarchies", "Grainger, Alibaba, SAP Commerce"],
            ["D2C", "Direct-to-Consumer", "Brand direct buyers", "Brand storytelling, subscription orders, custom packaging options, omnichannel integration", "Warby Parker, Allbirds, Gymshark"],
            ["Marketplace", "Multi-Vendor Platform", "Sellers & Buyers", "Split payments, seller payouts, multi-warehouse inventory allocation, commission engines", "Etsy, eBay, Amazon Seller Central"],
            ["C2C", "Consumer-to-Consumer", "Peer-to-Peer", "User trust & verification, peer messaging, escrow payments, dispute handling", "Poshmark, Mercari"]
          ]
        }
      },
      {
        subtitle: "The eCommerce Value Chain & Order Lifecycle",
        content: `Every eCommerce system revolves around moving a customer through 6 fundamental stages. A failure at any stage directly impacts revenue and customer satisfaction.`,
        bullets: [
          "**1. Product Discovery**: Search engines (Algolia, Elasticsearch), category navigation, product recommendations, personalized PDPs.",
          "**2. Cart & Pricing**: Item persistence, coupon code validation, tax estimation (Avalara/Vertex), tiered discount calculation.",
          "**3. Checkout & Payment**: Address verification (AVS), payment authorization (Stripe, Adyen, PayPal), 3D-Secure 2.0 fraud checks.",
          "**4. Order Management (OMS)**: Order validation, payment capture, inventory reservation, order splitting across warehouses.",
          "**5. Warehouse & Fulfilment (WMS)**: Pick-pack-ship operations, shipping label generation (FedEx, UPS), 3PL API webhooks.",
          "**6. Customer Care & RMA**: Order tracking, return authorization (RMA), refund processing, store credit issuance."
        ]
      },
      {
        subtitle: "Key eCommerce Engineering KPIs & Metrics",
        content: `Developers and testers must understand the key business metrics to prioritize system stability and performance optimization.`,
        codeBlock: {
          language: "markdown",
          code: `+----------------------------+----------------------------------------------------+-------------------------------------------+
| Metric Name                | Formula / Calculation                              | Target / Industry Benchmark               |
+----------------------------+----------------------------------------------------+-------------------------------------------+
| Conversion Rate (CR)       | (Completed Orders / Total Sessions) * 100         | 2.5% - 4.0%                               |
| Average Order Value (AOV)  | Total Revenue / Total Number of Orders             | Depends on Niche ($80 - $150 typical)     |
| Cart Abandonment Rate      | 1 - (Completed Checkouts / Carts Created) * 100    | 65% - 75% (Target < 60%)                  |
| Gross Merchandise Value    | Total sales volume transacted                      | Primary GMV growth indicator              |
| Order Processing Latency   | Time from Order Placed to OMS Allocation           | < 500ms (P99)                             |
| Payment Auth Success Rate  | (Successful Auth / Total Auth Attempts) * 100      | > 98.5%                                   |
+----------------------------+----------------------------------------------------+-------------------------------------------+`
        }
      }
    ]
  },
  {
    id: "architecture",
    title: "2. System Architecture & Component Topology",
    category: "Architecture",
    icon: "Network",
    summary: "Monolithic vs. Headless Microservices architecture, API Gateways, Event Driven Systems, and Distributed Caching.",
    sections: [
      {
        subtitle: "Monolith vs. Headless & Composably Decoupled Architecture",
        content: `Modern eCommerce applications have transitioned from legacy monolithic suites (like Magento 1 or ATG) to Headless Composable Microservices (MACH architecture: Microservices, API-first, Cloud-native, Headless).`,
        bullets: [
          "**Headless Frontend (BFF)**: React / Next.js / Vue Storefront interacting via GraphQL/REST APIs.",
          "**API Gateway**: Routes traffic, enforces rate limiting, handles auth tokens (JWT), and manages request transformations (Kong, AWS API Gateway, Apigee).",
          "**Core Microservices**: Isolated microservices for Catalog, Cart, Payment, Order, Inventory, Customer, and Recommendations.",
          "**Event Bus (Kafka / RabbitMQ)**: Asynchronous event propagation (e.g. `order.created`, `inventory.reserved`, `payment.failed`)."
        ]
      },
      {
        subtitle: "Domain Microservices Interaction Topology",
        codeBlock: {
          language: "json",
          code: `{
  "architecture_pattern": "Headless Microservices with Event-Driven Sagas",
  "components": {
    "Storefront_BFF": "Next.js App Server (Serverless / Edge)",
    "API_Gateway": "Kong / AWS API Gateway",
    "Microservices": [
      { "name": "Catalog Service", "db": "MongoDB / Elasticsearch", "cache": "Redis" },
      { "name": "Cart Service", "db": "Redis / DynamoDB (Ephemeral)", "cache": "Redis" },
      { "name": "Pricing & Promo Engine", "db": "PostgreSQL", "cache": "Redis In-Memory" },
      { "name": "Payment Service", "db": "PostgreSQL (Encrypted)", "third_party": "Adyen / Stripe" },
      { "name": "OMS (Order Management)", "db": "PostgreSQL", "event_bus": "Apache Kafka" },
      { "name": "Inventory Service (WMS)", "db": "PostgreSQL / Redis", "lock_strategy": "Redis Mutex (Redlock)" }
    ]
  }
}`
        }
      },
      {
        subtitle: "Event-Driven Asynchronous Workflows (Kafka Topics)",
        content: `When a customer places an order, the system must not block the HTTP response on slow operations like sending emails or notifying 3PL systems. Asynchronous message events are published to Kafka topics:`,
        bullets: [
          "**Topic: `ecomm.orders.created`**: Fired by Order Service when order record is created in DB (`Status: PENDING`).",
          "**Topic: `ecomm.payments.authorized`**: Fired by Payment Service after 3DS approval.",
          "**Topic: `ecomm.inventory.allocated`**: Fired by Inventory Service after stock decrement.",
          "**Topic: `ecomm.shipment.dispatched`**: Fired by WMS Service when carrier label is created."
        ]
      }
    ]
  },
  {
    id: "catalog-pim",
    title: "3. Catalog Management & PIM (Product Info)",
    category: "Core Domain",
    icon: "Package",
    summary: "SKU structures, Parent-Child variants, category taxonomies, pricing rules, and search indexing.",
    sections: [
      {
        subtitle: "SKU Architecture: Parent SKU vs. Child SKU (Variants)",
        content: `In eCommerce, a product isn't just a single item. A product like "Nike Air Max" has multiple sizes (8, 9, 10) and colors (Red, Black).`,
        bullets: [
          "**Parent Product (Configurable Product)**: Contains shared metadata (Title, Description, Brand, Material, Care instructions). Non-purchasable.",
          "**Child Product (Simple SKU)**: Represents the specific sellable unit with its own unique SKU identifier, price, GTIN/UPC barcode, weight, dimensions, and inventory count.",
          "**Variant Attributes**: Color, Size, Style, Fit, Material."
        ]
      },
      {
        subtitle: "PIM Data Schema Example (JSON)",
        codeBlock: {
          language: "json",
          code: `{
  "parent_id": "PROD-NIK-AIRMAX-90",
  "brand": "Nike",
  "title": "Air Max 90 Running Shoes",
  "category_id": "CAT-FOOTWEAR-RUNNING",
  "attributes": {
    "gender": "Unisex",
    "material": "Leather/Mesh"
  },
  "variants": [
    {
      "sku": "NIK-AM90-BLK-09",
      "upc": "012345678901",
      "color": "Black",
      "size": "9 US",
      "price": {
        "msrp": 130.00,
        "currency": "USD"
      },
      "dimensions": { "length_cm": 30, "width_cm": 15, "weight_kg": 0.85 }
    },
    {
      "sku": "NIK-AM90-BLK-10",
      "upc": "012345678902",
      "color": "Black",
      "size": "10 US",
      "price": {
        "msrp": 130.00,
        "currency": "USD"
      },
      "dimensions": { "length_cm": 32, "width_cm": 16, "weight_kg": 0.90 }
    }
  ]
}`
        }
      }
    ]
  },
  {
    id: "cart-pricing",
    title: "4. Cart & Pricing & Promotion Engine",
    category: "Core Domain",
    icon: "ShoppingCart",
    summary: "Cart persistence, session handling, discount rules engines, coupon stacking, and tax calculations.",
    sections: [
      {
        subtitle: "Cart Persistence & Guest to User Merging",
        content: `A common engineering edge case occurs when a user adds items to a cart as an anonymous guest, and then logs in.`,
        bullets: [
          "**Guest Cart**: Identified by a secure HTTP-Only Cookie or UUID token (`guest_cart_id`) stored in Redis.",
          "**Authenticated Cart**: Bound to the user's `account_id` in DB.",
          "**Merge Strategy**: When logging in, the system merges line items. If the same SKU exists in both carts, quantities are combined (subject to maximum purchase limits per order)."
        ]
      },
      {
        subtitle: "Promotion Rules Engine Logic",
        content: `Promotions engines evaluate rules sequentially against cart conditions:`,
        codeBlock: {
          language: "json",
          code: `{
  "promotion_id": "PROMO-SUMMER-2026",
  "discount_type": "PERCENTAGE",
  "value": 20.0,
  "conditions": {
    "min_cart_subtotal": 100.00,
    "eligible_category_ids": ["CAT-FOOTWEAR-RUNNING"],
    "excluded_skus": ["NIK-AM90-LIMITED"],
    "max_uses_per_user": 1,
    "stackable_with_other_coupons": false
  },
  "valid_from": "2026-06-01T00:00:00Z",
  "valid_until": "2026-08-31T23:59:59Z"
}`
        }
      }
    ]
  },
  {
    id: "checkout-payment",
    title: "5. Checkout & Payment Gateway Integration",
    category: "Core Domain",
    icon: "CreditCard",
    summary: "PCI-DSS compliance, Tokenization, 3D-Secure 2.0, Authorize vs. Capture flows, Webhook reconciliation.",
    sections: [
      {
        subtitle: "PCI-DSS & Payment Tokenization (Hosted Fields)",
        content: `To minimize PCI-DSS compliance scope (PCI-DSS SAQ A), merchant servers **MUST NEVER** receive or process raw 16-digit credit card numbers (PAN) or CVV codes directly.`,
        bullets: [
          "**Hosted iFrame / SDK**: Card details are typed into iFrames served directly from the Payment Service Provider (PSP) like Stripe or Adyen.",
          "**Payment Token**: PSP returns a safe single-use token (`tok_1N2345678`) to the frontend browser.",
          "**Backend Transaction**: Storefront passes the token to its backend, which calls the PSP API to request funds."
        ]
      },
      {
        subtitle: "Authorize vs. Capture Payment Lifecycle",
        content: `Understanding the difference between Auth and Capture is vital for developers and QA engineers:`,
        table: {
          headers: ["Phase", "What Happens", "Financial Impact", "Expiry Window"],
          rows: [
            ["Authorization (Auth)", "Validates card, checks funds availability, and reserves/holds money on credit limit.", "Cardholder sees 'Pending Hold'. Merchant does NOT have the funds yet.", "7 to 30 Days"],
            ["Capture", "Transfers the held funds from issuing bank to merchant acquiring bank.", "Real financial transaction occurs.", "Executed upon Physical Shipment"],
            ["Void", "Cancels an authorization before capture occurs.", "Hold released immediately with zero interchange fees.", "Instant"],
            ["Refund", "Returns funds from merchant back to customer after capture.", "Incurs refund processing fees.", "Up to 90 Days post-purchase"]
          ]
        }
      }
    ]
  },
  {
    id: "oms-inventory",
    title: "6. Order Management (OMS) & Inventory (WMS)",
    category: "Core Domain",
    icon: "Truck",
    summary: "Order state machine transitions, Available-to-Promise (ATP) calculations, safety stock, and warehouse routing.",
    sections: [
      {
        subtitle: "Order Lifecycle State Machine",
        content: `An order progresses through strict state transitions. Invalid state jumps (e.g., from CREATED directly to DELIVERED) must be blocked by validation logic.`,
        codeBlock: {
          language: "markdown",
          code: `[ CREATED ] ---> (Payment Auth OK) ---> [ PAYMENT_AUTHORIZED ] 
                                                   |
                                                   v
[ CANCELLED ] <--- (Out of Stock / Fraud) <--- [ ALLOCATING ]
                                                   |
                                                   v
                                            [ ALLOCATED ] (Stock Reserved at Warehouse)
                                                   |
                                                   v
                                            [ FULFILLING ] (Pick & Pack at WMS)
                                                   |
                                                   v
[ REFUNDED ] <--- (RMA Return) <------------ [ SHIPPED ] ---> [ DELIVERED ]`
        }
      },
      {
        subtitle: "Available-To-Promise (ATP) Formula",
        content: `Calculating available stock correctly prevents overselling items during high-volume sales.`,
        codeBlock: {
          language: "javascript",
          code: `// Available to Promise (ATP) Stock Calculation Formula
const totalPhysicalOnHand = 150;    // Actual count on warehouse shelves
const reservedInCarts = 20;         // Held in open active user checkout sessions (15-min TTL)
const allocatedToOrders = 45;       // Committed to paid orders awaiting picking
const safetyStockThreshold = 10;     // Buffer to absorb inventory variance

const ATP = totalPhysicalOnHand - reservedInCarts - allocatedToOrders - safetyStockThreshold;
// ATP = 150 - 20 - 45 - 10 = 65 units available for new buyers`
        }
      }
    ]
  },
  {
    id: "engineering-specs",
    title: "7. Engineering Specs & High Concurrency Architecture",
    category: "Engineering",
    icon: "Code",
    summary: "Idempotency keys, flash sale inventory locking (Redis Mutex), DB indexing, and caching patterns.",
    sections: [
      {
        subtitle: "Idempotency in eCommerce APIs",
        content: `Network glitches can cause users or frontend retries to send duplicate payment or order placement HTTP requests. Idempotency guarantees that duplicate calls produce the exact same outcome without charging twice.`,
        codeBlock: {
          language: "json",
          code: `POST /api/v1/checkout/orders
Header: Idempotency-Key: 9b1deb4d-3b7d-4146-993c-123456789abc

Response (First Request):
HTTP 201 Created
{ "order_id": "ORD-2026-9981", "status": "CREATED", "total": 149.99 }

Response (Duplicate Request within 24 Hours):
HTTP 200 OK (Served directly from Redis Idempotency Cache)
{ "order_id": "ORD-2026-9981", "status": "CREATED", "total": 149.99, "is_duplicate_replay": true }`
        }
      },
      {
        subtitle: "Flash Sale Inventory Concurrency Control",
        content: `When 10,000 customers try to purchase 100 available units in 1 second (Flash Sale / Sneaker Drop), standard SQL \`UPDATE stock SET qty = qty - 1\` causes race conditions and DB row lock deadlocks.`,
        bullets: [
          "**Pessimistic Locking (`SELECT FOR UPDATE`)**: Locks the DB row until transaction completes. High safety, but causes database connection pool starvation under extreme traffic.",
          "**Optimistic Concurrency Control (OCC)**: Uses version numbers (`UPDATE inventory SET stock = stock - 1, version = version + 1 WHERE sku = 'XYZ' AND version = 4`). Returns 0 rows affected if version changed.",
          "**Redis Atomic Mutex / DECRBY**: Decrement stock atomically in Redis in-memory cache (`INCRBY / DECRBY`). Highest throughput (>50k ops/sec). Sync back to Postgres asynchronously via Kafka."
        ]
      }
    ]
  }
];
