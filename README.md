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

### Study Overview

**Objective.** Evaluate the usability of the Unified Linked Accounts interface by observing whether users can successfully perform four core tasks: identifying and fixing a broken connection, adding a new connection, unlinking or deleting an existing connection, and reviewing their past consent history.

**Research questions.**
- Can users recognize a broken connection state and independently resolve it through the UI?
- Is the "Link Account" entry point discoverable enough for users to add a new connection without guidance?
- Can users confidently unlink or delete a connection, and do they understand the consequences before confirming?
- Are users able to locate and interpret their past consent and connection history?

**Methodology.** Moderated, task-based usability testing. One-on-one sessions (remote or in-person) using a think-aloud protocol. The facilitator provides a scenario and task prompt, then observes without guiding unless the participant is completely stuck.

### Participant 1 — Amy Rose
- **Role:** Director of Operations, Sales, & Marketing
- **Company:** [Rigdon Inc.](https://www.rigdoninc.com) — Facilities Services
- **Company size:** $5M–$9.99M revenue
- **Confidence score:** 4 / 5

#### Task Results at a Glance

| Task | Result | Observation |
|------|--------|-------------|
| **Fix Connection** | ✅ Passed | Identified the broken connection and resolved it independently |
| **Add Connection** | ✅ Passed | Found "Link Account" immediately — called it "surprisingly easy" |
| **Unlink / Delete** | ⚠️ Friction | Interpreted "Disable" as permanently deleting the account, not pausing it. Suggested a toggle would be more intuitive |
| **Past Consents** | ✅ Passed | Navigated to the past consent view without guidance and located her deleted connection |

#### Key Findings

**What worked well**
- Overall interface described as *"super clean and easy to navigate"* — strong first impression
- **Link Account** was the smoothest flow of the session
- **Past Consents** was discoverable — validates the information architecture for that flow

**What needs iteration**
- *"Disable" language is misleading* (High) — read as permanent deletion. A toggle with language like "Turn off" or "Pause connection" would better signal a reversible action.
- *No force-sync option after reconnecting* (High) — wanted a way to manually refresh account data after a fix. Without it, no confidence that fresh data was actually pulled.

#### Recommendations & Status

| Finding | Priority | Recommendation | Status |
|---------|----------|----------------|--------|
| "Disable" language misread as permanent deletion | 🔴 High | Replace with toggle + clearer language (e.g., "Pause connection" vs. "Unlink" vs. "Delete") | ✅ Shipped — renamed to **Pause / Resume** |
| No force-sync option after reconnecting | 🔴 High | Add per-connection "Sync now" button with progress indicator | ✅ Shipped — **Refresh icon** on each account refreshes the balance + timestamp, and reauth now updates the timestamp to "Updated just now" |
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
