import { ethers } from "ethers";
import { getProvider, getSignerIfAvailable } from "../lib/web3";
import traceAbiJson from "../abi/Trace.json";

async function loadDeployment() {
  try {
    const res = await fetch("/deployment.json", { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to load deployment.json:", res.status, res.statusText);
      throw new Error(`Failed to load deployment.json: ${res.status} ${res.statusText}`);
    }
    const deployment = await res.json();
    console.log("Loaded deployment:", deployment);
    return deployment;
  } catch (error) {
    console.error("Error loading deployment:", error);
    throw new Error(`Failed to load deployment: ${error.message}`);
  }
}

export async function getTraceContract(readOnly = false) {
  try {
    const { address } = await loadDeployment();
    const abi = traceAbiJson.abi;

    console.log("Creating contract with address:", address);
    console.log("ABI length:", abi.length);

    let providerOrSigner = getProvider();
    console.log("Provider:", providerOrSigner.constructor.name);

    if (!readOnly) {
      try {
        const signer = await getSignerIfAvailable();
        if (signer) {
          console.log("Using signer:", signer.constructor.name);
          providerOrSigner = signer;
        } else {
          console.log("No signer available, using provider");
        }
      } catch (signerError) {
        console.warn("Error getting signer:", signerError);
        console.log("Falling back to provider");
      }
    }

    const contract = new ethers.Contract(address, abi, providerOrSigner);
    console.log("Contract created successfully");
    return contract;
  } catch (error) {
    console.error("Error creating contract:", error);
    throw new Error(`Failed to create contract: ${error.message}`);
  }
}