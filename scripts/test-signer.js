// scripts/test-signer.js
const { ethers } = require("hardhat"); // use hardhat's ethers (not from require("ethers"))
require("dotenv").config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  console.log("Wallet address:", wallet.address);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exitCode = 1;
});
