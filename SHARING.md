# Sharing the designer dev setup package

Use this when you send **designer-dev-setup-package** to teammates (Slack, email, shared drive, git).

---

## What to send

Distribute the **whole folder** so paths stay correct:

- `README.md`, `DESIGNER-GUIDE.md`, `SHARING.md`
- `SKILL.md`, `steps-reference.md`, `troubleshooting.md`
- `scripts/verify-all.sh`

---

## Create a zip (for AirDrop / Slack / Drive)

From the **parent** of this package (e.g. repo root):

```bash
zip -r designer-dev-setup-package.zip designer-dev-setup-package/
```

Send **designer-dev-setup-package.zip**. Recipients unzip, then open **README.md** or **DESIGNER-GUIDE.md**.

---

## Slack blurb (copy-paste)

> **Mac setup for plugin development**  
> Unzip the attached **designer-dev-setup-package** and open **DESIGNER-GUIDE.md** first.  
> **Before you start:** request **CyberArk temporary admin** and have **VPN** handy.  
> Optional: copy the folder to `~/.cursor/skills/designer-dev-setup` and ask Cursor to walk you through setup (see **README.md**).  
> Quick check: in Terminal, `cd` into the unzipped folder and run `bash scripts/verify-all.sh`.

---

## Git / repo distribution

Commit `designer-dev-setup-package/` to your team repo. Designers **clone or download** the repo and use the package from disk, or copy the skill into `.claude/skills/` per **README.md**.

---

## Keeping the package current

When Intuit changes tooling (Node version, Plugin CLI, hosts names, etc.):

1. Update the canonical skill under `.claude/skills/designer-dev-setup/` in **innersource-skills** (if that is your source of truth).
2. Copy refreshed files into **designer-dev-setup-package/** (`steps-reference.md`, `troubleshooting.md`, `scripts/verify-all.sh`, `SKILL.md`).
3. Bump **Package version** in **designer-dev-setup-package/README.md**.
4. Re-zip and re-share, or ask designers to `git pull`.

---

## Privacy

Do not paste **SSH private keys**, passwords, or personal tokens into Slack. Public SSH keys (.pub) are safe to handle per your team’s security policy.
