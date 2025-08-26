import { ethers } from "ethers";
import { getProvider, getSignerIfAvailable } from "../lib/web3";
import traceAbiJson from "../abi/Trace.json";

async function loadDeployment() {
  const res = await fetch("/deployment.json", { cache: "no-store" });
  if (!res.ok) throw new Error("Missing /deployment.json");
  return await res.json(); // { address, contractName, ... }
}

export async function getTraceContract(readOnly = false) {
  const { address } = await loadDeployment();
  const abi = traceAbiJson.abi;

  let providerOrSigner = getProvider();
  if (!readOnly) {
    const signer = await getSignerIfAvailable();
    if (signer) providerOrSigner = signer;
  }
  return new ethers.Contract(address, abi, providerOrSigner);
}