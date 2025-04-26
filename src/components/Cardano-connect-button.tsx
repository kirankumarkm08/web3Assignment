"use client";

import { Button } from "@/components/ui/button";
import { useLaceWallet } from "@/providers/lace-wallet-provider";
import { Loader2, Wallet } from "lucide-react";
import { WalletInstallationGuide } from "./wallet-installation-guide";
import { useState, useEffect } from "react";

export function ConnectWalletButton() {
  const { connectWallet, disconnectWallet, connected, connecting, error } =
    useLaceWallet();
  const [hasWalletExtension, setHasWalletExtension] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    // Check if any Cardano wallet is available
    if (typeof window !== "undefined") {
      setHasWalletExtension(
        !!(window as any).cardano &&
          Object.keys((window as any).cardano).length > 0
      );
    }
  }, []);

  // If we're still checking for wallet extensions
  if (hasWalletExtension === null) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking for wallet...
      </Button>
    );
  }

  // If no wallet extensions are found
  if (hasWalletExtension === false) {
    return <WalletInstallationGuide />;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {connected ? (
        <Button onClick={disconnectWallet} variant="outline">
          <Wallet className="mr-2 h-4 w-4" />
          Disconnect Wallet
        </Button>
      ) : (
        <Button onClick={connectWallet} disabled={connecting}>
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Lace Wallet
            </>
          )}
        </Button>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
