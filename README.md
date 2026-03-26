# MicroEscrow 💰

**Decentralized Escrow System on OneChain — Secure, Trustless Agreements Without Intermediaries**

MicroEscrow is a blockchain-based escrow system that enables secure agreements between parties without relying on centralized intermediaries. Funds are locked on-chain and released only when predefined conditions are met.

## 🌐 Overview

Traditional escrow systems depend on third-party platforms to hold and release funds, introducing risks such as delays, fees, and trust issues.

MicroEscrow eliminates intermediaries by using **smart contracts as trust enforcers**, ensuring that:

* **Funds are securely locked** on-chain
* **Conditions are enforced automatically**
* **Transactions are transparent and verifiable**
* **No third party is required**

This enables seamless and trustless transactions between individuals or organizations.

## ❗ The Problem

* Dependence on centralized escrow services
* Risk of fraud or delayed settlements
* High fees and inefficiencies
* Lack of transparency in agreements
* Limited automation in dispute handling

## 💡 The Solution

MicroEscrow uses a **smart contract-based escrow model** where funds are held in a contract until one of two actions occurs:

* **Release** → funds are transferred to the recipient upon completion
* **Refund** → funds are returned to the sender if conditions are not met

All states and transitions are recorded on-chain, ensuring **complete transparency and accountability**.

## ✨ Key Features

* **On-Chain Escrow Agreements**
  Create secure agreements with recipient, amount, and description

* **Trustless Fund Management**
  Funds are locked and controlled by smart contracts

* **Release & Refund Logic**
  Flexible settlement based on agreement outcomes

* **Transparent Status Tracking**
  Track escrow lifecycle: Pending → Released / Refunded

* **AI-Assisted Description Writing**
  Generate clear and professional agreement terms

* **Modern Frontend Experience**
  Clean UI with optimized UX for real-world usage

## ⚙️ How It Works

1. User creates an escrow agreement with recipient and amount
2. Funds are locked in the smart contract
3. Recipient completes the agreed work
4. Sender releases funds OR initiates a refund
5. Contract executes transaction based on action
6. Status is updated and recorded on-chain

## 📦 Deployed Contract

* **Network:** OneChain Testnet

* **Package ID:**
  `0x26a7e13cf0c32bd5c0b5556ec0d6ec1b470756d07b10c5162fa3f9063b489d67`

* **Explorer Link:**
  [https://onescan.cc/testnet/packageDetail?packageId=0x26a7e13cf0c32bd5c0b5556ec0d6ec1b470756d07b10c5162fa3f9063b489d67](https://onescan.cc/testnet/packageDetail?packageId=0x26a7e13cf0c32bd5c0b5556ec0d6ec1b470756d07b10c5162fa3f9063b489d67)

## 🛠 Tech Stack

**Smart Contract**

* Move (OneChain)

**Frontend**

* React
* TypeScript
* Vite

**Wallet Integration**

* @mysten/dapp-kit

**AI Integration**

* OpenAI API (description rewriting)

**Network**

* OneChain Testnet

## 🔍 Use Cases

* **Freelance Payments**
  Secure payments for work completion

* **Peer-to-Peer Transactions**
  Trustless exchanges between individuals

* **Service Agreements**
  Ensure delivery before payment release

* **Marketplace Escrow**
  Protect buyers and sellers in decentralized markets

* **Micro-Transactions**
  Small-value agreements with guaranteed execution

## 🚀 Why MicroEscrow Stands Out

* **Trustless Agreements** — no intermediaries required
* **Secure Fund Handling** — funds locked on-chain
* **Transparent Execution** — all actions verifiable
* **AI-Enhanced UX** — better contract descriptions
* **Simple Yet Powerful Design** — easy adoption
* **Hackathon-Ready Utility** — real-world financial use case

## 🔮 Future Improvements

* Multi-party escrow agreements
* Dispute resolution mechanisms
* Time-locked escrows
* Milestone-based payments
* Integration with identity (ChainProfile) and reputation (ReputationScore)
* Backend-secured AI integration

## ⚙️ Contract API

```move id="u7x3pl"
public fun create(
    recipient: address,
    amount: u64,
    description: vector<u8>,
    ctx: &mut TxContext
)

public fun release(escrow: &mut Escrow, ctx: &mut TxContext)

public fun refund(escrow: &mut Escrow, ctx: &mut TxContext)
```

## 💻 Frontend Setup

```bash id="r5m2zx"
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🔧 Environment Variables

Create `frontend/.env`:

```env id="y2k1xt"
VITE_PACKAGE_ID=0x26a7e13cf0c32bd5c0b5556ec0d6ec1b470756d07b10c5162fa3f9063b489d67
VITE_OPENAI_KEY=<your_openai_api_key>
```

## 🤖 AI Description Rewrite

* Enter a draft agreement description
* Click **✨ Rewrite Description**
* The app refines the text for clarity and professionalism

**Note:**
`VITE_OPENAI_KEY` is exposed in frontend environments. For production, route API calls through a backend to keep keys secure.

## 📄 License

MIT License
