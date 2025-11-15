/**
 * zkLogin Types and Interfaces
 */

export interface ZkLoginSession {
  ephemeralKeyPair: string; 
  randomness: string;
  nonce: string;
  maxEpoch: number;
  userAddress?: string;
  jwt?: string;
  salt?: string;
  sub?: string;
  aud?: string;
  zkProof?: string; // Stringified ZK proof for transaction signing
  addressSeed?: string; // Address seed for signature assembly
}

export interface DecodedJWT {
  sub: string;
  aud: string | string[];
  iss: string;
  iat: number;
  exp: number;
  nonce?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export interface ZkProofResponse {
  proofPoints: {
    a: string[];
    b: string[][];
    c: string[];
  };
  issBase64Details: {
    value: string;
    indexMod4: number;
  };
  headerBase64: string;
}

export interface PartialZkLoginSignature {
  proofPoints: {
    a: string[];
    b: string[][];
    c: string[];
  };
  issBase64Details: {
    value: string;
    indexMod4: number;
  };
  headerBase64: string;
}

export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  FACEBOOK: 'facebook',
  TWITCH: 'twitch',
} as const;

export type OAuthProvider = typeof OAUTH_PROVIDERS[keyof typeof OAUTH_PROVIDERS];
