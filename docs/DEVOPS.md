# PharmaTrace DevOps Guide

This guide documents how PharmaTrace is built, deployed, secured, monitored, and operated across environments.

## Environments

- Local: Developer machine (Vite dev server, Hardhat)
- Testnet: Hedera Testnet, Vercel production preview or production
- Production: Vercel Production (static SPA), Hedera Testnet (current)

Environment matrix:
- Frontend: Vite React SPA hosted on Vercel (static build)
- Smart Contracts: Solidity deployed via Hardhat to Hedera JSON-RPC (`https://testnet.hashio.io/api`)
- Wallet: MetaMask (end-user)

## Repositories & Branching

- Repo: GitHub `Davedave001/PharmaTrace`
- Branching: `main` as trunk. Feature branches recommended (`feature/*`).
- Conventional Commits are preferred for semantic history (feat, fix, docs, chore).

## Build Artifacts

- Frontend: `frontend/dist` (Vite static assets)
- Contract artifacts: `artifacts/contracts/Trace.sol/Trace.json`
- Deployment metadata: `frontend/public/deployment.json` (consumed by frontend)

## CI/CD

Vercel (build + deploy):
- Build command: `npm ci && cd frontend && npm ci && npm run build`
- Output directory: `frontend/dist`
- SPA routing: handled by `vercel.json` (filesystem handler + fallback to `/index.html`)

Recommended GitHub → Vercel workflow:
- On push to `main`: Vercel creates a production deployment
- On PR: Vercel creates preview deployments

Optional GitHub Actions (future):
- Lint & Typecheck (frontend): `npm run lint`, `tsc --noEmit`
- Solidity format & compile check: `npx hardhat compile`
- Blocked merges if checks fail

## Secrets Management

- Local: `.env` (not committed)
  - `PRIVATE_KEY` (EVM private key; 64 hex with or without 0x)
  - `OPERATOR_ID`, `OPERATOR_KEY` (Hedera SDK if needed)
- Vercel: Environment Variables (Project Settings → Environment Variables)
  - If introducing API routes or server usage, configure secrets here.
- Never commit private keys. Rotate if exposed.

## Contract Deployment (Release Process)

1) Prepare keys in root `.env`:
```
PRIVATE_KEY=...
OPERATOR_ID=...
OPERATOR_KEY=...
```
2) Deploy to Hedera Testnet:
```
npx hardhat run scripts/deploy.js --network hedera
```
3) The script writes:
- `frontend/public/deployment.json` with contract address & metadata
- Copies ABI to `frontend/src/abi/Trace.json`
4) Commit & push changes (so frontend consumes new address/ABI).

Rollback:
- Re-deploy older known-good contract and re-copy ABI/address.
- Frontend is static; roll back by redeploying a previous Vercel build or git revert.

## Infrastructure

- Hosting: Vercel (static build)
- DNS: optional custom domain; default `*.vercel.app`
- CDN: Vercel Edge Network
- JSON-RPC: Hedera Hashio Testnet `https://testnet.hashio.io/api`

`vercel.json` excerpt:
```
{
  "version": 2,
  "builds": [{
    "src": "frontend/package.json",
    "use": "@vercel/static-build",
    "config": { "distDir": "dist" }
  }],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

## Observability & Monitoring

- Frontend:
  - Vercel Analytics (enable in project settings)
  - Web Vitals via Vercel or custom solution
- On-chain:
  - HashScan for transaction inspection & audit
- Logs:
  - Frontend console logs (browser devtools)
  - Deployment logs via Vercel dashboard

Error Handling:
- Frontend uses toasts and console logs in `services/traceContract.js`
- Provide user-facing fallbacks when `deployment.json` or ABI is missing

## Security

- Keys never in frontend bundle
- Wallet signing done client-side via MetaMask
- CORS not applicable for static SPA
- Supply-chain security: lock versions; Dependabot recommended

## Backups & DR

- Source of truth: GitHub repository
- Deployments are immutable; Vercel keeps history for quick rollbacks
- Contract data is on-chain (immutable)

## Release Checklist

- [ ] All tests/lints pass
- [ ] Contract deployed; `deployment.json` and ABI updated
- [ ] Feature flags set (if any)
- [ ] Vercel build succeeds (Preview)
- [ ] Manual smoke test: wallet connect, batch record, QA actions
- [ ] Promote to Production (merge to `main`)

## Runbooks

Wallet Connect Fails:
- Ensure MetaMask on Hedera testnet
- Reload page; check `window.ethereum`
- Check browser console

Transaction Fails:
- Verify `deployment.json` address matches current network
- Confirm account funded on testnet
- Inspect failure on HashScan

Blank Page / 404 on Vercel:
- Ensure `vercel.json` routes fallback to `/index.html`
- Build output is `frontend/dist`
- Re-deploy via `npx vercel --prod`

## Roadmap (Ops)

- Add GitHub Actions CI
- Add Sentry for error tracking
- Add environment promotion (dev → staging → prod)
- Add E2E tests (Playwright/Cypress)
