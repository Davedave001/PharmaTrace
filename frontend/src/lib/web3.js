import { ethers } from "ethers";

// Priority: wallet → fallback RPC
export function getProvider() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
  // Hedera Hashio JSON-RPC fallback
  return new ethers.JsonRpcProvider("https://testnet.hashio.io/api");
}

export async function getSignerIfAvailable() {
  if (!window.ethereum) return null;
  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
}