import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const { ethers } = hre;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  let priv = process.env.PRIVATE_KEY?.trim();
  if (!priv) {
    throw new Error("Missing PRIVATE_KEY environment variable");
  }
  // Accept both 0x-prefixed and non-prefixed 64-hex private keys
  const hex64 = /^[0-9a-fA-F]{64}$/;
  const hex0x64 = /^0x[0-9a-fA-F]{64}$/;
  if (hex64.test(priv)) priv = `0x${priv}`;
  if (!hex0x64.test(priv)) {
    throw new Error("Invalid PRIVATE_KEY format. Expected 64 hex (with or without 0x prefix)");
  }

  const provider = ethers.provider;
  const signer = new ethers.Wallet(priv, provider);

  const Trace = await ethers.getContractFactory("Trace", signer);
  const trace = await Trace.deploy();
  await trace.waitForDeployment();

  const address = await trace.getAddress();
  console.log(`✅ Contract deployed to: ${address}`);

  // Create deployment info
  const deploymentInfo = {
    contractName: "Trace",
    address: address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  // Save to frontend/public so the UI can fetch it directly
  const publicDeploymentPath = path.join(__dirname, "..", "frontend", "public", "deployment.json");
  console.log("🛠️ Saving deployment.json to:", publicDeploymentPath);
  fs.writeFileSync(publicDeploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`📁 Deployment info saved to: ${publicDeploymentPath}`);

  // Also copy ABI to frontend/src/abi for CRA import safety
  const artifactsAbiPath = path.join(__dirname, "..", "artifacts", "contracts", "Trace.sol", "Trace.json");
  const frontendAbiDir = path.join(__dirname, "..", "frontend", "src", "abi");
  const frontendAbiPath = path.join(frontendAbiDir, "Trace.json");
  try {
    if (!fs.existsSync(frontendAbiDir)) fs.mkdirSync(frontendAbiDir, { recursive: true });
    const abiJson = JSON.parse(fs.readFileSync(artifactsAbiPath, "utf8"));
    fs.writeFileSync(frontendAbiPath, JSON.stringify({ abi: abiJson.abi }, null, 2));
    console.log(`📦 ABI copied to: ${frontendAbiPath}`);
  } catch (e) {
    console.warn("⚠️ Could not copy ABI to frontend/src/abi. Make sure artifacts exist.", e.message);
  }
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
