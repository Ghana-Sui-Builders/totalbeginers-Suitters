# Suitter Backend - Enoki Gas Sponsorship# Suitter Backend



A lightweight Express.js backend for the Suitter dApp that provides transaction sponsorship via Enoki SDK.A simple Express.js backend server that acts as a **Trusted Proxy** and **Gas Sponsor** for the Suitter Move smart contract on Sui.



## 🏗️ Architecture## 🚀 Features



This backend uses **Enoki SDK** for gas sponsorship, eliminating the need for private keys in the backend while still enabling gasless transactions for users.- **Gas Sponsorship**: The server pays for all transaction fees

- **JWT Authentication**: Simple JWT token validation (mock for hackathon)

### Key Features- **REST API**: Clean endpoints for profile creation, posting, liking, and updates

- **TypeScript**: Fully typed with strict mode enabled

- ✅ **Zero Private Keys**: No sensitive keys stored in backend

- ✅ **User-Signed Transactions**: Users maintain full control and sign with their own keys## 📁 Project Structure

- ✅ **Enoki Gas Sponsorship**: Managed sponsorship via Enoki infrastructure

- ✅ **Read-Only Queries**: Direct blockchain data access```

- ✅ **Type-Safe**: Full TypeScript implementationbackend/

├── src/

## 📋 Prerequisites│   ├── index.ts              # Main Express server and API routes

│   ├── sui.service.ts        # SUI blockchain interaction logic

- Node.js >= 18│   └── auth.middleware.ts    # JWT authentication middleware

- pnpm (or npm/yarn)├── .env.example              # Environment variables template

- Enoki API Key from [Enoki Portal](https://portal.enoki.mystenlabs.com/)├── package.json

- Deployed `suitter_enoki.move` contract on Sui├── tsconfig.json

└── README.md

## 🚀 Quick Start```



### 1. Install Dependencies## 🛠️ Setup



```bash
### 1. Install Dependencies

pnpm install
```
```bash

npm install

### 2. Environment Setup

```



Create a `.env` file:### 2. Configure Environment



```bash
Copy `.env.example` to `.env` and fill in your values:

# Get this from https://portal.enoki.mystenlabs.com/

ENOKI_API_KEY=enk_...
```bash

cp .env.example .env

# From your contract deployment```

PACKAGE_ID=0x...

REGISTRY_ID=0x...Edit `.env`:



# Network configuration```env

SUI_NETWORK=devnetSPONSOR_SECRET_KEY=your_base64_private_key_here

PORT=3000PACKAGE_ID=0x...

```SPONSOR_CAP_ID=0x...

REGISTRY_ID=0x...

### 3. Start Development ServerSUI_NETWORK=testnet

PORT=3000

```bash```

pnpm run dev

```**How to get these values:**



The server will start on `http://localhost:3000`- **SPONSOR_SECRET_KEY**: Your SUI wallet's private key in base64 format

- **PACKAGE_ID**: The package ID after deploying the Move contract

### 4. Build for Production- **SPONSOR_CAP_ID**: The SponsorCap object ID (check transaction after deployment)

- **REGISTRY_ID**: The Registry object ID (check transaction after deployment)

```bash

pnpm run build### 3. Run Development Server

pnpm start

``````bash

npm run dev

## 📡 API Endpoints```



### Transaction EndpointsThe server will start on `http://localhost:3000`



#### POST /api/sponsor### 4. Build for Production

Sponsors a transaction using Enoki.

```bash

**Request:**npm run build

```jsonnpm start

{```

  "transactionKindBytes": "base64-encoded-bytes",

  "sender": "0x..."## 🔌 API Endpoints

}

```### Health Check



**Response:**```http

```jsonGET /health

{```

  "bytes": "sponsored-transaction-bytes",

  "digest": "transaction-digest"### Register New User

}

``````http

POST /api/register

#### POST /api/executeContent-Type: application/json

Executes a signed sponsored transaction.

{

**Request:**  "username": "alice",

```json  "bio": "Hello world!",

{  "image_url_str": "https://example.com/pic.jpg",

  "digest": "transaction-digest",  "user_address": "0x..."

  "signature": "user-signature"}

}```

```

### Create Post

**Response:**

```json```http

{POST /api/post

  "success": true,Authorization: Bearer <jwt_token>

  "result": { /* execution result */ }Content-Type: application/json

}

```{

  "content": "My first post!",

### Read-Only Endpoints  "image_url_str": "https://example.com/image.jpg"

}

#### GET /health```

Health check endpoint.

### Like Post

**Response:**

```json```http

{POST /api/like

  "status": "healthy",Authorization: Bearer <jwt_token>

  "network": "devnet",Content-Type: application/json

  "enokiEnabled": true,

  "timestamp": "2024-01-15T12:00:00.000Z"{

}  "post_id": "0x..."

```}

```

#### GET /api/check-username/:username

Check username availability.### Update Profile



**Response:**```http

```jsonPUT /api/profile

{Authorization: Bearer <jwt_token>

  "available": trueContent-Type: application/json

}

```{

  "new_username": "alice_updated",

#### GET /api/profile/:address  "new_bio": "Updated bio",

Get user profile by Sui address.  "new_image_url_str": "https://example.com/new_pic.jpg"

}

**Response:**```

```json

{## 🔐 Authentication

  "success": true,

  "data": { /* profile object */ }The server expects a JWT token in the `Authorization` header:

}

``````

Authorization: Bearer <your_jwt_token>

#### GET /api/object/:object_id```

Get any on-chain object by ID.

**Note**: For this hackathon version, the JWT signature is NOT validated. In production, you MUST verify the signature against your zkLogin provider.

**Response:**

```json## 📝 Important Notes

{

  "success": true,### Security Considerations

  "data": { /* object data */ }

}1. **JWT Validation**: This implementation only *decodes* the JWT without signature verification. This is suitable for hackathon/testing but **NOT for production**.

```

2. **Ownership Checks**: The smart contract performs on-chain ownership checks (e.g., in `update_profile`), which provides a security layer even with simplified auth.

#### GET /api/feed

Get recent posts (placeholder - requires indexer).3. **Private Key**: Keep your `SPONSOR_SECRET_KEY` secure. Never commit `.env` to git.



**Response:**### Gas Sponsorship

```json

{The server's wallet pays for all transactions. Make sure it has sufficient SUI tokens:

  "success": true,

  "message": "Feed endpoint requires indexer integration",- Testnet: Get tokens from the [Sui faucet](https://discord.gg/sui)

  "data": []- Mainnet: Fund the wallet with real SUI

}

```## 🐛 Troubleshooting



## 📂 Project Structure### "Profile not found" error



```Make sure the user has registered first via `/api/register` before calling authenticated endpoints.

backend/

├── src/### Transaction execution fails

│   ├── routes/

│   │   ├── sponsor.ts        # Transaction sponsorship endpointCheck that:

│   │   └── execute.ts        # Transaction execution endpoint- Your sponsor wallet has sufficient SUI balance

│   ├── utils/- The PACKAGE_ID, SPONSOR_CAP_ID, and REGISTRY_ID are correct

│   │   ├── validation.ts     # Input validation utilities- The smart contract is deployed on the correct network

│   │   └── error-handler.ts  # Error handling middleware

│   ├── enoki.client.ts       # Enoki SDK initialization### Module not found errors

│   ├── sui.service.ts        # Sui blockchain service

│   └── index.ts              # Main Express serverRun `npm install` to ensure all dependencies are installed.

├── .env                       # Environment variables (create this)

├── .env.example              # Environment template## 📚 Tech Stack

├── package.json

├── tsconfig.json- **Express.js**: Web framework

├── ENOKI_SETUP.md            # Detailed setup guide- **TypeScript**: Type safety

└── README.md                 # This file- **@mysten/sui**: Sui SDK for blockchain interaction

```- **jwt-decode**: JWT token decoding

- **dotenv**: Environment variable management

## 🔄 Transaction Flow

## 🤝 Contributing

```

┌─────────────┐         ┌─────────────┐         ┌─────────────┐This is a hackathon project. Feel free to fork and improve!

│   Frontend  │         │   Backend   │         │    Enoki    │

└──────┬──────┘         └──────┬──────┘         └──────┬──────┘## 📄 License

       │                       │                       │

       │ 1. Build Transaction  │                       │MIT

       │                       │                       │
       │ 2. POST /api/sponsor  │                       │
       │──────────────────────>│                       │
       │                       │                       │
       │                       │ 3. Create Sponsored   │
       │                       │───────────────────────>│
       │                       │                       │
       │                       │ 4. Return bytes       │
       │                       │<───────────────────────│
       │ 5. Return bytes       │                       │
       │<──────────────────────│                       │
       │                       │                       │
       │ 6. Sign locally       │                       │
       │                       │                       │
       │ 7. POST /api/execute  │                       │
       │──────────────────────>│                       │
       │                       │                       │
       │                       │ 8. Execute            │
       │                       │───────────────────────>│
       │                       │                       │
       │                       │ 9. Return result      │
       │                       │<───────────────────────│
       │ 10. Return result     │                       │
       │<──────────────────────│                       │
```

## 🔒 Security

### What Makes This Secure?

1. **No Private Keys**: Backend has zero access to any signing keys
2. **User Control**: Users sign all transactions with their own keys
3. **Address Validation**: Enoki validates sender addresses match
4. **Transaction Integrity**: Digest verification prevents tampering
5. **Allowed Addresses**: Transactions can only be executed by intended sender

### Security Best Practices

- ✅ Never commit `.env` files
- ✅ Rotate Enoki API keys regularly
- ✅ Implement rate limiting in production
- ✅ Use CORS appropriately
- ✅ Monitor transaction patterns
- ✅ Validate all inputs

## 🛠️ Development

### Run Tests
```bash
pnpm test
```

### Lint Code
```bash
pnpm lint
```

### Type Check
```bash
pnpm type-check
```

## 🌐 Deployment

### Environment Variables for Production

```bash
ENOKI_API_KEY=your_production_api_key
PACKAGE_ID=your_deployed_package_id
REGISTRY_ID=your_registry_object_id
SUI_NETWORK=mainnet  # or testnet
PORT=3000
NODE_ENV=production
```

### Deploy to Railway/Render/etc.

1. Set environment variables in your hosting platform
2. Deploy from GitHub/GitLab
3. Platform will automatically run `pnpm install && pnpm build && pnpm start`

## 📚 Additional Documentation

- [ENOKI_SETUP.md](./ENOKI_SETUP.md) - Detailed setup instructions
- [FRONTEND_ENOKI_GUIDE.md](../FRONTEND_ENOKI_GUIDE.md) - Frontend integration guide
- [Enoki Documentation](https://docs.enoki.mystenlabs.com/) - Official Enoki docs

## 🔍 Troubleshooting

### Server won't start

Check that:
- ✅ `ENOKI_API_KEY` is set in `.env`
- ✅ `PACKAGE_ID` and `REGISTRY_ID` are valid
- ✅ Port 3000 is not already in use

### Sponsorship fails

Check that:
- ✅ Enoki API key is valid
- ✅ Transaction bytes are properly base64 encoded
- ✅ Sender address is valid
- ✅ Network matches (devnet vs testnet vs mainnet)

### Execution fails

Check that:
- ✅ Signature is correct
- ✅ Digest matches sponsored transaction
- ✅ Transaction wasn't sponsored too long ago (may have expired)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or PR.

---

Built with ❤️ using [Enoki](https://enoki.mystenlabs.com/) and [Sui](https://sui.io/)
