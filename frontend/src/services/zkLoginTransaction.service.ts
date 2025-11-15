/**
 * zkLogin Transaction Service
 * 
 * Handles transaction signing and execution using zkLogin ephemeral keypair.
 * Users pay gas from their funded wallet (funded by backend airdrop on registration).
 */

import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { deserializeEphemeralKeyPair, getZkLoginSession, assembleZkLoginSignature } from '../zklogin/utils';

const SUI_NETWORK_URL = import.meta.env.VITE_SUI_NETWORK_URL || 'https://fullnode.testnet.sui.io';

export class ZkLoginTransactionService {
  private suiClient: SuiClient;

  constructor() {
    this.suiClient = new SuiClient({ url: SUI_NETWORK_URL });
  }

  /**
   * Execute a transaction using zkLogin ephemeral keypair with Enoki gas sponsorship
   */
  async executeTransaction(tx: Transaction): Promise<any> {
    // Get stored zkLogin session
    const session = getZkLoginSession();
    if (!session || !session.ephemeralKeyPair || !session.userAddress) {
      throw new Error('No zkLogin session found. Please login first.');
    }
    
    if (!session.zkProof) {
      console.error('❌ No ZK proof found in session. Session keys:', Object.keys(session));
      throw new Error('zkLogin session incomplete. Missing ZK proof. Please LOG OUT and LOG IN AGAIN with Google to fetch ZK proof.');
    }
    
    if (!session.addressSeed) {
      console.error('❌ No address seed found in session');
      throw new Error('zkLogin session incomplete. Missing address seed. Please LOG OUT and LOG IN AGAIN.');
    }

    // Deserialize ephemeral keypair
    const ephemeralKeyPair = deserializeEphemeralKeyPair(session.ephemeralKeyPair);
    const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();

    // Set the sender
    tx.setSender(session.userAddress);

    console.log('📝 Step 1: Building transaction...');
    
    // Validate session data
    console.log('🔍 Session validation:');
    console.log('  - User Address:', session.userAddress);
    console.log('  - Ephemeral Public Key:', ephemeralPublicKey.toSuiAddress());
    console.log('  - maxEpoch:', session.maxEpoch);
    console.log('  - addressSeed:', session.addressSeed?.substring(0, 20) + '...');
    console.log('  - zkProof exists:', !!session.zkProof);
    
    // Verify the ephemeral key can derive the correct address
    // (This is just for debugging - the actual derivation is more complex with zkLogin)
    console.log('⚠️  If signature fails, the ephemeral keypair may not match the zkLogin session');
    
    // Build the full transaction (user pays gas from their funded wallet)
    const transactionBytes = await tx.build({
      client: this.suiClient,
    });

    console.log('📦 Transaction bytes length:', transactionBytes.length);

    // Sign the transaction bytes with ephemeral keypair
    const { signature: userSignature } = await ephemeralKeyPair.signTransaction(transactionBytes);
    
    console.log('📝 Ephemeral signature created');
    
    // Parse the stored ZK proof
    const zkProof = JSON.parse(session.zkProof!);
    console.log('🔍 ZK Proof validation:');
    console.log('  - proofPoints:', !!zkProof.proofPoints);
    console.log('  - issBase64Details:', !!zkProof.issBase64Details);
    console.log('  - headerBase64:', !!zkProof.headerBase64);
    
    // Assemble the full zkLogin signature
    const zkLoginSignature = assembleZkLoginSignature(
      zkProof,
      session.maxEpoch,
      session.addressSeed!,
      userSignature
    );
    
    console.log('✅ zkLogin signature assembled');
    console.log('📝 Signature details:');
    console.log('  - Type:', typeof zkLoginSignature);
    console.log('  - Length:', zkLoginSignature.length);
    console.log('  - First char:', zkLoginSignature[0]);
    console.log('  - First 50 chars:', zkLoginSignature.substring(0, 50));

    console.log('🚀 Step 3: Executing transaction...');
    console.log('  - Using signature as string (not array)');
    
    // Execute transaction directly with zkLogin signature
    // User pays gas from their funded wallet
    // Note: zkLogin signature should be a single string, not an array
    const result = await this.suiClient.executeTransactionBlock({
      transactionBlock: transactionBytes,
      signature: zkLoginSignature, // Single signature string
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    
    console.log('✅ Transaction executed successfully!');
    console.log('📊 Result:', result);
    
    return result;
  }

  /**
   * Get the Sui client instance
   */
  getSuiClient(): SuiClient {
    return this.suiClient;
  }
}

// Export singleton instance
export const zkLoginTxService = new ZkLoginTransactionService();
