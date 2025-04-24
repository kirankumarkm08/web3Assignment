"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define the wallet API interface based on CIP-30 standard
interface CardanoWalletAPI {
  enable: () => Promise<CardanoAPI>;
  isEnabled: () => Promise<boolean>;
  name: string;
  icon: string;
  apiVersion: string;
}

// Define the API that's returned after enabling a wallet
interface CardanoAPI {
  getNetworkId: () => Promise<number>;
  getUtxos: () => Promise<string[] | undefined>;
  getBalance: () => Promise<string>;
  getUsedAddresses: () => Promise<string[]>;
  getUnusedAddresses: () => Promise<string[]>;
  getChangeAddress: () => Promise<string>;
  getRewardAddresses: () => Promise<string[]>;
  signTx: (tx: string, partialSign: boolean) => Promise<string>;
  signData: (address: string, payload: string) => Promise<string>;
  submitTx: (tx: string) => Promise<string>;
  // Add other methods as needed
}

// Define the context value type
interface CardanoWalletContextType {
  wallet: CardanoAPI | null;
  walletName: string | null;
  connecting: boolean;
  connected: boolean;
  address: string | null;
  balance: string | null;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => void;
  refreshWalletData: () => Promise<void>;
}

// Create the context with a default value
const CardanoWalletContext = createContext<CardanoWalletContextType>({
  wallet: null,
  walletName: null,
  connecting: false,
  connected: false,
  address: null,
  balance: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshWalletData: async () => {},
});

// Provider component
export function CardanoWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<CardanoAPI | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Check if wallet was previously connected
  useEffect(() => {
    const savedWalletName = localStorage.getItem("cardanoWalletName");
    if (savedWalletName) {
      connectWallet(savedWalletName).catch(console.error);
    }
  }, []);

  // Connect to a wallet
  const connectWallet = async (walletName: string) => {
    try {
      setConnecting(true);
      console.log(`Attempting to connect to ${walletName}...`);

      // Access the wallet from the window object
      const cardanoWallets = (window as any).cardano;
      if (!cardanoWallets) {
        throw new Error(
          "No Cardano wallets found. Please install a wallet extension."
        );
      }

      const selectedWallet = cardanoWallets[walletName];
      if (!selectedWallet) {
        throw new Error(
          `${walletName} wallet not found. Please install the extension.`
        );
      }

      console.log(`${walletName} wallet found, enabling...`);
      const api = await selectedWallet.enable();
      console.log(`${walletName} wallet enabled successfully`);

      setWallet(api);
      setWalletName(walletName);
      setConnected(true);
      localStorage.setItem("cardanoWalletName", walletName);

      // Get wallet data
      await fetchWalletData(api);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      disconnectWallet();
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect from wallet
  const disconnectWallet = () => {
    setWallet(null);
    setWalletName(null);
    setConnected(false);
    setAddress(null);
    setBalance(null);
    localStorage.removeItem("cardanoWalletName");
    console.log("Wallet disconnected");
  };

  // Fetch wallet data (address and balance)
  const fetchWalletData = async (api: CardanoAPI) => {
    try {
      console.log("Fetching wallet data...");

      // Get used addresses
      const addresses = await api.getUsedAddresses();
      console.log("Used addresses:", addresses);

      if (addresses && addresses.length > 0) {
        setAddress(addresses[0]);
      }

      // Get balance
      const walletBalance = await api.getBalance();
      console.log("Wallet balance:", walletBalance);
      setBalance(walletBalance);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    }
  };

  // Refresh wallet data
  const refreshWalletData = async () => {
    if (wallet) {
      await fetchWalletData(wallet);
    }
  };

  return (
    <CardanoWalletContext.Provider
      value={{
        wallet,
        walletName,
        connecting,
        connected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        refreshWalletData,
      }}
    >
      {children}
    </CardanoWalletContext.Provider>
  );
}

// Custom hook to use the wallet context
export function useCardanoWallet() {
  return useContext(CardanoWalletContext);
}
