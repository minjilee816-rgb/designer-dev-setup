# Designer dev setup package

Self-contained kit for onboarding **Mac** designers to **Intuit AppFabric web plugin** development (Node 18, Intuit npm, Git/SSH, hosts entries, AppFabric Webtools Manager, Plugin CLI).

**Package version:** 1.0.0 (bundled with innersource-skills repo; bump this line when you refresh contents.)

---

## What is included

| File / folder | Purpose |
|---------------|---------|
| **DESIGNER-GUIDE.md** | Plain-language checklist—share this first. |
| **steps-reference.md** | Step-by-step install and verify commands (authoritative). |
| **troubleshooting.md** | Common failures and fixes. |
| **scripts/verify-all.sh** | Quick pass/fail check of the machine (no AI required). |
| **SKILL.md** | Instructions for **Cursor / Claude Code** when this folder is installed as a skill. |
| **SHARING.md** | How to zip, distribute, and onboard teammates. |

---

## For designers: quick start

1. Read **DESIGNER-GUIDE.md** (overview and order of operations).
2. Request **CyberArk temporary admin** before installs that need a password (see Step 0 in **steps-reference.md**).
3. Follow **steps-reference.md** with Terminal, **or** use **Cursor** with the skill (below).
4. Check progress anytime (from **this** folder):

   ```bash
   bash scripts/verify-all.sh
   ```

5. Finish with Intuit’s verifier:

   ```bash
   npx -p @appfabric/scripts verify-dev-setup
   ```

---

## Install as a Cursor skill (optional)

1. Copy this entire folder to:

   ```
   ~/.cursor/skills/designer-dev-setup
   ```

   Create the parent directory if needed: `mkdir -p ~/.cursor/skills`

2. Open **Cursor** and ask in chat, for example: *Help me set up my Mac for Intuit plugin development.*

The agent should follow **SKILL.md**, which points at **steps-reference.md** and **troubleshooting.md** in the same directory.

---

## Install as a Claude Code project skill (optional)

If your team repo already contains this package (or you copy it in), place the same files under:

```
.claude/skills/designer-dev-setup/
```

matching the layout here (`SKILL.md`, `steps-reference.md`, `troubleshooting.md`, `scripts/verify-all.sh`).

---

## Distributing to designers

See **SHARING.md** for zip commands, Slack blurb, and keeping the package updated.

---

## Source

Maintained in **innersource-skills** at `designer-dev-setup-package/`. Sync updates from `.claude/skills/designer-dev-setup/` when the canonical skill changes, then bump the package version line above.
