# Troubleshooting Guide

Quick fixes for common problems during setup.

---

## Quick Index

| Symptom | Fix |
|---------|-----|
| "Execution blocked" / permission denied | Activate CyberArk temp admin, retry |
| `command not found: nvm` | Source NVM or add lines to `~/.zshrc` (see below) |
| `command not found: brew` | Apple Silicon PATH fix (see below) |
| `Permission denied (publickey)` | Re-copy SSH key, re-add to github.intuit.com |
| `yarn install` fails later | Check `cat ~/.npmrc` and `node -v` |
| `EACCES` on `/usr/local/bin` | `sudo chown` fix (see below) |
| Node version wrong | `nvm use lts/hydrogen` |
| npm registry wrong | `npm config set registry https://registry.npmjs.intuit.com/` |
| Network/download errors | Connect to VPN and retry |
| `command not found: plugin-cli` | Complete step 11, then run step 12 install; open a new terminal |

---

## CyberArk Temp Admin

Several steps require admin privileges. If you see "permission denied" or `sudo` fails:

1. Open **CyberArk** (search in Spotlight)
2. Request **temporary admin access** (usually 30 minutes)
3. Wait for approval
4. Retry the failed command

Commonly needed for: Homebrew (step 2), hosts file (step 9), AppFabric permissions (step 11), Plugin CLI install (step 12).

---

## Homebrew Not Found After Install

On Apple Silicon Macs (M1/M2/M3/M4), Homebrew installs to `/opt/homebrew/` and needs PATH setup:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
brew --version
```

---

## NVM Not Found

NVM is a **shell function**, not a binary. `which nvm` will always fail — use `command -v nvm` instead.

First, try sourcing it:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm --version
```

If that still fails, the `~/.zshrc` config is missing. Check and add:
```bash
grep -c 'NVM_DIR' ~/.zshrc
```

If count is 0:
```bash
cat >> ~/.zshrc << 'NVMEOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NVMEOF
source ~/.zshrc
nvm --version
```

---

## SSH Key Issues

### "Permission denied (publickey)"

Check which keys exist:
```bash
ls ~/.ssh/*.pub
```

Re-copy whichever key you have:
```bash
cat ~/.ssh/id_ed25519.pub | pbcopy
# or: cat ~/.ssh/id_rsa.pub | pbcopy
# or: cat ~/.ssh/github-intuit.pub | pbcopy
```

Go to github.intuit.com → Settings → SSH keys → delete old key → add new → paste.

Test:
```bash
ssh -T git@github.intuit.com
```

### Key exists but SSH still fails

If the key isn't named `id_rsa` or `id_ed25519`, SSH may not find it automatically. Add an SSH config entry:
```bash
cat >> ~/.ssh/config << 'SSHEOF'
Host github.intuit.com
  IdentityFile ~/.ssh/YOUR_KEY_NAME
SSHEOF
```
Replace `YOUR_KEY_NAME` with the actual private key filename (without `.pub`).

### ssh-keygen says file already exists

Either skip generation and use the existing key, or overwrite:
```bash
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519
# type 'y' to overwrite
```

---

## AppFabric EACCES Fix

If `npx @appfabric/webtools-mgr install` fails with EACCES on `/usr/local/bin`:

```bash
sudo mkdir -p /usr/local/bin
sudo chown -R "$(whoami)":admin /usr/local/bin
npx @appfabric/webtools-mgr install @appfabric/webtools-mgr --set-global --force
```

---

## Plugin CLI Not Found

If step 12 reported success but a new terminal still says `command not found: plugin-cli`:

1. Confirm webtools manager works: `appf-webtools-mgr version`
2. Re-run install: `appf-webtools-mgr install @appfabric/plugin-cli 4.x --set-global --force`
3. Check that `plugin-cli` exists: `ls -la ~/.appfabric-bin/plugin-cli` (typical location on macOS)
4. Ensure your shell **PATH** includes the directory that contains `plugin-cli` (Webtools usually adds `~/.appfabric-bin`; restart the terminal or `source ~/.zshrc`)

---

## Final Verification Failures

| Check | Fix |
|-------|-----|
| Node version wrong | `nvm use lts/hydrogen` then `node -v` |
| npm registry wrong | `npm config set registry https://registry.npmjs.intuit.com/` |
| Git not configured | Re-run step 7 with correct email/name |
| SSH not working | Re-run step 8, ensure key is on github.intuit.com |
| Network errors | Connect to VPN and retry |
| Plugin CLI missing | Step 12: `appf-webtools-mgr install @appfabric/plugin-cli 4.x --set-global --force` |
