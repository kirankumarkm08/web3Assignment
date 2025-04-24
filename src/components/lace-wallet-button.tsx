"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLaceWallet } from "@/providers/lace-wallet-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function LaceWalletButton() {
  const { connectWallet, disconnectWallet, connected, connecting, error } =
    useLaceWallet();

  // Check if Lace wallet is installed
  const isLaceInstalled =
    typeof window !== "undefined" && !!(window as any).cardano?.lace;

  if (!isLaceInstalled) {
    return (
      <div className="flex flex-col">
        <Button
          variant="outline"
          onClick={() => window.open("https://lace.io", "_blank")}
        >
          Install Lace Wallet
        </Button>
        <p className="text-xs text-muted-foreground mt-1">
          Lace wallet is required for Cardano integration
        </p>
      </div>
    );
  }

  if (connected) {
    return (
      <Button onClick={disconnectWallet} variant="outline">
        Disconnect Lace
      </Button>
    );
  }

  return (
    <div className="flex flex-col">
      <Button onClick={connectWallet} disabled={connecting}>
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          "Connect Lace Wallet"
        )}
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
