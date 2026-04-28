# TurboTax Filing Experience — Product Spec

**Author:** Minji Kang  
**Date:** 2026-04-20  
**Status:** Draft  
**Source:** HeyMarvin customer research synthesis (1,051 projects, Follow Me Home 2026 study)

---

## 1. Problem Statement

TurboTax customers — especially those with moderately complex returns (self-employed, multiple income sources, first-time business filers) — experience significant friction, anxiety, and loss of trust during the filing process.

The core problems cluster into three areas:

**Pricing & Trust:** Customers feel misled. They enter the product at an advertised price, only to discover at checkout that their situation requires an upgrade. This "bait and switch" pattern damages trust at the exact moment customers are most financially vulnerable.

**Complexity & Jargon:** Tax terminology is used without plain-language explanation. Even customers with accounting backgrounds report feeling overwhelmed by business deduction lists and unclear category distinctions (e.g., "self-employed" vs. "I own a business"). Customers don't know what they don't know — and fear making costly mistakes as a result.

**Navigation & Confidence:** The multi-step filing flow lacks clear progress signaling. Customers can't easily go back, compare sections, or understand where they are in the process. This drives anxiety ("Did I miss something?") and causes abandonment for complex filers.

> *"I felt like I was being tricked. The price I saw at the beginning had nothing to do with what I paid at the end."* — Follow Me Home 2026 participant  
> *"I have an accounting background and I still felt lost with the business deductions."* — Follow Me Home 2026 participant

---

## 2. Target User

### Primary: Moderately Complex Filer
- **Who:** W-2 employee with side income, freelancer, or first-year self-employed person
- **Age:** 28–45
- **Files taxes:** Annually, with growing complexity year over year
- **Relationship with TurboTax:** Returning customer, but loyalty is fragile — actively comparing to free alternatives
- **Key need:** Confidence that they're filing correctly without needing to be a tax expert
- **Key fear:** Making a mistake, missing a deduction, or being audited

### Secondary: First-Time Business Filer
- **Who:** Someone who started a side business or became fully self-employed in the past year
- **Key gap:** Doesn't know personal and business taxes must be filed together
- **Key need:** Clear upfront guidance on what product they need and why

### Out of scope (this spec):
- Simple W-2-only filers (already well-served)
- Corporate / multi-entity business filers (too complex for this scope)

---

## 3. Proposed Solution

A **Guided Confidence Layer** that wraps the existing filing flow with three targeted improvements:

### 3a. Transparent Pricing Gate
Show the user their estimated final price — broken down by situation — before they begin entering data. Update it in real time as their return complexity changes. No surprises at checkout.

### 3b. Plain-Language Jargon Tooltips + Contextual Help
Replace or augment every tax term with a plain-language explanation inline. For deduction categories, add a one-sentence "This means..." explanation and a "Does this apply to me?" prompt that asks 2–3 yes/no questions to help the user self-qualify.

### 3c. Persistent Progress & Navigation Rail
Add a visible, always-accessible sidebar showing:
- Sections completed vs. remaining
- Estimated time to finish
- A "Review what I've entered" jump link for each completed section
- A "Save and come back" state that persists without data loss

This directly addresses the navigation confusion and fear-of-mistakes themes from research.

---

## 4. Key User Stories

**US-1 — Transparent pricing**  
*As a returning TurboTax customer, I want to see my estimated total price before I start entering data, so that I can decide whether to continue without feeling misled at checkout.*

Scenario: User lands on product selection. They answer 4–5 situation questions (W-2, freelance income, rental income, etc.). The UI shows: "Based on your situation, you'll likely need TurboTax Self-Employed — $X. Here's what's included." Price updates dynamically as they proceed.

---

**US-2 — Plain-language deduction guidance**  
*As a first-time self-employed filer, I want every tax term explained in plain language with a "does this apply to me?" check, so that I don't skip deductions I'm entitled to or claim ones I shouldn't.*

Scenario: User reaches the "Home Office Deduction" section. Instead of just the IRS label, they see: "Home Office Deduction — Do you work from a dedicated space at home? (This could save you $X on average for people in your situation.)" They tap "Does this apply to me?" and answer 3 yes/no questions. TurboTax recommends whether to claim it.

---

**US-3 — Navigation and progress visibility**  
*As someone filing a complex return, I want to always know where I am in the process and be able to jump back to any completed section, so that I don't fear missing something or losing my work.*

Scenario: At any point in the flow, user can see a sidebar showing 12 sections, 7 completed, 5 remaining. They click "Investment Income" (completed) to review what they entered before finalizing. They make a correction and return to where they were.

---

**US-4 — First-time business filer onboarding**  
*As someone who started a business this year, I want TurboTax to detect my situation early and explain what filing path I need, so that I don't accidentally file an incomplete or incorrect return.*

Scenario: During the initial interview, the user answers "Yes" to "Did you earn income from a business or freelance work?" TurboTax shows: "It looks like this is your first year filing business income. Here's what that means for your return — [2-minute explainer]. You'll file both your personal and business income together in one return."

---

**US-5 — Live price transparency during upsell prompts**  
*As a budget-conscious filer, when I'm prompted to upgrade or add a service, I want to clearly understand what I'm getting and what it costs, so that I can make an informed decision without feeling pressured.*

Scenario: User is prompted to add "Live Expert Review." Instead of a modal with vague benefits, they see: "A TurboTax expert will review your completed return before you file. Cost: $X. Average time: 24 hours. [See what they check →]" with a clear "No thanks" option that doesn't repeat the prompt.

---

## 5. Acceptance Criteria

### Pricing Transparency
- [ ] Price estimate is shown before data entry begins, based on situation questions
- [ ] Price updates in real time as return complexity changes (new income type added, etc.)
- [ ] Final checkout price matches the estimate shown (±$0 for same inputs)
- [ ] Upgrade prompts show exact cost and clear benefit before asking for confirmation
- [ ] "No thanks" on any upsell suppresses that prompt for the remainder of the session

### Plain-Language Help
- [ ] Every tax term with a tooltip shows a plain-language definition (≤2 sentences)
- [ ] Deduction sections include a "Does this apply to me?" flow (≤3 yes/no questions)
- [ ] "Does this apply to me?" recommendation is shown before the user enters data for that section
- [ ] Tooltips and explainers are accessible via keyboard and screen reader (WCAG 2.1 AA)

### Navigation & Progress
- [ ] Progress rail is visible and persistent throughout the filing flow
- [ ] Each completed section is clickable and returns the user to that section without data loss
- [ ] "Estimated time remaining" is shown and updates as sections are completed
- [ ] User can save state at any point and resume without re-entering data
- [ ] Back navigation works correctly from every screen without data loss

### First-Time Business Filer
- [ ] System detects first-year business income during the initial interview
- [ ] Explainer screen shown before entering business income section
- [ ] User cannot proceed past product selection with an incompatible product for their situation

### Performance & Reliability
- [ ] Price estimate loads within 500ms of situation question answers
- [ ] Progress rail renders without layout shift on mobile and desktop
- [ ] No data loss on back navigation, refresh, or session resume

---

## 6. Design System Components Needed

All components should be sourced from **CGDS (TurboTax design system)**. Do not build custom equivalents.

| Component | Usage | CGDS Token / Component |
|-----------|-------|------------------------|
| **Tooltip** | Inline jargon explanations | `cgds-tooltip` |
| **Progress Stepper** | Filing section progress rail | `cgds-stepper` or `cgds-progress-indicator` |
| **Inline Banner** | Price estimate display, situation-based alerts | `cgds-banner` (informational variant) |
| **Modal / Sheet** | "Does this apply to me?" guided flow | `cgds-modal` or `cgds-bottom-sheet` (mobile) |
| **Card** | Upsell offer display with pricing | `cgds-card` (outlined variant) |
| **Button** | Primary CTA, "No thanks" secondary action | `cgds-button` (primary + ghost variants) |
| **Accordion** | Collapsible section summaries in review mode | `cgds-accordion` |
| **Tag / Badge** | "Completed", "In progress", "New" section states | `cgds-badge` |
| **Skeleton Loader** | While price estimate or section data loads | `cgds-skeleton` |
| **Inline Alert** | Validation errors, missing field warnings | `cgds-alert` (warning + error variants) |

**Typography tokens:**  
- Section headers: `cgds-heading-md`  
- Body / explanations: `cgds-body-md`  
- Price figures: `cgds-heading-lg` (bold, high contrast)  
- Helper text / tooltips: `cgds-body-sm` (secondary color token)

**Color tokens:**  
- Price transparency UI: `cgds-color-success` (confirmed price), `cgds-color-warning` (price changed)  
- Upsell prompts: `cgds-color-brand-secondary` (not error red — avoid alarm)  
- Progress completed: `cgds-color-success`

**Accessibility requirements:**  
- All interactive elements meet 4.5:1 contrast ratio  
- "Does this apply to me?" flow is fully keyboard-navigable  
- Progress rail announces state changes to screen readers via `aria-live`

---

## 7. Data Requirements

### Inputs (read)

| Data | Source | Used for |
|------|--------|----------|
| User's prior-year return type | TurboTax account history | Pre-selecting product, detecting complexity change |
| Situation question answers | In-session user input | Real-time price estimate |
| Current product SKU pricing | TurboTax pricing API | Price estimate display |
| Add-on / upsell pricing | TurboTax pricing API | Transparent upsell prompts |
| Section completion state | Filing session state | Progress rail, resume state |
| Deduction eligibility rules | TurboTax rules engine | "Does this apply to me?" recommendations |
| Average savings by deduction type | Aggregated / anonymized TurboTax data | Contextual hints ("People in your situation save $X on average") |
| Expert availability & SLA | TurboTax Live service API | Accurate expert upsell promise ("Review within 24 hours") |

### Outputs (write)

| Data | Destination | Notes |
|------|-------------|-------|
| Upsell prompt suppression flag | Session state | Clears on new session; do not persist across years |
| "Does this apply to me?" answers | Filing session | Used to pre-fill deduction sections; not stored after filing |
| Section completion timestamps | Session state | Used for progress rail and estimated time remaining |
| Price estimate shown at session start | Audit log | For post-filing price dispute resolution |

### Privacy & Compliance Notes
- Price estimate shown is an estimate only — final price governed by existing TurboTax pricing terms
- "Does this apply to me?" answers must not be used for marketing targeting
- All session state data subject to existing TurboTax data retention policy
- Average savings figures must be based on anonymized, aggregated data only — no individual benchmarking
