/**
 * zkLogin Configuration
 */

export const ZKLOGIN_CONFIG = {
  // OAuth Provider configurations
  GOOGLE: {
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    AUTH_URL: 'https://accounts.google.com/o/oauth2/v2/auth',
  },

  // Sui Network Configuration
  FULLNODE_URL: import.meta.env.VITE_SUI_NETWORK_URL || 'https://fullnode.devnet.sui.io',

  // Redirect URI (must match OAuth app configuration)
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || window.location.origin,

  // Mysten Labs ZK Proving Service
  PROVER_URL: import.meta.env.VITE_PROVER_URL || 'https://prover-dev.mystenlabs.com/v1',

  // Salt Service (you should implement your own backend for production)
  SALT_SERVICE_URL: import.meta.env.VITE_SALT_SERVICE_URL || '',

  // LocalStorage keys
  STORAGE_KEYS: {
    SESSION: 'zklogin_session',
    EPHEMERAL_KEY: 'zklogin_ephemeral_key',
    MAX_EPOCH: 'zklogin_max_epoch',
    RANDOMNESS: 'zklogin_randomness',
    JWT: 'zklogin_jwt',
  },
};

// Validate required configuration
export function validateZkLoginConfig(): string[] {
  const errors: string[] = [];

  if (!ZKLOGIN_CONFIG.GOOGLE.CLIENT_ID) {
    errors.push('Missing VITE_GOOGLE_CLIENT_ID in environment variables');
  }

  return errors;
}
