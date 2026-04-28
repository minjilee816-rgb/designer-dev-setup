# Mac setup for Intuit plugin development (designers)

This is the **plain-language** companion to **steps-reference.md**. Use that file for exact Terminal commands.

---

## You need

- A **Mac** (macOS)
- Your **Intuit email** and **full name** (for Git)
- **CyberArk temporary administrator** access for part of the setup
- **VPN** when installers or downloads fail
- About **30 minutes** the first time

---

## Before anything else

**Step 0 — CyberArk:** Open **CyberArk**, request **temporary admin**, and wait until it is **active**. Several steps will ask for your Mac password or change protected files; this avoids getting stuck halfway.

---

## What you are installing (in order)

| Step | What | Why |
|:----:|------|-----|
| 1 | **Xcode Command Line Tools** | Apple’s basic developer tools |
| 2 | **Homebrew** | Installs other tools on your Mac |
| 3 | **Yarn** | How most Intuit JS projects install dependencies |
| 4 | **NVM** | Manages Node.js versions |
| 5 | **Node 18** | Required for current plugin tooling |
| 6 | **Intuit npm registry** | Download **internal** npm packages |
| 7 | **Git + your identity** | Version control; commits show **your** name and email |
| 8 | **SSH key for GitHub** | Access **github.intuit.com** securely |
| 9 | **Hosts file** | Local dev URLs resolve on your laptop (**needs admin**) |
| 10 | **Google Chrome** | Local testing |
| 11 | **AppFabric Webtools Manager** | Intuit tool installer |
| 12 | **Plugin CLI** (v4.x) | **Build, test, and run** web plugins locally |
| 13 | **Final verification** | Confirms everything |

**Hosts file lines** (for IT or Step 9):

```text
127.0.0.1       localhost.intuit.com
127.0.0.1       plugin-localhost.intuitcdn.net
```

**GitHub SSH:** Add your **public** key at **github.intuit.com** → **Settings** → **SSH and GPG keys** → **New SSH key**.

---

## Check how you are doing (optional)

From this package folder in Terminal:

```bash
bash scripts/verify-all.sh
```

Green checkmarks mean that item looks good; red means follow **steps-reference.md** for that step.

---

## If something breaks

Open **troubleshooting.md** in this folder—start with the **Quick Index** table.

Common themes: turn on **VPN**, activate **CyberArk admin**, wrong **Node** version (`nvm use lts/hydrogen`), or SSH key not added in GitHub.

---

## Want the AI to walk you through it?

If you use **Cursor**, see **README.md** → *Install as a Cursor skill*. Then ask: *Help me set up my Mac for Intuit plugin development.*
