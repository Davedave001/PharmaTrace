import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, BrowserProvider, Contract } from "ethers";
import './App.css';

const traceAbi = [
  "function getBatch(string batchID) view returns (tuple(string batchID, string qaResult, string serialNo, uint256 timestamp))",
  "function recordBatch(string batchID, string qaResult, string serialNo)"
];

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [contract, setContract] = useState(null);
  const [batchId, setBatchId] = useState('');
  const [qaResult, setQaResult] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [fetchId, setFetchId] = useState("");
  const [fetchedBatch, setFetchedBatch] = useState(null);
  const [status, setStatus] = useState("");
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    fetch('/deployment.json')
      .then(async res => {
        const text = await res.text();
        console.log("Raw deployment.json text:", text);  // <--- Add this
        const data = JSON.parse(text);
        setContractAddress(data.address);
        console.log("Deployment data loaded:", data);
      })
      .catch(err => console.error('Error loading deployment.json:', err));
  }, []);

  useEffect(() => {
    if (contractAddress) {
      const rpcUrl = "https://testnet.hashio.io/api";
      const tempProvider = new JsonRpcProvider(rpcUrl);
      const tempContract = new Contract(contractAddress, traceAbi, tempProvider);
      setContract(tempContract);
    }
  }, [contractAddress]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('accountsChanged', () => window.location.reload());
    }
    checkNetwork();
  }, []);

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    const provider = new BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.chainId !== 296) {
      alert("Please switch MetaMask to Hedera Testnet (Chain ID 296)");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 296) {
        alert("Please switch MetaMask to the Hedera Testnet (Chain ID 296)");
      }
    } catch (err) {
      console.error("Error connecting wallet:", err);
      alert("Failed to connect wallet.");
    }
  };

  const handleFetchBatch = async () => {
    if (!contract || !fetchId) return;
    try {
      const batch = await contract.getBatch(fetchId);
      setFetchedBatch({
        id: fetchId,
        qaResult: batch.qaResult ?? batch[1],
        serialNumber: batch.serialNo ?? batch[2],
      });
      setStatus("Batch fetched successfully!");
    } catch (err) {
      console.error("Batch not found:", err);
      setStatus("Batch not found or error occurred");
      setFetchedBatch(null);
    }
  };

  const handleRecordBatch = async () => {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }
    if (!contractAddress) {
      alert("Contract address not loaded yet!");
      return;
    }
    try {
      setStatus("Connecting wallet...");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await checkNetwork();
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = new Contract(contractAddress, traceAbi, signer);

      // Log values before sending the transaction
      console.log("BatchID:", batchId);
      console.log("QA Result:", qaResult);
      console.log("Serial No:", serialNumber);

      setStatus("Recording batch...");
      const tx = await contractWithSigner.recordBatch(batchId, qaResult, serialNumber);
      await tx.wait();
      setStatus("Batch recorded successfully!");
      setBatchId("");
      setQaResult("");
      setSerialNumber("");
      console.log("✅ Batch recorded successfully");
    } catch (error) {
      console.error("❌ Error recording batch:", error);
      if (error?.error?.message?.includes("Batch already exists")) {
        alert("Batch already exists. Please use a unique Batch ID.");
        setStatus("Batch already exists. Please use a unique Batch ID.");
      } else {
        alert("Failed to record batch. See console for details.");
        setStatus("Error recording batch.");
      }
    }
  };

  console.log("Current Contract Address:", contractAddress);

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">PharmaTrace DApp</h1>

      <div className="mb-4">
        {walletAddress ? (
          <p className="text-sm text-green-600">
            ✅ Connected: {walletAddress}
          </p>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Connect MetaMask Wallet
          </button>
        )}
      </div>

      <p className="mb-2 break-all text-xs text-gray-500">
        <span className="font-semibold">Contract Address:</span> {contractAddress || 'Loading...'}
      </p>
      {status && <p className="mb-4 text-blue-600">{status}</p>}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Fetch a Batch</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="Enter Batch ID"
            value={fetchId}
            onChange={e => setFetchId(e.target.value)}
            className="border px-2 py-1 rounded flex-1"
          />
          <button
            onClick={handleFetchBatch}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Get Batch
          </button>
        </div>
        {fetchedBatch && (
          <div className="bg-gray-100 p-2 rounded">
            <h3 className="font-semibold">Batch Details:</h3>
            <p><strong>ID:</strong> {fetchedBatch.id}</p>
            <p><strong>QA:</strong> {fetchedBatch.qaResult}</p>
            <p><strong>Serial:</strong> {fetchedBatch.serialNumber}</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Record a New Batch</h2>
        <input
          type="text"
          placeholder="Batch ID"
          value={batchId}
          onChange={e => setBatchId(e.target.value)}
          className="border px-2 py-1 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="QA Result"
          value={qaResult}
          onChange={e => setQaResult(e.target.value)}
          className="border px-2 py-1 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={e => setSerialNumber(e.target.value)}
          className="border px-2 py-1 rounded mb-2 w-full"
        />
        <button
          onClick={handleRecordBatch}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Record Batch
        </button>
      </div>
    </div>
  );
}

export default App;
