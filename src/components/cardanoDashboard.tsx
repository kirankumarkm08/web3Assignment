"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@meshsdk/react";
import UnifiedNFTCard from "@/components/nfts-card";
import WalletInfo from "@/components/Wallet-Info";

// Update the CardanoNFT type to include isCardano property
export type CardanoNFT = {
  asset: string;
  contract: string;
  tokenId: string;
  name: string;
  description: string;
  image_url: string | null;
  collection: string;
  fingerprint: string;
  policyId: string;
  assetName: string;
  metadata: any;
  isCardano: true;
};

export default function Dashboard() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [cardanoNfts, setCardanoNfts] = useState<CardanoNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adaBalance, setAdaBalance] = useState<string>("0");
  const [disconnecting, setDisconnecting] = useState(false);

  // Use MeshSDK for Cardano wallet connection
  const { connected, connecting, wallet, address, disconnect } = useWallet();

  // Blockfrost API key
  const apiKey = "mainnetJ6y06qfLpUSID7NyXtsRNJcXv3Clxesd";
  const testAddress =
    "addr1qyy4pmcfs0uzcjq5lcw599pmjwccz34ha4kg2q7vvtdlpcud4zwtftrphzq6ah6tjuczwcvq5pgy5furtqehedjfd4wql2gxpt";

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Process IPFS URLs to make them viewable in browser
  const processIpfsUrl = (url: string): string => {
    if (!url) return "";

    // Handle IPFS URLs
    if (url.startsWith("ipfs://")) {
      return url.replace("ipfs://", "https://ipfs.io/ipfs/");
    }

    // Handle URLs that are just CIDs
    if (url.match(/^[a-zA-Z0-9]{46}$/)) {
      return `https://ipfs.io/ipfs/${url}`;
    }

    return url;
  };

  const fetchCardanoNFTs = useCallback(async () => {
    if (!testAddress || !apiKey) {
      setError("Missing address or API key");
      return;
    }

    setLoading(true);
    setError(null);
    setCardanoNfts([]);

    try {
      // Fetch address data
      const addressResponse = await fetch(
        `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${testAddress}`,
        {
          headers: {
            project_id: apiKey,
          },
        }
      );

      if (!addressResponse.ok) {
        throw new Error(
          `Error ${addressResponse.status}: ${addressResponse.statusText}`
        );
      }

      const addressData = await addressResponse.json();

      // Set ADA balance
      const lovelace =
        addressData.amount.find((asset: any) => asset.unit === "lovelace")
          ?.quantity || "0";
      const ada = Number.parseInt(lovelace) / 1000000;
      setAdaBalance(
        ada.toLocaleString(undefined, {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })
      );

      // Filter potential NFTs (non-ADA tokens with quantity of 1)
      const potentialNfts = addressData.amount.filter(
        (asset: any) => asset.unit !== "lovelace" && asset.quantity === "1"
      );

      if (potentialNfts.length === 0) {
        setCardanoNfts([]);
        setError("No NFTs found for this Cardano address");
        setLoading(false);
        return;
      }

      // Fetch metadata for each potential NFT
      const nftPromises = potentialNfts.map(async (asset: any) => {
        try {
          // Get asset details
          const assetResponse = await fetch(
            `https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset.unit}`,
            {
              headers: {
                project_id: apiKey,
              },
            }
          );

          if (!assetResponse.ok) return null;

          const assetData = await assetResponse.json();

          // Get asset metadata
          const metadataResponse = await fetch(
            `https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset.unit}/metadata`,
            {
              headers: {
                project_id: apiKey,
              },
            }
          );

          let metadata = null;
          if (metadataResponse.ok) {
            metadata = await metadataResponse.json();
          }

          // Parse asset name
          const policyId = asset.unit.substring(0, 56);
          const assetNameHex = asset.unit.substring(56);

          let displayName = "";
          try {
            // Try to convert hex to ASCII if it's a valid text
            const assetNameBytes = Buffer.from(assetNameHex, "hex");
            displayName = assetNameBytes.toString("utf-8");
            // If it contains non-printable characters, fall back to hex
            if (!/^[\x20-\x7E]*$/.test(displayName)) {
              displayName = assetNameHex;
            }
          } catch {
            displayName = assetNameHex;
          }

          // Extract image URL from metadata
          let imageUrl = null;
          if (assetData.onchain_metadata && assetData.onchain_metadata.image) {
            imageUrl = processIpfsUrl(assetData.onchain_metadata.image);
          }

          return {
            asset: asset.unit,
            contract: policyId,
            tokenId: assetNameHex,
            name: assetData.onchain_metadata?.name || displayName,
            description: assetData.onchain_metadata?.description || "",
            image_url: imageUrl,
            collection: assetData.onchain_metadata?.collection || "",
            fingerprint: assetData.fingerprint,
            policyId,
            assetName: assetNameHex,
            metadata: assetData.onchain_metadata || {},
            isCardano: true,
          };
        } catch (error) {
          console.error("Error fetching NFT data:", error);
          return null;
        }
      });

      const nftResults = await Promise.all(nftPromises);
      const filteredNfts = nftResults.filter(
        (nft) => nft !== null
      ) as CardanoNFT[];

      setCardanoNfts(filteredNfts);

      if (filteredNfts.length === 0) {
        setError("No NFTs found for this Cardano address");
      }
    } catch (err) {
      console.error("Error fetching address data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch address information"
      );
    } finally {
      setLoading(false);
    }
  }, [apiKey, testAddress]);

  useEffect(() => {
    setIsClient(true);
    // Fetch NFTs when component mounts
    fetchCardanoNFTs();
  }, [fetchCardanoNFTs]);

  const handleDisconnect = async () => {
    setDisconnecting(true);

    try {
      // Clear state
      setCardanoNfts([]);
      setError(null);

      // If the useWallet hook provides a disconnect function, use it
      if (disconnect && typeof disconnect === "function") {
        await disconnect();

        // Optionally redirect to home page after disconnect
        // router.push("/")
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      setError("Failed to disconnect wallet. Please try again.");
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isClient) {
    return (
      <main className="container mx-auto py-20 px-4 max-w-6xl">
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-20 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cardano NFT Dashboard</h1>
      </div>

      {testAddress && (
        <div className="mb-6">
          <WalletInfo
            address={testAddress}
            networkName="Cardano Mainnet"
            balance={adaBalance}
            getExplorerUrl={(addr) => `https://cardanoscan.io/address/${addr}`}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your NFTs on Cardano</h2>

        <div className="flex gap-2">
          <Button
            onClick={fetchCardanoNFTs}
            disabled={loading || disconnecting}
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh NFTs
              </>
            )}
          </Button>
          <Button
            onClick={handleDisconnect}
            disabled={disconnecting || loading}
            variant="destructive"
          >
            {disconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </>
            )}
          </Button>
        </div>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-[300px] w-full rounded-t-md" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cardanoNfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardanoNfts.map((nft) => (
            <UnifiedNFTCard
              key={`${nft.policyId}:${nft.assetName}`}
              nft={nft}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Image
              src="/abstract-nft-concept.png"
              alt="No NFTs"
              width={100}
              height={100}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = "/placeholder.svg?height=100&width=100";
              }}
            />
            <p className="mt-4 text-center text-muted-foreground">
              No NFTs found in your Cardano wallet
            </p>
            <p className="text-sm text-center text-muted-foreground mt-2">
              Try getting some NFTs on the Cardano network or{" "}
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={fetchCardanoNFTs}
              >
                click here
              </Button>{" "}
              to refresh
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
