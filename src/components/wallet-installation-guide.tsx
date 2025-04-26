"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export function WalletInstallationGuide() {
  const openLaceWebsite = () => {
    window.open("https://www.lace.io/", "_blank");
  };

  const openNamiWebsite = () => {
    window.open("https://namiwallet.io/", "_blank");
  };

  const openEternlWebsite = () => {
    window.open("https://eternl.io/", "_blank");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Wallet Installation Required</CardTitle>
        <CardDescription>
          To connect to the Cardano blockchain, you need to install a wallet
          extension
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          We couldn't detect any Cardano wallet extensions in your browser.
          Please install one of the following wallets:
        </p>

        <div className="space-y-2">
          <Button
            onClick={openLaceWebsite}
            variant="outline"
            className="w-full justify-between"
          >
            Lace Wallet <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <Button
            onClick={openNamiWebsite}
            variant="outline"
            className="w-full justify-between"
          >
            Nami Wallet <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          <Button
            onClick={openEternlWebsite}
            variant="outline"
            className="w-full justify-between"
          >
            Eternl Wallet <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>

        <div className="text-sm">
          <p className="font-medium">Installation steps:</p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Click one of the wallet links above</li>
            <li>Install the browser extension from the official website</li>
            <li>Create a new wallet or restore an existing one</li>
            <li>Return to this page and refresh</li>
            <li>Click "Connect Wallet" to continue</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
