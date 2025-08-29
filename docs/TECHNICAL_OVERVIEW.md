# PharmaTrace Technical Overview

This document explains how PharmaTrace is built, including the smart contracts, web app, tooling, and how the pieces interact.

## System Architecture

```
+---------------------+        +-------------------------------+
|  Browser (React)    | <----> |  Hedera JSON-RPC (Hashio)     |
|  Vite SPA + Ethers  |        |  EVM-compatible RPC endpoint  |
+----------+----------+        +-------------------------------+
           ^
           | ethers.js v6 (BrowserProvider / JsonRpcProvider)
           v
+---------------------+        +-------------------------------+
|  Contract ABI       |        |  Trace.sol smart contract     |
|  Trace.json (ABI)   | <----> |  recordBatch/getBatch         |
+----------+----------+        +-------------------------------+
           ^
           | build & copy (Hardhat deploy script)
           v
+---------------------+
|  Hardhat (ESM)      |
|  scripts/deploy.js  |
+---------------------+
```

## Smart Contracts

### `contracts/Trace.sol`
- Solidity 0.8.x
- Purpose: minimal on-chain storage of batch records
- Data model:
  - `Batch { batchID, qaResult, serialNo, timestamp }`
  - `mapping(string => Batch) public batches`
- Functions:
  - `recordBatch(string batchID, string qaResult, string serialNo)`
    - Ensures uniqueness by `require` on empty existing batch
    - Emits `BatchRecorded` event
  - `getBatch(string batchID) -> Batch`

Rationale:
- Simple and gas-efficient structure
- Frontend sends JSON-encoded payloads for complex data (e.g., QA Stamps, COA, QC Tests, CAPA) in `qaResult` for auditability.

## Hardhat Tooling

### `hardhat.config.js`
- ESM imports
- Networks:
  - `hedera`: `https://testnet.hashio.io/api`, accounts from `PRIVATE_KEY`
- Solidity version: `0.8.28`

### `scripts/deploy.js`
- ESM script using `hre.ethers`
- Normalizes `PRIVATE_KEY` and builds `ethers.Wallet(signer)`
- Deploys `Trace` and waits for deployment
- Writes `frontend/public/deployment.json` with `{ address, network, timestamp }`
- Copies ABI to `frontend/src/abi/Trace.json`

Outcome:
- Frontend always loads the correct address & ABI post-deploy

## Frontend (Vite + React + TS)

### Entrypoint & Build
- `frontend/index.html`: SPA shell, links `/src/main.tsx`
- Vite dev server for local development
- Static build output to `dist` (served by Vercel)

### Styling & UI
- Tailwind CSS (`tailwind.config.ts`, `postcss.config.cjs`)
- shadcn/ui and Radix UI components
- Custom branding with SVG assets: `public/favicon.svg`, `public/logo.svg`

### Web3 Layer

#### `src/lib/web3.js`
- `getProvider()`: prefers `window.ethereum` → `BrowserProvider`; falls back to `JsonRpcProvider`
- `getSignerIfAvailable()`: requests accounts and returns signer if wallet exists

#### `src/services/traceContract.js`
- Loads `/deployment.json` at runtime
- Imports ABI from `src/abi/Trace.json`
- Returns `ethers.Contract` instance (read-only or with signer)
- Robust error handling and logging

### Pages
- `src/pages/Dashboard.tsx`
  - Wallet connect gating (MetaMask)
  - "New Batch" dialog posts to `recordBatch`
  - Toast feedback and UI state management

- `src/pages/Batches.tsx`
  - Full batch form: product, status, QA status, progress, dates, operator, upstream reference
  - On-chain record: `recordBatch(batchId, qaResult, serialNumber)`
  - Displays newly recorded batch with HashScan link via `tx.hash`

- `src/pages/QualityAssurance.tsx`
  - QA Stamps: stored on-chain by JSON-stringifying a payload and passing as `qaResult`
  - COA Generation: captures inputs, records payload, downloads COA file with tx hash
  - QC Tests: similar pattern with structured payload
  - CAPA Management: simulates IoT events and records CAPA payloads on-chain
  - Wallet gating and robust UX

- `src/pages/AuditTrail.tsx`
  - Transaction history surface (placeholder/extendable)

### Notifications & UX
- `useToast` hook for user feedback
- Dialogs modals for forms; defensive validation; loading states

## Deployment

### Vercel
- Configured via `vercel.json`:
  - `@vercel/static-build` on `frontend/package.json`
  - SPA routes fallback to `/index.html`
- Deployed via CLI `npx vercel --prod` or GitHub → Vercel integration
- Production URL auto-generated per deployment; optional custom domain

### Assets & Runtime Configuration
- `deployment.json` is served from `frontend/public/`
- ABI bundled in `src/abi/Trace.json`
- No server-side rendering or APIs are required for core features

## Data Flow (Batch Recording)

1. User opens "New Batch" dialog and submits the form
2. App checks wallet connectivity; requests signature if necessary
3. `getTraceContract(false)` returns a contract with signer
4. Call `recordBatch(batchId, qaResult, serialNumber)`
5. Display toast and wait for `tx.wait()`
6. Update local state; show success message with HashScan link

## Error Handling & Edge Cases
- Missing wallet → prompt to install/connect MetaMask
- Missing `deployment.json` or ABI → descriptive console error + toast
- Transaction reverts → display revert reason if available
- Network mismatch → instruct user to switch to Hedera testnet

## Extensibility
- Add richer contracts for structured QA/COA/QC/CAPA
- Introduce read-model/query service for analytics
- Secure backend for privileged operations if required (Node serverless)

## Local Development Tips
- Reset Vite cache if stale: delete `node_modules/.vite`
- Tailwind not applying? Ensure `tailwind.config.ts` `content` globs include all paths
- CRA remnants removed; Vite is the only entry (`src/main.tsx`)

## Versioning & Compatibility
- Ethers v6 used everywhere (avoid v5 mix-ups)
- ESM-only Hardhat configuration
- Node 18+ recommended for compatibility

## Appendix

### Key Files
- `contracts/Trace.sol`
- `scripts/deploy.js`
- `frontend/src/services/traceContract.js`
- `frontend/src/lib/web3.js`
- `frontend/src/pages/*.tsx`
- `frontend/public/deployment.json`
- `frontend/src/abi/Trace.json`
- `vercel.json`

### Commands
```
# Deploy contract
npx hardhat run scripts/deploy.js --network hedera

# Run frontend locally
cd frontend && npm run dev

# Deploy to Vercel
cd frontend && npx vercel --prod
```
