# 🐦 Suitter - Decentralized Social Media on Sui

A Twitter/X-style decentralized social media application built on the Sui blockchain with zkLogin authentication and gas sponsorship.

## 🌟 Features

- **User Profiles**: Create and manage on-chain profiles with usernames, bios, and avatars
- **Posts**: Share thoughts with a 280-character limit
- **Likes**: Like posts from other users
- **Follow System**: Follow and unfollow other users
- **Comments & Replies**: Full nested comment system (in progress)
- **zkLogin Authentication**: Sign in with Google OAuth
- **Gas Sponsorship**: Free transactions via Enoki
- **Walrus Integration**: Decentralized media storage

## 🏗️ Architecture

### Smart Contract (`/contract`)
- **Language**: Sui Move
- **Features**: 
  - User profiles with unique usernames
  - Posts, likes, and follows
  - Comments and nested replies
  - Event emissions for indexing

### Backend (`/backend`)
- **Stack**: Node.js + Express + TypeScript
- **Features**:
  - Transaction building and sponsorship
  - zkLogin salt generation
  - Data querying and aggregation
  - Enoki gas sponsorship integration

### Frontend (`/frontend`)
- **Stack**: React + TypeScript + Vite
- **UI**: Radix UI components
- **Features**:
  - zkLogin authentication flow
  - Profile management
  - Post creation and feed
  - Responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- pnpm
- Sui CLI
- Sui wallet or zkLogin support

### 1. Smart Contract Deployment

```bash
cd contract
sui client publish --gas-budget 100000000
```

Save the `PACKAGE_ID` and `REGISTRY_ID` from the output.

### 2. Backend Setup

```bash
cd backend
pnpm install

# Create .env file
cp .env.example .env
# Add your configuration:
# - PACKAGE_ID
# - REGISTRY_ID
# - ENOKI_API_KEY
# - SPONSOR_PRIVATE_KEY
# - SUI_NETWORK

pnpm dev
```

### 3. Frontend Setup

```bash
cd frontend
pnpm install

# Create .env file
cp .env.example .env
# Add your configuration:
# - VITE_BACKEND_URL
# - VITE_ENOKI_API_KEY
# - VITE_GOOGLE_CLIENT_ID
# - VITE_REDIRECT_URL

pnpm dev
```

## 📚 Documentation

- [Backend Setup Guide](./backend/QUICKSTART.md)
- [Enoki Integration](./ENOKI_SETUP.md)
- [Comments Implementation](./COMMENTS_IMPLEMENTATION.md)
- [Frontend Enoki Guide](./frontend/ENOKI_INTEGRATION.md)

## 🔐 Security

- All user transactions are sponsored via Enoki
- zkLogin provides secure authentication without seed phrases
- Smart contract enforces ownership checks
- Environment variables for sensitive data

## 🛣️ Roadmap

- [x] User profiles and authentication
- [x] Post creation and feed
- [x] Like system
- [x] Follow system
- [ ] Comment system UI
- [ ] Media uploads via Walrus
- [ ] Notifications
- [ ] Direct messaging
- [ ] Advanced search
- [ ] Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 👥 Team

Built by Ghana Sui Builders

## 🔗 Links

- [Sui Documentation](https://docs.sui.io/)
- [Enoki Documentation](https://docs.enoki.mystenlabs.com/)
- [Walrus Documentation](https://docs.walrus.xyz/)

---

**Note**: This project is under active development. Some features may be incomplete or subject to change.
