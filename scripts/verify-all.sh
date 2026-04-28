#!/usr/bin/env bash
# Quick verification of all setup steps. Prints pass/fail for each.
#
# From the designer-dev-setup-package folder (after unzip or clone):
#   bash scripts/verify-all.sh
#
# If the skill was copied to ~/.cursor/skills/designer-dev-setup/:
#   bash ~/.cursor/skills/designer-dev-setup/scripts/verify-all.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass=0
fail=0
warn=0

check() {
  local label="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} $label"
    pass=$((pass + 1))
  else
    echo -e "  ${RED}✗${NC} $label"
    fail=$((fail + 1))
  fi
}

check_warn() {
  local label="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} $label"
    pass=$((pass + 1))
  else
    echo -e "  ${YELLOW}?${NC} $label (optional)"
    warn=$((warn + 1))
  fi
}

echo ""
echo "=== Dev Environment Setup Verification ==="
echo ""

check "Xcode CLI Tools"       xcode-select --print-path
check "Homebrew"               brew --version
check "Yarn"                   yarn --version
check "Node"                   node -v
check "npm"                    npm -v
check "Git"                    git --version

# NVM check — nvm is a shell function, not a binary
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
if command -v nvm > /dev/null 2>&1; then
  echo -e "  ${GREEN}✓${NC} NVM ($(nvm --version))"
  pass=$((pass + 1))
else
  echo -e "  ${RED}✗${NC} NVM"
  fail=$((fail + 1))
fi

# Node version check (should be v18.x)
node_ver="$(node -v 2>/dev/null || echo "")"
if [[ "$node_ver" == v18.* ]]; then
  echo -e "  ${GREEN}✓${NC} Node version is 18 ($node_ver)"
  pass=$((pass + 1))
elif [[ -n "$node_ver" ]]; then
  echo -e "  ${YELLOW}?${NC} Node version is $node_ver (expected v18.x — run: nvm use lts/hydrogen)"
  warn=$((warn + 1))
else
  echo -e "  ${RED}✗${NC} Node version check (node not found)"
  fail=$((fail + 1))
fi

# npm registry
if grep -q "registry.npmjs.intuit.com" ~/.npmrc 2>/dev/null; then
  echo -e "  ${GREEN}✓${NC} Intuit npm registry"
  pass=$((pass + 1))
else
  echo -e "  ${RED}✗${NC} Intuit npm registry"
  fail=$((fail + 1))
fi

# Git identity
git_email="$(git config --global user.email 2>/dev/null || echo "")"
git_name="$(git config --global user.name 2>/dev/null || echo "")"
if [ -n "$git_email" ] && [ -n "$git_name" ]; then
  echo -e "  ${GREEN}✓${NC} Git identity ($git_name <$git_email>)"
  pass=$((pass + 1))
else
  echo -e "  ${RED}✗${NC} Git identity (email or name not set)"
  fail=$((fail + 1))
fi

# SSH key exists (check common key types)
ssh_key_found=false
for keyfile in ~/.ssh/id_rsa.pub ~/.ssh/id_ed25519.pub ~/.ssh/id_ecdsa.pub ~/.ssh/github-intuit.pub; do
  if [ -f "$keyfile" ]; then
    ssh_key_found=true
    echo -e "  ${GREEN}✓${NC} SSH key exists ($keyfile)"
    pass=$((pass + 1))
    break
  fi
done
if ! $ssh_key_found; then
  echo -e "  ${RED}✗${NC} SSH key (no public key found in ~/.ssh/)"
  fail=$((fail + 1))
fi

# Hosts file
hosts_ok=true
if ! grep -q "localhost.intuit.com" /etc/hosts 2>/dev/null; then
  hosts_ok=false
fi
if ! grep -q "plugin-localhost.intuitcdn.net" /etc/hosts 2>/dev/null; then
  hosts_ok=false
fi
if $hosts_ok; then
  echo -e "  ${GREEN}✓${NC} Hosts file entries"
  pass=$((pass + 1))
else
  echo -e "  ${RED}✗${NC} Hosts file entries"
  fail=$((fail + 1))
fi

# Chrome
check_warn "Chrome installed"  test -d "/Applications/Google Chrome.app"

# AppFabric Webtools (required for plugin-cli install)
check "AppFabric Webtools" appf-webtools-mgr version

# Plugin CLI (build/test/serve for web plugins)
check "Plugin CLI" plugin-cli --version

echo ""
echo "=== Results ==="
echo -e "  ${GREEN}Passed${NC}: $pass"
if [ "$fail" -gt 0 ]; then
  echo -e "  ${RED}Failed${NC}: $fail"
fi
if [ "$warn" -gt 0 ]; then
  echo -e "  ${YELLOW}Warnings${NC}: $warn"
fi
echo ""

if [ "$fail" -eq 0 ]; then
  echo -e "  ${GREEN}✓ All required checks passed!${NC}"
  exit 0
else
  echo -e "  ${RED}✗ $fail check(s) failed. Review the steps above.${NC}"
  exit 1
fi
