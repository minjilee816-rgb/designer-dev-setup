# Setup Steps Reference

Detailed instructions for **Step 0** (CyberArk prerequisite) and each of the **13** numbered install steps.

**For every step**: run the verify command first. If it passes, skip the install and move on.

---

## Step 0: CyberArk temporary admin (prerequisite)

**Why**: Homebrew, the hosts file, and some AppFabric installs use `sudo` or need permission fixes that fail without administrator rights.

**Before any install steps**, tell the user:

1. Open **CyberArk** (Spotlight search).
2. Request **temporary administrator access** for their Mac.
3. Wait until access is **active/approved**.
4. Continue with Step 1.

If the user already has admin or temp admin is active, skip this block.

---

## Step 1: Xcode Command Line Tools

**Why**: macOS needs these for Git, compilers, and build tools.

**Verify first**:
```bash
xcode-select --print-path
```
If it prints a path like `/Library/Developer/CommandLineTools`, skip to step 2.

**Install**:
```bash
xcode-select --install
```
A pop-up installer appears. Tell the user to click "Install" and wait for it to finish.

**If it fails**: The installer may still be running. Wait for the pop-up to complete, then re-run verify.

---

## Step 2: Homebrew

**Why**: Package manager for installing developer tools on Mac.

**Verify first**:
```bash
brew --version
```
If it prints a version, skip to step 3.

**Install**:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
May prompt for admin password.

**Apple Silicon fix**: If `brew` is not found after install, check chip with `uname -m`. If `arm64`:
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**If it fails**: Permission errors mean CyberArk temp admin is needed.

---

## Step 3: Yarn

**Why**: Package manager used by most Intuit projects for JavaScript dependencies.

**Verify first**:
```bash
yarn --version
```
If it prints a version, skip to step 4.

**Install**:
```bash
brew install yarn
```

**If it fails**: If `brew` not found, go back to step 2.

---

## Step 4: NVM (Node Version Manager)

**Why**: Lets you install and switch Node.js versions. Plugin-CLI v4 needs Node 18.

**IMPORTANT**: NVM is a shell function, not a binary. Always source it before checking:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

**Verify first**:
```bash
command -v nvm > /dev/null 2>&1 && nvm --version
```
If it prints a version, skip to step 5.

**Install**:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

**After install**, reload the shell:
```bash
source ~/.zshrc
```

**If it fails** ("command not found: nvm"): The NVM lines are missing from `~/.zshrc`. Check and add:
```bash
grep -c 'NVM_DIR' ~/.zshrc
```
If count is 0:
```bash
touch ~/.zshrc
cat >> ~/.zshrc << 'NVMEOF'
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
NVMEOF
source ~/.zshrc
```

---

## Step 5: Node 18

**Why**: Plugin-CLI v4 requires Node 18 specifically.

**Verify first** (source NVM first if needed):
```bash
node -v
```
If it prints `v18.x.x`, skip to step 6.

**Install**:
```bash
nvm install lts/hydrogen
```

**Verify**:
```bash
node -v
npm -v
```

**If it fails**: If `nvm` not found, fix step 4 first. If download fails, check VPN.

---

## Step 6: Intuit npm Registry

**Why**: Points npm to Intuit's private package registry for internal packages.

**Verify first**:
```bash
grep -q "registry.npmjs.intuit.com" ~/.npmrc 2>/dev/null && echo "configured"
```
If it prints "configured", skip to step 7.

**Install**:
```bash
npm config set registry https://registry.npmjs.intuit.com/
```

**If it fails**: If `npm` not found, go back to step 5.

---

## Step 7: Git + Identity

**Why**: Git is version control. Identity is needed so commits show your name.

**Verify first**:
```bash
git --version
git config --global user.email
git config --global user.name
```
If Git version prints and email/name are set, skip to step 8.

**IMPORTANT**: Ask the user for their Intuit email and full name before configuring. Never use placeholders.

**Install Git**:
```bash
brew install git
```

**Configure** (use the user's actual values):
```bash
git config --global user.email "THEIR_EMAIL@intuit.com"
git config --global user.name "THEIR FULL NAME"
```

**If it fails**: If brew fails, check step 2.

---

## Step 8: GitHub SSH Key

**Why**: SSH key lets GitHub trust this laptop for private repo access without passwords.

**Check for existing keys first**:
```bash
ls ~/.ssh/*.pub 2>/dev/null
```

If any public key exists (e.g., `id_rsa.pub`, `id_ed25519.pub`, `github-intuit.pub`), **skip generation** and test the connection:
```bash
ssh -o StrictHostKeyChecking=accept-new -T git@github.intuit.com
```
If auth succeeds, skip to step 9.

**Generate new key** (only if no key exists or SSH test fails):
```bash
ssh-keygen -t ed25519 -N "" -f ~/.ssh/id_ed25519
```
Note: `ed25519` is preferred over `rsa` for new keys. If the user's system doesn't support it, fall back to:
```bash
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
```

**Set permissions and copy**:
```bash
chmod 600 ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub | pbcopy
```

**Tell the user**:
> Your SSH key has been copied to your clipboard. Now:
> 1. Open **github.intuit.com** in your browser
> 2. Click your profile picture (top right) then **Settings**
> 3. Click **SSH and GPG keys** in the left sidebar
> 4. Click **New SSH Key**
> 5. Give it a title like "My Mac"
> 6. Paste the key (Cmd+V) into the Key field
> 7. Click **Add SSH Key**
> 8. Tell me when you're done

**Wait for user confirmation before continuing.**

**Verify**:
```bash
ssh -o StrictHostKeyChecking=accept-new -T git@github.intuit.com
```

**If it fails** ("Permission denied (publickey)"): Re-copy the key (`cat ~/.ssh/id_ed25519.pub | pbcopy`) and have the user re-add it. If using a non-default key name, may need SSH config:
```bash
cat >> ~/.ssh/config << 'SSHEOF'
Host github.intuit.com
  IdentityFile ~/.ssh/id_ed25519
SSHEOF
```

---

## Step 9: Hosts File Entries

**Why**: Local development URLs need these entries to resolve on your laptop.

**Verify first**:
```bash
grep -q "localhost.intuit.com" /etc/hosts && grep -q "plugin-localhost.intuitcdn.net" /etc/hosts && echo "configured"
```
If it prints "configured", skip to step 10.

**Add entries**:
```bash
echo '127.0.0.1       localhost.intuit.com' | sudo tee -a /etc/hosts
echo '127.0.0.1       plugin-localhost.intuitcdn.net' | sudo tee -a /etc/hosts
```
May prompt for password.

**Verify**:
```bash
grep -n "localhost.intuit.com\|plugin-localhost.intuitcdn.net" /etc/hosts
```

**If it fails**: `sudo` failures mean CyberArk temp admin is needed.

---

## Step 10: Chrome

**Why**: Chrome is used for testing and previewing plugins locally.

**Verify first**:
```bash
test -d "/Applications/Google Chrome.app" && echo "installed"
```
If it prints "installed", skip to step 11.

**If not installed**, tell the user:
> Please download and install Google Chrome from **google.com/chrome**. Open it once after installing, then let me know when you're done.

Wait for confirmation before continuing.

---

## Step 11: AppFabric Webtools Manager

**Why**: Intuit's internal tool manager for web development.

**Verify first**:
```bash
appf-webtools-mgr version
```
If it prints a version, skip to step 12.

**Install**:
```bash
npx @appfabric/webtools-mgr install @appfabric/webtools-mgr --set-global --force
```

**If it fails** (EACCES on `/usr/local/bin`): Fix permissions (needs admin), then retry:
```bash
sudo mkdir -p /usr/local/bin
sudo chown -R "$(whoami)":admin /usr/local/bin
npx @appfabric/webtools-mgr install @appfabric/webtools-mgr --set-global --force
```

---

## Step 12: Plugin CLI (@appfabric/plugin-cli)

**Why**: Plugin CLI is the tool that **builds, tests, lints, and serves** AppFabric web plugins (for example `yarn build`, `yarn start`, `yarn test:jest`). Designers need it on their machine so repo scripts that call `plugin-cli` work.

**Prerequisite**: Step 11 must succeed — `appf-webtools-mgr` must be installed and working.

**Verify first**:
```bash
plugin-cli --version
```
If it prints a version line (for example `@appfabric/plugin-cli/4.x.x`), skip to step 13.

**Install**:
```bash
appf-webtools-mgr install @appfabric/plugin-cli 4.x --set-global --force
```

This installs the latest **v4** release that satisfies `4.x`, links the `plugin-cli` command (often under `~/.appfabric-bin`), and matches typical `package.json` **`webtoolsManager.tools["@appfabric/plugin-cli"]: "4.x"`** in plugin repos. If your project uses a different range, use that tag instead.

**If it fails**:
- **Network or registry errors**: Connect to **VPN**, confirm Intuit npm registry (step 6), retry.
- **EACCES** or permission errors: Use the same **`/usr/local/bin`** permission fix as step 11, then retry the install command.
- **`appf-webtools-mgr: command not found`**: Complete step 11 first.

**After install**: Open a **new terminal tab** if `plugin-cli` is still not found, so your **PATH** picks up the webtools shim.

---

## Step 13: Final Verification

**Why**: Checks everything at once.

**Run**:
```bash
npx -p @appfabric/scripts verify-dev-setup
```

**Expected**: A summary table and a **SUCCESS** banner.

**Also run the skill's own check**:

From the **designer-dev-setup-package** folder (unzipped or cloned):

```bash
bash scripts/verify-all.sh
```

If you copied the skill to `~/.cursor/skills/designer-dev-setup/` (or `~/.claude/skills/designer-dev-setup/`):

```bash
bash ~/.cursor/skills/designer-dev-setup/scripts/verify-all.sh
```

**If it fails**: Read [troubleshooting.md](troubleshooting.md) for specific fixes. Common issues:
- **Node version**: `nvm use lts/hydrogen`
- **npm registry**: re-run step 6
- **Network**: check VPN
- **Permissions**: activate CyberArk temp admin
