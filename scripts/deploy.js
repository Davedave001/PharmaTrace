const hre = require("hardhat");

async function main() {
  const Trace = await hre.ethers.getContractFactory("Trace");
  const trace = await Trace.deploy({ gasLimit: 3000000 }); // Optional: set gasLimit
  await trace.waitForDeployment(); // Use waitForDeployment() instead of deployTransaction.wait()

  console.log(`✅ Contract deployed to: ${trace.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error.message);
  process.exitCode = 1;
});
