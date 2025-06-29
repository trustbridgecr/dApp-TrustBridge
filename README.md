![Banner2](https://github.com/user-attachments/assets/ae9fa07b-039e-4be8-8626-ff1ec83f869a)

# TrustBridge

Integration prototype between **TrustBridge** and **Blend.Capital** enabling **cross-chain lending** on the Stellar blockchain using bridged assets and Blend's permissionless lending infrastructure.

🔗 Built on Stellar + Soroban  
🧪 MVP running on testnet  
💱 Use case: Interoperable Lending with bridged assets (e.g., USDC, BLND)  
🏪 **NEW**: Complete marketplace interface with pool deployment and borrowing functionality

## Features

### 🏦 TrustBridge-MicroLoans Pool
- **Multi-asset support**: USDC, XLM, and TBRG token reserves
- **Oracle integration**: Real-time price feeds for accurate collateral valuation
- **Risk management**: Configurable collateral factors and liquidation thresholds
- **Pool deployment**: One-click deployment of lending pools via Blend Protocol

### 💰 Marketplace Interface
- **Dashboard**: Comprehensive overview of pool statistics and user positions
- **Borrow Flow**: Intuitive USDC borrowing with real-time health factor calculation
- **Wallet Integration**: Seamless Freighter wallet connection and transaction signing
- **Health Monitoring**: Live collateral ratio and liquidation risk tracking

### 🔧 Technical Implementation
- **Blend SDK v2.2.0**: Complete integration with Blend Protocol's lending infrastructure
- **Pool Factory**: Automated deployment using Blend's PoolFactoryContract
- **Smart Contracts**: Proper Stellar testnet contract addresses and configurations
- **TypeScript**: Type-safe implementation with comprehensive error handling

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Freighter wallet extension installed
- Stellar testnet account with funded XLM

### Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/dApp-TrustBridge.git
cd dApp-TrustBridge/frontend
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

4. Navigate to the marketplace:
   - Open `http://localhost:3000`
   - Go to Dashboard → Marketplace
   - Connect your Freighter wallet

### Pool Deployment

1. **Connect Wallet**: Click "Connect Wallet" and approve Freighter connection
2. **Deploy Pool**: Click "Deploy Pool" to create the TrustBridge-MicroLoans pool
3. **Wait for Confirmation**: Transaction will be signed and submitted to Stellar testnet
4. **Start Borrowing**: Once deployed, use "Borrow USDC" to access lending functionality

## Architecture Overview

### Smart Contract Integration
- **TrustBridge Contracts**: Handle asset bridging and cross-chain messaging
- **Blend Protocol**: Manages lending, borrowing, and liquidations in a permissionless environment
- **Oracle Contract**: Provides real-time price feeds for collateral valuation
- **Pool Factory**: Deploys and configures lending pools with custom parameters

### Frontend Architecture
```
frontend/src/
├── config/contracts.ts              # Contract addresses & network configuration
├── helpers/pool-deployment.helper.ts # Pool deployment workflow
├── app/dashboard/                   # Dashboard pages and layouts
│   ├── layout.tsx                   # Dashboard sidebar navigation
│   ├── page.tsx                     # Dashboard overview
│   └── marketplace/                 # Marketplace functionality
├── components/modules/marketplace/   # Marketplace UI components
│   └── ui/
│       ├── pages/MarketplacePage.tsx # Main marketplace interface
│       └── components/BorrowModal.tsx # Borrow transaction flow
└── providers/                       # Context providers for wallet and state
```

### Key Contracts (Stellar Testnet)
- **Oracle**: `CBCIZHUC42CKOZHKKEYMSXVVY24ZK2EKEUU6NFGQS5YFG7GAMEU5L32M`
- **USDC Token**: `CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA`
- **XLM Token**: `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAOBKYCWXVB`
- **TBRG Token**: `CAAUAE53WKWR4X2BRCHXNUTDJGXTOBMHMK3KFTAPEUBA7MJEQBPWVWQU`
- **Pool Factory**: `CCDEMRRGV4XHXR6PVHA6OXQ5NV3NWUGWFWRR5H3CEPSNKVPQRYVCTPPU`

## Usage Examples

### Deploy a Lending Pool
```typescript
import { deployCompletePool } from '@/helpers/pool-deployment.helper';

// Deploy TrustBridge-MicroLoans pool
const poolId = await deployCompletePool(walletAddress);
console.log('Pool deployed:', poolId);
```

### Borrow USDC
```typescript
import { PoolContract, RequestType } from '@blend-capital/blend-sdk';

// Create borrow transaction
const pool = new PoolContract(TRUSTBRIDGE_POOL_ID);
const borrowOpXdr = pool.submit({
  from: walletAddress,
  spender: walletAddress,
  to: walletAddress,
  requests: [{
    request_type: RequestType.Borrow,
    address: TOKENS.USDC,
    amount: BigInt(amount * 1e7), // USDC has 7 decimals
  }],
});

// Sign with Freighter
const signedTx = await signTransaction({
  unsignedTransaction: borrowOpXdr,
  address: walletAddress
});
```

## Pool Configuration

### TrustBridge-MicroLoans Parameters
- **Backstop Rate**: 15% - Fee charged for backstop provider protection
- **Max Positions**: 4 - Maximum number of concurrent user positions
- **Reserves**: USDC (primary), XLM (collateral), TBRG (governance)

### Reserve Configurations
| Asset | Collateral Factor | Liability Factor | Target Utilization |
|-------|------------------|------------------|-------------------|
| USDC  | 85%              | 95%              | 80%               |
| XLM   | 75%              | 90%              | 75%               |
| TBRG  | 60%              | 85%              | 70%               |

## Development

### Running Tests
```bash
cd frontend
npm run test
```

### Linting and Formatting
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting issues
npm run format        # Format code with Prettier
```

### Building for Production
```bash
npm run build         # Build optimized production bundle
npm run start         # Serve production build locally
```

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure Freighter extension is installed and unlocked
   - Check that you're on Stellar testnet
   - Verify wallet has sufficient XLM for transaction fees

2. **Pool Deployment Failed**  
   - Confirm Pool Factory contract address is correct
   - Check network connectivity to Stellar testnet
   - Ensure wallet has sufficient XLM balance (minimum 1 XLM recommended)

3. **Borrow Transaction Failed**
   - Verify pool is deployed and active
   - Check sufficient collateral is deposited
   - Ensure borrow amount doesn't exceed health factor limits

### Getting Help
- Check the [Issues](https://github.com/yourusername/dApp-TrustBridge/issues) for known problems
- Join our [Discord](https://discord.gg/trustbridge) for community support
- Review [Blend Protocol Documentation](https://docs.blend.capital/) for advanced usage

## Status

- ✅ Functional MVP live on Stellar testnet
- ✅ Complete marketplace interface with pool deployment
- ✅ USDC borrowing with real-time health factor calculation  
- ✅ Multi-asset support (USDC, XLM, TBRG)
- ✅ Oracle integration for accurate price feeds
- ✅ Wallet integration with Freighter
- 🚧 Supply/lending functionality (coming next)
- 🚧 Liquidation interface
- 🚧 Cross-chain asset bridging integration

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - see [LICENSE](LICENSE) file for details.

---

**TrustBridge** - Bridging the gap between chains, one loan at a time. 🌉
