/**
 * Walrus Service for Decentralized Storage
 * 
 * Uses the official @mysten/walrus SDK for uploading and retrieving files
 */

import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { WalrusClient } from '@mysten/walrus';
import type { Signer } from '@mysten/sui/cryptography';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export class WalrusService {
  private walrusClient: WalrusClient;
  private suiClient: SuiClient;

  constructor() {
    // Initialize Sui client
    this.suiClient = new SuiClient({
      url: import.meta.env.VITE_SUI_NETWORK_URL || getFullnodeUrl('testnet'),
    });

    // Initialize Walrus client
    this.walrusClient = new WalrusClient({
      network: 'testnet',
      suiClient: this.suiClient,
    });
  }

 //upload the image to walrus
  /**
   * Upload an image found at `imageUrl` to Walrus.
   *
   * signer: must be a valid Sui Signer (e.g. a `RawSigner` constructed from an
   * Ed25519Keypair). The account MUST be connected and funded with enough SUI/WAL
   * to pay storage/tx fees. If you pass an unsupported object the function will
   * throw a helpful error explaining how to create a RawSigner from an
   * ephemeral keypair.
   */
  async uploadImageFromUrl(imageUrl: string, signer: Signer): Promise<string> {
    try {
      console.log('Fetching image from URL:', imageUrl);
      
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      console.log('Image fetched, size:', blob.size, 'type:', blob.type);
      
      return await this.uploadBlob(blob, signer);
    } catch (error) {
      console.error('Failed to upload image from URL:', error);
      throw error;
    }
  }

//upload the blob to walrus
  /**
   * Upload a Blob to Walrus using the provided signer.
   * Throws a clear error if the signer looks invalid, with an example of how
   * to create a RawSigner from an ephemeral Ed25519Keypair (used by zkLogin).
   */
  async uploadBlob(blob: Blob, signer: Signer): Promise<string> {
    try {
      console.log('Uploading blob to Walrus via SDK...');
      
      // Convert blob to Uint8Array
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

// Write the blob to Walrus
      // Basic runtime validation of signer to produce a clear error message.
      if (!signer || typeof (signer as any).signTransaction !== 'function') {
        throw new Error([
          'Invalid signer passed to WalrusService.uploadBlob.',
          'Walrus requires a Sui Signer (e.g. a RawSigner) that can sign the',
          'storage transaction. Example to create a RawSigner from an',
          'Ed25519Keypair (ephemeral session key):',
          '',
          "import { Ed25519Keypair } from '@mysten/sui/cryptography';",
          "import { RawSigner } from '@mysten/sui';",
          "const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(...));",
          "const rawSigner = new RawSigner(keypair, this.suiClient);",
          '',
          'Then pass `rawSigner` as the signer argument.',
        ].join(' '));
      }

      const result = await this.walrusClient.writeBlob({
        blob: bytes,
        deletable: true,
        epochs: 5,
        signer,
      });
      
      console.log('Upload successful, blob ID:', result.blobId);
      
      return result.blobId;
    } catch (error) {
      console.error('Failed to upload to Walrus:', error);
      throw error;
    }
  }

//get the file from walrus
  async getFile(blobId: string): Promise<any> {
    try {
      const [file] = await this.walrusClient.getFiles({ ids: [blobId] });
      return file;
    } catch (error) {
      console.error('Failed to fetch file from Walrus:', error);
      throw error;
    }
  }

  //get the URL to retrieve a blob from Walrus aggregator
  getBlobUrl(blobId: string): string {
    const aggregatorUrl = import.meta.env.VITE_WALRUS_AGGREGATOR_URL || 'https://aggregator.walrus-testnet.walrus.space';
    return `${aggregatorUrl}/v1/${blobId}`;
  }

  /**
   * Create a Signer from a serialized ephemeral keypair (from zkLogin session).
   * 
   * @param serializedKeypair - Secret key string from zkLogin session (matches utils.serializeEphemeralKeyPair format)
   * @returns Ed25519Keypair that can be used as a Signer for Walrus uploads
   */
  createSignerFromSerializedKeypair(serializedKeypair: string): Signer {
    try {
      return Ed25519Keypair.fromSecretKey(serializedKeypair);
    } catch (error) {
      console.error('Failed to deserialize ephemeral keypair:', error);
      throw new Error('Invalid ephemeral keypair format. Cannot create signer for Walrus upload.');
    }
  }
}

export const walrusService = new WalrusService();


