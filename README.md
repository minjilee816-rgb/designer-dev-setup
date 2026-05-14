# 🔗 Unified Linked Accounts

> One consistent connection management experience across QuickBooks, TurboTax, and Credit Karma.

---

## The Problem

Customers manage linked financial accounts differently across every Intuit product — each with its own design, flow, and interaction patterns. There's no unified way to fix broken connections, add new ones, review consent history, or control account status. This fragmented experience creates confusion and erodes trust.

## Size of the Problem

| Metric | Value |
|--------|-------|
| QuickBooks visitors | 46M (3.4M customers) |
| TurboTax visitors | 95M (30M customers) |
| Impacted stakeholders | 35+ across Intuit |
| 2025 Revenue at stake | $2–3B |
| 1 pt conversion uplift | = $100M in QuickBooks + TurboTax |

## Who We're Solving For

Intuit customers across all three ecosystems:
- **QuickBooks** — Small business owners managing bank connections for bookkeeping, reconciliation, and reporting
- **TurboTax** — Filers linking financial accounts to import tax documents for faster filing
- **Credit Karma** — Users connecting accounts to track spending, credit, and recommendations

---

## 🎯 What Unified Linked Accounts Does

A single, consistent interface for managing linked accounts across all Intuit products. Four core flows:

| Flow | Description |
|------|-------------|
| **Fix Connection** | Identify broken connections via clear error states and follow guided steps to reconnect |
| **Add Connection** | Link a new account through a streamlined "Link Account" flow |
| **Unlink / Delete** | Remove a connection with clear status feedback |
| **Past Consents** | View full history of previously removed or revoked connections |

---

## 🖥️ Live Prototype

**→ [View the Unified Linked Accounts Prototype](https://minjilee816-rgb.github.io/designer-dev-setup/)**

The prototype demonstrates the experience in three surfaces:
- **QuickBooks** (desktop) — full app shell with brand theming
- **TurboTax** (desktop) — full app shell with brand theming
- **Credit Karma** (mobile) — full phone-frame mobile experience

---

## 📋 User Research

A moderated usability session was conducted to validate the four core flows. Key findings:

### What Worked Well
- **Link Account** was the smoothest flow — participant called it "surprisingly easy"
- **Fix Connection** completed without any facilitator intervention
- **Past Consents** view was discoverable and easy to navigate
- Overall design rated as "super clean" and easy to use
- **Confidence score: 4 out of 5**

### What Needs Iteration

| Finding | Priority | Recommendation | Status |
|---------|----------|----------------|--------|
| "Disable" language misread as permanent deletion | 🔴 High | Replace with toggle + clearer language (e.g., "Pause connection") | ✅ Shipped — renamed to Pause / Resume |
| No force-sync option after reconnecting | 🔴 High | Add per-connection "Sync now" button with progress indicator | ✅ Shipped — refresh icon on each account refreshes balance + timestamp |
| Duplicate account names (two "Chase") cause confusion | 🟡 Medium | Allow users to rename or nickname each connection | 🟡 Open |

---

## 📁 Project Documents

| Document | Description |
|----------|-------------|
| [Live Prototype](https://minjilee816-rgb.github.io/designer-dev-setup/) | Interactive experience across QuickBooks, TurboTax, and Credit Karma |
| Interview Guide | Customer user interview plan with task scenarios, scripts, and scoring rubric |
| Interview Summary | Findings from usability session with key observations and recommendations |

---

## 🛠️ Built With

- **React 18** + **TypeScript** — component architecture
- **Vite** — build tooling
- **Intuit Design System (IDS)** — `@ids-ts/*` components, `@design-systems/theme`, `@design-systems/icons`
- **CSS Modules** — scoped styling per component
- **GitHub Pages** — static deployment via GitHub Actions
- **Figma** — design and prototyping source of truth

---

## 🚀 Running Locally

```bash
git clone https://github.com/minjilee816-rgb/designer-dev-setup.git
cd designer-dev-setup/connection-hub
npm install
npm run dev
```

Requires **Node.js 20+** (Vite 8 requirement).

No environment variables or API keys required.

---

## 👤 Author

**Minji Kang** — Designer, Intuit
