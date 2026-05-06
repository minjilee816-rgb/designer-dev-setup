# MedWrite AI — Review Cycle E2E (Desktop)

Clickable React prototype of Sarah's end-to-end review workflow, built from the Figma designs in `4. E2E` (frames `D1`–`D5`).

## Stack
- React 18 + TypeScript
- Vite

## Run locally
```bash
npm install --registry=https://registry.npmjs.org/
npm run dev
```
Opens at http://localhost:3000/.

> Heads up: this project intentionally pulls from the public npm registry. If your `~/.npmrc` points at an internal registry that requires VPN, the install will hang.

## Flow
| Step | Screen |
| ---- | ------ |
| 1 | Configure Review Cycle |
| 2 | Review Dashboard — Monitor Progress |
| 3 | Comment Triage — Resolve & Incorporate |
| 4 | Incorporate Changes — Change Log |
| 5 | Submit for Director Sign-off |

Use the step pills at the top to jump between screens, or the in-screen "Next" buttons to walk forward.
