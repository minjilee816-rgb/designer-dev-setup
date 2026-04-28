---
name: designer-dev-setup
author: "@srinivasan"
description: Guide designers through setting up their Mac development environment for Intuit plugin development. Installs Xcode CLI tools, Homebrew, Yarn, NVM, Node 18, npm registry, Git, GitHub SSH, hosts file, Chrome, AppFabric Webtools Manager, and Plugin CLI (@appfabric/plugin-cli). Trigger keywords: designer dev setup, Mac dev environment, plugin development, install dev tools, machine setup, laptop setup, environment setup, plugin-cli, AppFabric webtools, designer onboarding.
---

# Development Dependencies Setup

Guided, step-by-step Mac setup for Intuit plugin development. Designed for designers who are not proficient with code.

## Prerequisites

**CyberArk temporary admin (request before you start):** Ask the user to open **CyberArk** and request **temporary administrator access** if they do not already have active admin rights on their Mac. Several steps require elevated privileges (for example Homebrew install, editing `/etc/hosts`, and fixing permissions for AppFabric Webtools / Plugin CLI under `/usr/local/bin`). It is much smoother to **get CyberArk temp admin approved first**, then run the setup—rather than stopping mid-way when a `sudo` or installer prompt fails.

Tell the user in plain language: *Request temporary admin in CyberArk now and wait until it is active before we install anything that asks for a password. Say when you are ready to continue.*

## When to Use

Use this skill when:
- You are starting setup and need the user to **request CyberArk temporary admin first** so `sudo`-heavy steps do not stall
- A designer or teammate needs their Mac ready for Intuit AppFabric web plugin development
- Someone asks to set up their dev environment, install Homebrew, Node 18, NVM, Yarn, or plugin-cli
- Onboarding or IT asks for github.intuit.com SSH, Intuit npm registry, or hosts file entries for local plugin URLs
- The user says their machine is missing tools to run `yarn build` / `plugin-cli` in a plugin repo

## How This Skill Works

This skill starts with a **CyberArk admin prerequisite**, then walks through **13 setup steps** sequentially. For each step, you:

1. **Explain** what you're about to install and why (one sentence, plain language)
2. **Check** if it's already installed by running the verify command first
3. **Skip** if verify passes — tell the user it's already done
4. **Install** only if verify fails
5. **Re-verify** after install to confirm success
6. **Troubleshoot** if verification still fails (see step-specific guidance)
7. **Move on** only after verification passes

Read [steps-reference.md](steps-reference.md) for the full step details. Read [troubleshooting.md](troubleshooting.md) if any step fails.

## Before Starting

Run the quick-check script first to see what's already installed.

**If this skill is installed from the designer-dev-setup-package** (same folder as `steps-reference.md`), run from that folder:

```bash
bash scripts/verify-all.sh
```

**If the skill lives under** `~/.cursor/skills/designer-dev-setup/` **or** `~/.claude/skills/designer-dev-setup/`:

```bash
bash ~/.cursor/skills/designer-dev-setup/scripts/verify-all.sh
```

If everything passes, tell the user they're already set up. Otherwise, tell the user:

> I'll walk you through setting up your laptop for plugin development. I checked what you already have — I'll skip what's done and only install what's missing. If you have not already, please **request temporary admin in CyberArk** now (see Prerequisites above)—we will need it for some installs.

Check prerequisites:
- Confirm they are on macOS: `uname -s` should print `Darwin`
- Determine chip type: `uname -m` — if `arm64`, this is Apple Silicon (relevant for Homebrew PATH)

## Step Execution Flow

Read the full step details from [steps-reference.md](steps-reference.md), then execute each step in order. **Always run verify first — skip the install if it already passes.**

0. **CyberArk temporary admin** — confirm the user has requested and received temp admin before installs that need `sudo` (see [steps-reference.md](steps-reference.md) Step 0)
1. **Xcode Command Line Tools** — needs user to click "Install" on a pop-up
2. **Homebrew** — may need admin password; Apple Silicon needs PATH setup
3. **Yarn** — via brew
4. **NVM** — shell function (not a binary); may need `~/.zshrc` config fix
5. **Node 18 (lts/hydrogen)** — via nvm; must `source ~/.zshrc` first in new shells
6. **Intuit npm registry** — npm config
7. **Git + identity** — ask user for their Intuit email and full name
8. **GitHub SSH key** — supports rsa, ed25519, or custom-named keys; user must add to github.intuit.com
9. **Hosts file** — needs sudo (CyberArk admin)
10. **Chrome** — check if installed, guide to download if not
11. **AppFabric Webtools Manager** — npx install
12. **Plugin CLI** — `@appfabric/plugin-cli` 4.x via webtools manager (build/test/serve plugins)
13. **Final verification** — `npx -p @appfabric/scripts verify-dev-setup`

## Plugin CLI installation (Step 12)

This is the command-line tool that runs **build, test, lint, and dev server** for AppFabric web plugins (`yarn build`, `yarn start`, etc.). It is **not** installed with Homebrew or plain `npm install -g` — it goes through **AppFabric Webtools Manager** after Step 11.

**Verify** (skip install if this prints a version):

```bash
plugin-cli --version
```

**Install** (only if verify fails; `appf-webtools-mgr` must work first — complete Step 11):

```bash
appf-webtools-mgr install @appfabric/plugin-cli 4.x --set-global --force
```

If the plugin repo pins a different range, read `package.json` → `webtoolsManager.tools["@appfabric/plugin-cli"]` and use that tag instead of `4.x`.

**After install**: If the shell still says `command not found: plugin-cli`, open a **new terminal tab** so PATH picks up `~/.appfabric-bin` (or follow [troubleshooting.md](troubleshooting.md) → Plugin CLI not found).

Full narrative for this step is in [steps-reference.md](steps-reference.md) (Step 12).

## Important Interaction Notes

- **NVM (step 4)** is a shell function, not a binary. You cannot call `nvm` from a script without first sourcing it: `export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"`. Use `command -v nvm` to check if it's loaded, not `which nvm`.
- **Step 7 (Git identity)**: You MUST ask the user for their Intuit email and full name. Never use placeholder values.
- **Step 8 (SSH key)**: Check for existing keys first (`ls ~/.ssh/*.pub`). If any exist, skip generation and use the existing key. Support `id_rsa`, `id_ed25519`, `id_ecdsa`, or custom-named keys like `github-intuit`. After copying key to clipboard, pause and tell the user to add it to github.intuit.com. Wait for confirmation before verifying.
- **Step 9 (Hosts file)**: If `sudo` fails, tell the user they need CyberArk temp admin.
- **Step 10 (Chrome)**: Just check if `/Applications/Google Chrome.app` exists. If not, tell the user to download it from google.com/chrome.
- **Step 12 (Plugin CLI)**: Requires **step 11** first (`appf-webtools-mgr` must be installed). Use `appf-webtools-mgr install @appfabric/plugin-cli 4.x --set-global --force` (or the semver range from the project's `package.json` → `webtoolsManager.tools` if the team pins something other than `4.x`).

## After Completion

When step 13 passes, tell the user:

> Your dev environment is fully set up! Here's what's installed:
> - Xcode CLI tools, Homebrew, Yarn, Git
> - Node 18 via NVM
> - npm pointed at Intuit's registry
> - GitHub SSH access configured
> - AppFabric Webtools Manager
> - Plugin CLI (`plugin-cli`) for building and running web plugins
>
> You're ready to start building plugins. If anything breaks later, just ask me to re-run the setup check.

If step 13 fails, read [troubleshooting.md](troubleshooting.md) and address the specific failures before re-running verification.

**Example prompts:**
- Help me set up my Mac for Intuit plugin development
- Walk me through designer dev setup — I am on a new laptop
- Install plugin-cli and everything needed to build web plugins locally
- Run the dev setup check and fix what is missing

## Rules

- Always verify before installing — skip steps that already pass
- Always verify after installing — don't move on until it passes
- Use plain, non-technical language when talking to the user
- If a step fails, explain what went wrong in simple terms and what action is needed
- Never store or log the user's email, name, or SSH keys beyond the commands that need them
- If the user says "I already have X installed", run the verify command to confirm before skipping
- NVM is a shell function — always source it before calling `nvm` commands
- SSH keys can be any type — don't assume `id_rsa`
