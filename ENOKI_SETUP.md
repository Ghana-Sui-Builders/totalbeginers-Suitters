# Enoki Gas Sponsorship Setup Guide

## Problem Fixed

Your zkLogin transactions were failing with "No valid gas coins found" because the zkLogin-derived address had no SUI tokens for gas fees.

**Solution**: Implemented Enoki gas sponsorship so users don't need SUI tokens - the backend sponsors all transactions!

## What Was Changed

### Backend (`/backend`)
1. **Added Enoki client initialization** - Connects to Enoki API for gas sponsorship
2. **Added `/api/sponsor` endpoint** - Sponsors transactions with Enoki (no gas needed from user)
3. **Added `/api/execute` endpoint** - Executes sponsored transactions

### Frontend (`/frontend`)
1. **Updated `zkLoginTransaction.service.ts`** - Now uses Enoki sponsorship instead of direct gas payment
2. **Updated `home.tsx`** - Simplified image handling to avoid Google rate limiting (429 errors)

## Setup Instructions

### 1. Get an Enoki API Key

1. Go to [Enoki Portal](https://portal.enoki.mystenlabs.com/)
2. Sign up / Log in
3. Create a new API key for your project
4. Copy the API key

### 2. Configure Backend

Edit `/backend/.env`:

```bash
# Add your Enoki API key
ENOKI_API_KEY=your_enoki_api_key_here

# Your contract details (should already be set)
PACKAGE_ID=0x...
REGISTRY_ID=0x...
SUI_NETWORK=testnet
PORT=3000
```

### 3. Install Dependencies (if not done)

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 4. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
pnpm dev
```

You should see:
```
✅ Enoki client initialized for gas sponsorship
✅ Suitter Backend with Enoki Gas Sponsorship
💰 Enoki: Enabled ✅
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

### 5. Test the Flow

1. **Sign in with zkLogin** (Google OAuth)
2. **Create your profile** - This will now use Enoki gas sponsorship
3. **Create posts** - All transactions are gas-free for users!

## How It Works

```
User Action (Frontend)
    ↓
1. Build transaction
    ↓
2. Request sponsorship from backend → Enoki sponsors with gas
    ↓
3. Sign sponsored transaction with zkLogin ephemeral key
    ↓
4. Execute through backend → Transaction completes!
```

**Users never need SUI tokens!** ✨

## Troubleshooting

### Backend shows "Enoki: Disabled ⚠️"
- Check that `ENOKI_API_KEY` is set in `/backend/.env`
- Restart the backend server

### "Failed to sponsor transaction" error
- Verify your Enoki API key is valid
- Check that you're on testnet (Enoki supports testnet)
- Make sure PACKAGE_ID and REGISTRY_ID are correct

### "Failed to fetch image" (429 error)
- This is expected from Google rate limiting
- The code now uses the Google image URL directly instead of uploading to Walrus
- No action needed - this is handled automatically

### Contract not found errors
- Make sure PACKAGE_ID and REGISTRY_ID in backend `.env` match your deployed contract
- Ensure the contract is deployed on the correct network (testnet)

## Next Steps

Once everything works:

1. **Add Enoki credits** - Top up your Enoki account to sponsor more transactions
2. **Monitor usage** - Check the Enoki dashboard for transaction stats
3. **Deploy to production** - Update to mainnet when ready

## Benefits of Enoki

✅ **Gasless for users** - No need to hold SUI tokens
✅ **Better UX** - Users just sign with Google
✅ **Cost control** - You control sponsorship limits
✅ **Scalable** - Enoki handles all gas management

---

**Questions?** Check the [Enoki Documentation](https://docs.mystenlabs.com/enoki)
