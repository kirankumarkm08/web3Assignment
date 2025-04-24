"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Define the context value type
interface LaceWalletContextType {
  wallet: any | null;
  connecting: boolean;
  connected: boolean;
  address: string | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshWalletData: () => Promise<void>;
  error: string | null;
}

// Create the context with a default value
const LaceWalletContext = createContext<LaceWalletContextType>({
  wallet: null,
  connecting: false,
  connected: false,
  address: null,
  balance: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshWalletData: async () => {},
  error: null,
});

// Provider component
export function LaceWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Connect to Lace wallet
  const connectWallet = async () => {
    try {
      setConnecting(true);
      setError(null);
      console.log("Attempting to connect to Cardano wallet...");

      // Check if any Cardano wallet is available
      if (typeof window === "undefined" || !(window as any).cardano) {
        throw new Error(
          "No Cardano wallets found. Please install a wallet extension."
        );
      }

      // Log all available wallets for debugging
      const availableWallets = Object.keys((window as any).cardano);
      console.log("Available Cardano wallets:", availableWallets);

      // Check specifically for Lace wallet
      if (!(window as any).cardano.lace) {
        throw new Error(
          "Lace wallet not found. Please install the Lace extension."
        );
      }

      // Try to enable Lace wallet
      console.log("Enabling Lace wallet...");
      const laceWallet = (window as any).cardano.lace;

      // Check if already enabled
      let api;
      try {
        const isEnabled = await laceWallet.isEnabled();
        console.log("Lace wallet already enabled:", isEnabled);

        if (isEnabled) {
          api = await laceWallet.enable();
        } else {
          api = await laceWallet.enable();
        }
      } catch (enableError) {
        console.error("Error enabling Lace wallet:", enableError);
        throw new Error(
          `Failed to enable Lace wallet: ${
            enableError instanceof Error
              ? enableError.message
              : String(enableError)
          }`
        );
      }

      console.log("Lace wallet enabled successfully:", api);
      setWallet(api);
      setConnected(true);

      // Get wallet data
      await fetchWalletData(api);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError(
        error instanceof Error ? error.message : "Failed to connect to wallet"
      );
      disconnectWallet();
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect from wallet
  const disconnectWallet = () => {
    setWallet(null);
    setConnected(false);
    setAddress(null);
    setBalance(null);
    console.log("Wallet disconnected");
  };

  // Fetch wallet data (address and balance)
  const fetchWalletData = async (api: any) => {
    try {
      console.log("Fetching wallet data...");

      // Try different methods to get addresses
      let walletAddress = null;

      try {
        // First try getUsedAddresses
        const usedAddresses = await api.getUsedAddresses();
        console.log("Used addresses:", usedAddresses);
        if (usedAddresses && usedAddresses.length > 0) {
          walletAddress = usedAddresses[0];
        }
      } catch (e) {
        console.log("Error getting used addresses:", e);
      }

      // If no used addresses, try getChangeAddress
      if (!walletAddress) {
        try {
          const changeAddress = await api.getChangeAddress();
          console.log("Change address:", changeAddress);
          walletAddress = changeAddress;
        } catch (e) {
          console.log("Error getting change address:", e);
        }
      }

      // If still no address, try getRewardAddresses
      if (!walletAddress) {
        try {
          const rewardAddresses = await api.getRewardAddresses();
          console.log("Reward addresses:", rewardAddresses);
          if (rewardAddresses && rewardAddresses.length > 0) {
            walletAddress = rewardAddresses[0];
          }
        } catch (e) {
          console.log("Error getting reward addresses:", e);
        }
      }

      if (walletAddress) {
        setAddress(walletAddress);
      } else {
        console.warn("Could not get any address from wallet");
      }

      // Try to get balance
      try {
        const walletBalance = await api.getBalance();
        console.log("Wallet balance:", walletBalance);
        setBalance(walletBalance);
      } catch (e) {
        console.log("Error getting balance:", e);
      }
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
    <LaceWalletContext.Provider
      value={{
        wallet,
        connecting,
        connected,
        address,
        balance,
        connectWallet,
        disconnectWallet,
        refreshWalletData,
        error,
      }}
    >
      {children}
    </LaceWalletContext.Provider>
  );
}

// Custom hook to use the wallet context
export function useLaceWallet() {
  return useContext(LaceWalletContext);
}
