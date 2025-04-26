"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define wallet types
export type WalletType =
  | "lace"
  | "nami"
  | "eternl"
  | "flint"
  | "yoroi"
  | "gero"
  | "vespr";

// Define wallet info
export interface WalletInfo {
  id: WalletType;
  name: string;
  icon: string;
  installed: boolean;
}

// Define the context value type
interface CardanoWalletContextType {
  wallet: any | null;
  walletType: WalletType | null;
  availableWallets: WalletInfo[];
  connecting: boolean;
  connected: boolean;
  address: string | null;
  balance: string | null;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  refreshWalletData: () => Promise<void>;
  error: string | null;
}

// Create the context with a default value
const CardanoWalletContext = createContext<CardanoWalletContextType>({
  wallet: null,
  walletType: null,
  availableWallets: [],
  connecting: false,
  connected: false,
  address: null,
  balance: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  refreshWalletData: async () => {},
  error: null,
});

// Wallet definitions
const WALLET_DEFINITIONS: Record<WalletType, { name: string; icon: string }> = {
  lace: {
    name: "Lace",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==",
  },
  nami: {
    name: "Nami",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iIzM0OUVBMyIvPjwvc3ZnPg==",
  },
  eternl: {
    name: "Eternl",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iIzBCMzU0QiIvPjwvc3ZnPg==",
  },
  flint: {
    name: "Flint",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iI0ZGODAwMCIvPjwvc3ZnPg==",
  },
  yoroi: {
    name: "Yoroi",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iIzE1NzBDRCIvPjwvc3ZnPg==",
  },
  gero: {
    name: "GeroWallet",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iI0ZGNDYwRCIvPjwvc3ZnPg==",
  },
  vespr: {
    name: "VESPR",
    icon: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMjRDMTguNjI3NCAyNCAyNCAxOC42Mjc0IDI0IDEyQzI0IDUuMzcyNTggMTguNjI3NCAwIDEyIDBDNS4zNzI1OCAwIDAgNS4zNzI1OCAwIDEyQzAgMTguNjI3NCA1LjM3MjU4IDI0IDEyIDI0WiIgZmlsbD0iIzVBMjBDQiIvPjwvc3ZnPg==",
  },
};

// Provider component
export function CardanoWalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null);
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect available wallets
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cardano = (window as any).cardano;
    if (!cardano) {
      setAvailableWallets(
        Object.entries(WALLET_DEFINITIONS).map(([id, info]) => ({
          id: id as WalletType,
          name: info.name,
          icon: info.icon,
          installed: false,
        }))
      );
      return;
    }

    // Check which wallets are installed
    const wallets = Object.entries(WALLET_DEFINITIONS).map(([id, info]) => ({
      id: id as WalletType,
      name: info.name,
      icon: info.icon,
      installed: !!cardano[id],
    }));

    setAvailableWallets(wallets);
  }, []);

  // Connect to wallet
  const connectWallet = async (type: WalletType) => {
    try {
      setConnecting(true);
      setError(null);
      console.log(`Attempting to connect to ${type} wallet...`);

      // Check if any Cardano wallet is available
      if (typeof window === "undefined") {
        console.log("Window is undefined, likely running on server");
        setError("Cannot connect to wallet during server-side rendering");
        return;
      }

      if (!(window as any).cardano) {
        console.log("No Cardano wallets found in window object");
        setError(
          "No Cardano wallets found. Please install a wallet extension."
        );
        return;
      }

      // Check if the selected wallet is available
      if (!(window as any).cardano[type]) {
        console.log(`${type} wallet not found`);
        setError(
          `${WALLET_DEFINITIONS[type].name} wallet not found. Please install the extension.`
        );
        return;
      }

      // Try to enable the wallet
      console.log(`Enabling ${type} wallet...`);
      const selectedWallet = (window as any).cardano[type];

      // Check if already enabled
      let api;
      try {
        const isEnabled = await selectedWallet.isEnabled();
        console.log(`${type} wallet already enabled:`, isEnabled);

        if (isEnabled) {
          api = await selectedWallet.enable();
        } else {
          api = await selectedWallet.enable();
        }
      } catch (enableError) {
        console.error(`Error enabling ${type} wallet:`, enableError);
        setError(
          `Failed to enable ${WALLET_DEFINITIONS[type].name} wallet: ${
            enableError instanceof Error
              ? enableError.message
              : String(enableError)
          }`
        );
        return;
      }

      console.log(`${type} wallet enabled successfully:`, api);
      setWallet(api);
      setWalletType(type);
      setConnected(true);

      // Get wallet data
      await fetchWalletData(api);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      setError(
        error instanceof Error ? error.message : "Failed to connect to wallet"
      );
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect from wallet
  const disconnectWallet = () => {
    setWallet(null);
    setWalletType(null);
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
    <CardanoWalletContext.Provider
      value={{
        wallet,
        walletType,
        availableWallets,
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
    </CardanoWalletContext.Provider>
  );
}

// Custom hook to use the wallet context
export function useCardanoWallet() {
  return useContext(CardanoWalletContext);
}
