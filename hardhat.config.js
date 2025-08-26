import "dotenv/config";
import "@nomicfoundation/hardhat-ethers";

let envPrivateKey = process.env.PRIVATE_KEY?.trim();
const hex64 = /^[0-9a-fA-F]{64}$/;
const hex0x64 = /^0x[0-9a-fA-F]{64}$/;
if (envPrivateKey && hex64.test(envPrivateKey)) envPrivateKey = `0x${envPrivateKey}`;
const isHexPrivateKey = typeof envPrivateKey === "string" && hex0x64.test(envPrivateKey);
const hederaAccounts = isHexPrivateKey ? [envPrivateKey] : [];

export default {
	defaultNetwork: "hardhat",
	networks: {
		hedera: {
			url: "https://testnet.hashio.io/api",
			accounts: hederaAccounts,
		},
	},
	solidity: "0.8.28",
};
