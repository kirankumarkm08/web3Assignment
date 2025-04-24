// Define the Nami wallet interface with all the methods we're using
export interface NamiWalletAPI {
  enable: () => Promise<boolean>;
  isEnabled: () => Promise<boolean>;
  getVersion?: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getBalance?: () => Promise<string>;
  getNetworkId?: () => Promise<number>;
}

// Define the asset interface from Blockfrost
export interface NftAsset {
  unit: string;
  quantity: string;
}

// Define the address response from Blockfrost
export interface AddressResponse {
  address: string;
  amount: NftAsset[];
  stake_address: string;
  type: string;
  script: boolean;
}

// Define the asset response from Blockfrost
export interface AssetResponse {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata?: {
    name: string;
    description: string;
    image: string;
    [key: string]: any;
  };
  metadata?: {
    name: string;
    description: string;
    image: string;
    [key: string]: any;
  };
}

// Define the NFT metadata interface
export interface NftMetadata {
  name: string;
  description: string;
  image: string;
  assetId: string;
  [key: string]: any;
}

// Extend the Window interface to include cardano
declare global {
  interface Window {
    cardano?: {
      nami?: NamiWalletAPI;
    };
  }
}
