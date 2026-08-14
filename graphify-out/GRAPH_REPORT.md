# Graph Report - .  (2026-08-14)

## Corpus Check
- Corpus is ~18,811 words - fits in a single context window. You may not need a graph.

## Summary
- 89 nodes · 123 edges · 17 communities (13 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Core App Components & Demos
- Vite & Oxlint Build Dependencies
- Package Manifest & Scripts
- Interactive Search & Test Matrix
- React UI Icon Dependencies
- Oxlint Linter Rules Config
- Interactive Knowledge Quiz
- Interactive Onboarding Roadmap
- Operational Playbooks & Guide
- Documentation & Setup Guide

## God Nodes (most connected - your core abstractions)
1. `react` - 16 edges
2. `scripts` - 5 edges
3. `DOMAIN_MODULES` - 4 edges
4. `plugins` - 3 edges
5. `rules` - 3 edges
6. `ECOMM_GLOSSARY` - 3 edges
7. `OPERATIONAL_PLAYBOOKS` - 3 edges
8. `QA_TEST_SCENARIOS` - 3 edges
9. `react/only-export-components` - 2 edges
10. `lucide-react` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 4 thin omitted)

### Community 0 - "Core App Components & Demos"
Cohesion: 0.17
Nodes (12): plugins, oxc, react, App(), ConcurrencySim(), DomainModule(), FounderSpotlight(), Navbar() (+4 more)

### Community 1 - "Vite & Oxlint Build Dependencies"
Cohesion: 0.18
Nodes (11): oxlint, devDependencies, oxlint, @types/react, @types/react-dom, vite, @vitejs/plugin-react, @types/react (+3 more)

### Community 2 - "Package Manifest & Scripts"
Cohesion: 0.20
Nodes (9): name, private, scripts, build, dev, lint, preview, type (+1 more)

### Community 3 - "Interactive Search & Test Matrix"
Cohesion: 0.29
Nodes (5): GlossaryView(), QATestMatrix(), SearchModal(), ECOMM_GLOSSARY, QA_TEST_SCENARIOS

### Community 4 - "React UI Icon Dependencies"
Cohesion: 0.29
Nodes (7): lucide-react, dependencies, lucide-react, react, react-dom, react, react-dom

### Community 5 - "Oxlint Linter Rules Config"
Cohesion: 0.33
Nodes (5): rules, react/only-export-components, react/rules-of-hooks, $schema, warn

## Knowledge Gaps
- **22 isolated node(s):** `$schema`, `oxc`, `react/rules-of-hooks`, `warn`, `name` (+17 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Core App Components & Demos` to `Operational Playbooks & Guide`, `Interactive Search & Test Matrix`, `Interactive Knowledge Quiz`, `Interactive Onboarding Roadmap`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `plugins` connect `Core App Components & Demos` to `Oxlint Linter Rules Config`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Vite & Oxlint Build Dependencies` to `Package Manifest & Scripts`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **What connects `$schema`, `oxc`, `react/rules-of-hooks` to the rest of the system?**
  _22 weakly-connected nodes found - possible documentation gaps or missing edges._