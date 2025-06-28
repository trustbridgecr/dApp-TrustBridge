![Banner2](https://github.com/user-attachments/assets/ae9fa07b-039e-4be8-8626-ff1ec83f869a)

# TrustBridge

Integration prototype between **TrustBridge** and **Blend.Capital** enabling **cross-chain lending** on the Stellar blockchain using bridged assets and Blend’s permissionless lending infrastructure.

🔗 Built on Stellar + Soroban  
🧪 MVP running on testnet  
💱 Use case: Interoperable Lending with bridged assets (e.g., USDC, BLND)

## Getting Started

1. Install dependencies, including the Blend SDK:

```bash
npm install
```

2. Copy the `.env.example` file to `.env` and configure the following variables:
   - Blend contract addresses
   - Wallet address
   - RPC or Soroban network details (testnet or mainnet)

3. Launch the development server:

```bash
npm run dev
```

## Architecture Overview

- **TrustBridge** handles asset bridging and cross-chain messaging.
- **Blend** manages lending, borrowing, and liquidations in a permissionless environment.
- Integration is implemented using Soroban smart contracts and TypeScript interfaces.

## Status

- Functional MVP live on Stellar testnet
- Supports USDC and BLND lending pools
- Oracle integration via custom `oracle-mock` Soroban contract

## License

MIT
