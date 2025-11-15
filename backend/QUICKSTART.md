# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Setup Environment

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your actual values
# You'll need:
# - SPONSOR_SECRET_KEY (your wallet's private key in base64)
# - PACKAGE_ID (from your Move contract deployment)
# - SPONSOR_CAP_ID (from deployment transaction)
# - REGISTRY_ID (from deployment transaction)
```

## Step 3: Get Your Sponsor Wallet Funded

If on testnet, join the [Sui Discord](https://discord.gg/sui) and use the faucet to get test SUI tokens.

## Step 4: Run the Server

```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm run build
npm start
```

## Step 5: Test the API

### Test health endpoint
```bash
curl http://localhost:3000/health
```

### Register a user
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "bio": "Hello world!",
    "image_url_str": "https://example.com/pic.jpg",
    "user_address": "0xYOUR_USER_ADDRESS"
  }'
```

### Create a post (requires JWT token)
```bash
curl -X POST http://localhost:3000/api/post \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "content": "My first post!",
    "image_url_str": ""
  }'
```

## Common Issues

### "Cannot find module" errors
Run `npm install` to install all dependencies.

### "Profile not found"
Make sure to register the user first with `/api/register`.

### Transaction fails
- Check that your sponsor wallet has SUI tokens
- Verify all environment variables are correct
- Check the contract is deployed on the correct network

## What's Next?

1. Build a frontend that calls these APIs
2. Implement real zkLogin JWT validation
3. Add more endpoints (follow, unfollow, delete post, etc.)
4. Add rate limiting and better error handling
5. Deploy to production!
