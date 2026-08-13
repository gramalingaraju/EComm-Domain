export const ONBOARDING_ROADMAP = [
  {
    week: "Week 1",
    title: "Domain Fundamentals & eCommerce Value Chain",
    description: "Understand business models, value chain stages, core terminology, and high-level architecture.",
    tasks: [
      { id: "w1-t1", title: "Read eCommerce Business Models (B2C vs B2B vs D2C)", details: "Review target customer differences, PO billing vs instant card checkout." },
      { id: "w1-t2", title: "Study Parent vs Child SKU Architecture", details: "Understand configurable products, variants, attributes, and GTIN barcode tagging." },
      { id: "w1-t3", title: "Review Core eCommerce KPIs", details: "Learn Conversion Rate, AOV, Cart Abandonment Rate, and Order Processing Latency." },
      { id: "w1-t4", title: "Explore Monolith vs Headless Microservices", details: "Examine API Gateway, Storefront BFF, and Microservices interaction topology." }
    ]
  },
  {
    week: "Week 2",
    title: "Environment Setup, Development & QA Workflows",
    description: "Set up local repositories, configure mock payment gateways, and run end-to-end checkout scenarios.",
    tasks: [
      { id: "w2-t1", title: "Clone Repositories & Local Docker Compose Setup", details: "Spin up Storefront, OMS, Redis, Postgres, and Kafka containers locally." },
      { id: "w2-t2", title: "Configure Mock Payment Sandbox (Stripe / Adyen Test Keys)", details: "Test 3DS success, 3DS decline, and webhook callback handling locally." },
      { id: "w2-t3", title: "Execute QA Test Cases TC-CART-001 & TC-PAY-001", details: "Perform guest cart merging and 3DS failure scenario testing." },
      { id: "w2-t4", title: "Inspect Kafka Event Messages", details: "Use Kafka UI to observe `ecomm.orders.created` and `ecomm.inventory.allocated`." }
    ]
  },
  {
    week: "Week 3",
    title: "Deep-Dive Engineering & Concurrency Control",
    description: "Master Idempotency keys, ATP inventory calculations, Redis mutex locking, and split order routing.",
    tasks: [
      { id: "w3-t1", title: "Study Idempotency Implementation in Checkout API", details: "Inspect Redis Idempotency header validation logic." },
      { id: "w3-t2", title: "Test Flash Sale Concurrency & Race Condition Fixes", details: "Run JMeter / k6 load test script simulating 500 concurrent buyers on single SKU." },
      { id: "w3-t3", title: "Review OMS Split-Fulfillment State Machine", details: "Trace multi-warehouse allocation logic and split order tracking updates." }
    ]
  },
  {
    week: "Week 4",
    title: "L2/L3 Maintenance, Playbooks & First Ticket",
    description: "Learn operational incident resolution, re-drive stuck orders, and deliver first ticket PR.",
    tasks: [
      { id: "w4-t1", title: "Read Operational Playbooks (INC-PLAY-001 & INC-PLAY-002)", details: "Practice re-driving stuck orders and running inventory sync CLI commands in staging." },
      { id: "w4-t2", title: "Complete eCommerce Domain Readiness Quiz", details: "Achieve score >= 80% on the interactive knowledge portal quiz." },
      { id: "w4-t3", title: "Pick Up & Complete First Sprint Ticket", details: "Implement bug fix or feature enhancement, submit PR with test coverage report." }
    ]
  }
];
