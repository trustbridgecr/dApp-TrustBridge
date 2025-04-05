# 🚀 TrustBridge

**TrustBridge** is a decentralized lending platform built on the Stellar blockchain and integrated with Trustless Work for smart contract management. It enables users to request and fund secure loans, ensuring transparency, automation, and security without traditional intermediaries.

## 🎯 Key Benefits and Objectives

- Facilitate access to secure, decentralized loans via the Stellar network.
- Connect borrowers and lenders through a transparent marketplace.
- Automate escrow creation with Trustless Work for secure fund handling.

## 🔒 Why Choose TrustBridge?

### ⚙️ Core Advantages

- **Security:** Funds are managed by smart contracts, not centralized entities.
- **Transparency:** All loan activities are verifiable on the blockchain.
- **Efficiency:** Fast transactions and no intermediaries.
- **Smart Automation:** Conditions are enforced automatically via escrow contracts.

## 🌟 Marketplace Features

- 🧾 Browse approved loan requests
- 📊 View key loan details: amount, borrower, date, conditions
- 🔎 Search and filter by title, minimum amount, and date
- 🧩 Fund directly from wallet via Trustless Work API
- 🔐 Fully decentralized and trustless escrow deployment

## 🛠️ How It Works

1. **Borrower submits a loan request.**
2. **Loan is reviewed and approved by the platform.**
3. **The request appears in the marketplace.**
4. **Lenders fund loans via their Stellar wallet.**
5. **A smart contract is deployed through Trustless Work.**
6. **Loan is disbursed automatically.**

---

## ⚙️ Getting Started

Follow the steps below to get started with this project:

### 📦 Installation

1. Install dependencies:

```bash
npm i
```

2. Format the code using Prettier:

```bash
npx prettier --write .
```

3. Start the development server:

```bash
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project with the following:

```env
# Firebase configuration
NEXT_PUBLIC_FIREBASE_API_KEY=TU_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=TU_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=TU_APP_ID

# Trustless Work API
NEXT_PUBLIC_API_URL=https://dev.api.trustlesswork.com
NEXT_PUBLIC_API_KEY=TU_API_KEY
```

### API Key Video

[dApp Trustless Work](https://dapp.trustlesswork.com)

https://github.com/user-attachments/assets/69f0adf2-cb5f-48ff-a4eb-bb1870fa35fa

### Firebase Video

[Firebase](https://firebase.google.com)

https://github.com/user-attachments/assets/0c4a8a80-33f1-41ae-819b-6a38abf30e4b

---

## 🔥 Firebase Setup

Once you have your Firebase database ready, add the following document in the `trustlines` collection:

```
name: "USDC" (string)
trustline: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5" (string)
trustlineDecimals: 10000000 (number)
```

---

## 🔑 Wallet Requirements

To use this platform, install one of the following wallets:

- Freighter
- Albedo
- xBull
- LOBSTR

### Wallet Usage Note

Ensure your wallet is set to "test net". If you see "Not Available" in Freighter:

- Go to **Security > Manage Connected Wallets**
- Remove **localhost**
- Reload and reconnect

If problems persist, contact support.

---

## 🧠 IMPORTANT NOTE (Husky Setup)

We use **Husky** to ensure code formatting and linting on `git push`. If `npm run format` or `npm run lint` fail, your push will be blocked.

Fix any errors before retrying your push.

---

## 📜 License

© 2025 TrustBridge. Released under the MIT License.
