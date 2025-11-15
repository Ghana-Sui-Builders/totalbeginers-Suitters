// Quick script to generate a new keypair for sponsor wallet
const { Ed25519Keypair } = require('@mysten/sui/keypairs/ed25519');

const keypair = Ed25519Keypair.generate();
const privateKey = keypair.getSecretKey();
const address = keypair.getPublicKey().toSuiAddress();

console.log('\n🔑 New Sponsor Wallet Generated:');
console.log('Address:', address);
console.log('Private Key:', privateKey);
console.log('\n⚠️  IMPORTANT: Fund this address with SUI on testnet!');
console.log('Add this to your .env file:');
console.log(`SPONSOR_PRIVATE_KEY=${privateKey}\n`);
