# PharmaTrace 🔬

**Blockchain-Powered Pharmaceutical Supply Chain Traceability Platform**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.28-blue.svg)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![Hedera](https://img.shields.io/badge/Hedera-Hashgraph-green.svg)](https://hedera.com/)

## 🌟 Live Demo

**Production URL**: [https://frontend-4e2hbt1gc-daves-projects-39d159e9.vercel.app](https://frontend-4e2hbt1gc-daves-projects-39d159e9.vercel.app)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Smart Contract](#smart-contract)
- [Frontend Application](#frontend-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

PharmaTrace is a comprehensive blockchain-based platform designed to enhance transparency, traceability, and compliance in pharmaceutical supply chains. Built on the Hedera Hashgraph network, it provides real-time tracking of pharmaceutical batches from production to distribution, ensuring quality assurance and regulatory compliance.

### Key Benefits

- **🔒 Immutable Records**: All pharmaceutical data is permanently stored on the Hedera blockchain
- **📊 Real-time Tracking**: Monitor batch status, QA results, and compliance metrics in real-time
- **🏥 Quality Assurance**: Comprehensive QA stamping, COA generation, and QC testing workflows
- **🤖 IoT Integration**: Automated CAPA (Corrective and Preventive Actions) management with IoT sensor data
- **📱 User-friendly Interface**: Modern, responsive dashboard built with React and Tailwind CSS

## ✨ Features

### 🏭 Manufacturing Dashboard
- Real-time production metrics and KPIs
- Batch creation and tracking
- Production status monitoring
- Quality compliance indicators

### 📦 Batch Management
- Complete batch lifecycle tracking
- Product information management
- Status updates and progress tracking
- Blockchain transaction verification via HashScan

### 🔬 Quality Assurance & Control
- **QA Stamps**: Digital quality assurance approvals with timestamps
- **Certificate of Analysis (COA)**: Automated generation of compliance certificates
- **QC Tests**: Laboratory test results and specifications tracking
- **CAPA Management**: IoT-driven corrective and preventive actions

### 🔗 Blockchain Integration
- Hedera Hashgraph smart contract deployment
- MetaMask wallet integration
- Transaction verification and audit trails
- Immutable data storage

### 📱 Modern UI/UX
- Responsive design with Tailwind CSS
- Shadcn/ui component library
- Dark/light theme support
- Mobile-optimized interface

## 🛠 Technology Stack

### Blockchain & Smart Contracts
- **Network**: Hedera Hashgraph Testnet
- **Smart Contracts**: Solidity 0.8.28
- **Development Framework**: Hardhat
- **Wallet Integration**: MetaMask

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Routing**: React Router DOM
- **State Management**: React Hooks

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Version Control**: Git

## 🏗 Architecture

```
PharmaTrace/
├── contracts/                 # Smart contracts
│   └── Trace.sol             # Main traceability contract
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── services/        # Blockchain integration
│   │   ├── lib/             # Utility functions
│   │   └── abi/             # Contract ABIs
│   └── public/              # Static assets
├── scripts/                 # Deployment scripts
├── hardhat.config.js        # Hardhat configuration
└── vercel.json             # Vercel deployment config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Hedera testnet account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Davedave001/PharmaTrace.git
   cd PharmaTrace
   ```

2. **Install dependencies**
   ```bash
   # Install Hardhat dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   
   # Add your Hedera credentials
   PRIVATE_KEY=your_hedera_private_key
   OPERATOR_ID=your_hedera_operator_id
   OPERATOR_KEY=your_hedera_operator_key
   ```

4. **Deploy Smart Contract**
   ```bash
   # From root directory
   npx hardhat run scripts/deploy.js --network hedera
   ```

5. **Start Development Server**
   ```bash
   # From frontend directory
   npm run dev
   ```

6. **Access Application**
   - Open [http://localhost:8080](http://localhost:8080)
   - Connect MetaMask to Hedera testnet
   - Start using PharmaTrace!

## 📜 Smart Contract

### Trace.sol

The main smart contract that handles pharmaceutical batch traceability:

```solidity
contract Trace {
    struct Batch {
        string batchID;
        string qaResult;
        string serialNo;
        uint256 timestamp;
    }
    
    mapping(string => Batch) public batches;
    
    function recordBatch(string memory batchID, string memory qaResult, string memory serialNo) public
    function getBatch(string memory batchID) public view returns (Batch memory)
}
```

### Key Functions

- **`recordBatch()`**: Records new pharmaceutical batch data on the blockchain
- **`getBatch()`**: Retrieves batch information by ID
- **Events**: Emits `BatchRecorded` events for audit trails

## 🖥 Frontend Application

### Pages

1. **Dashboard** (`/`) - Manufacturing overview and metrics
2. **Batches** (`/batches`) - Batch management and tracking
3. **Quality Assurance** (`/qa`) - QA stamps, COA, QC tests, and CAPA
4. **Audit Trail** (`/audit`) - Transaction history and verification

### Key Components

- **Wallet Integration**: MetaMask connection for blockchain transactions
- **Form Dialogs**: Interactive forms for data entry
- **Data Tables**: Real-time data display with filtering
- **Toast Notifications**: User feedback for transactions
- **HashScan Integration**: Direct links to blockchain transactions

## 🚀 Deployment

### Vercel Deployment

The application is automatically deployed to Vercel:

```bash
# Deploy to production
cd frontend
npx vercel --yes --prod
```

### Environment Variables

Set the following environment variables in Vercel:
- `VITE_CONTRACT_ADDRESS`: Deployed contract address
- `VITE_NETWORK_ID`: Hedera network ID

## 📚 API Documentation

### Blockchain Integration

The frontend communicates with the Hedera blockchain through:

- **Contract Service**: `frontend/src/services/traceContract.js`
- **Web3 Utilities**: `frontend/src/lib/web3.js`
- **ABI Integration**: Contract interface definitions

### Key Endpoints

- **Batch Recording**: `contract.recordBatch(batchId, qaResult, serialNumber)`
- **Batch Retrieval**: `contract.getBatch(batchId)`
- **Transaction Verification**: HashScan.io integration

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Ensure all tests pass
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://frontend-4e2hbt1gc-daves-projects-39d159e9.vercel.app](https://frontend-4e2hbt1gc-daves-projects-39d159e9.vercel.app)
- **GitHub Repository**: [https://github.com/Davedave001/PharmaTrace](https://github.com/Davedave001/PharmaTrace)
- **Hedera Documentation**: [https://docs.hedera.com/](https://docs.hedera.com/)
- **HashScan Explorer**: [https://hashscan.io/testnet](https://hashscan.io/testnet)

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the smart contract code

---

**Built with ❤️ for the pharmaceutical industry**
