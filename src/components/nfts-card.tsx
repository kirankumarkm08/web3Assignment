"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, ImageIcon } from "lucide-react";

// Cardano NFT type
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

// Base/Ethereum NFT type
export type BaseNFT = {
  identifier: string;
  name?: string;
  description?: string;
  image_url?: string;
  contract: string;
  id: string;
  collection?: {
    name?: string;
  };
  isCardano: false;
};

// Unified NFT type
export type UnifiedNFT = CardanoNFT | BaseNFT;

interface NFTCardProps {
  nft: UnifiedNFT;
}

export default function UnifiedNFTCard({ nft }: NFTCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Extract common properties based on NFT type
  let imageUrl: string | null = null;
  let name = "";
  let description = "";
  let collectionName: string | undefined = undefined;
  let viewUrl = "";
  let copyText = "";
  let tokenId = "";

  if (nft.isCardano) {
    // Cardano NFT
    const cardanoNft = nft as CardanoNFT;
    imageUrl = cardanoNft.image_url;
    name = cardanoNft.name || `NFT #${cardanoNft.tokenId}`;
    description = cardanoNft.description || "";
    collectionName = cardanoNft.collection;
    viewUrl = `https://pool.pm/${cardanoNft.fingerprint}`;
    copyText = cardanoNft.asset;
    tokenId = cardanoNft.tokenId;
  } else {
    // Base/Ethereum NFT
    const baseNft = nft as BaseNFT;
    imageUrl = baseNft.image_url || null;
    name = baseNft.name || `NFT #${baseNft.identifier}`;
    description = baseNft.description || "";
    collectionName = baseNft.collection?.name;
    viewUrl = `https://basescan.org/token/${baseNft.contract}?a=${baseNft.identifier}`;
    copyText = baseNft.identifier;
    tokenId = baseNft.identifier;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="aspect-square relative bg-muted flex items-center justify-center">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={name || "NFT"}
              fill
              className="object-contain"
              onError={(e) => {
                // If image fails to load, show placeholder
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `/placeholder.svg?height=400&width=400&query=NFT`;
              }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mb-2" />
              <p>No image available</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{name}</h3>

          {collectionName && (
            <p className="text-sm text-muted-foreground">
              Collection: {collectionName}
            </p>
          )}

          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground truncate">
              {nft.isCardano ? "Token ID: " : "Token ID: "}
              {tokenId.length > 12
                ? `${tokenId.substring(0, 6)}...${tokenId.substring(
                    tokenId.length - 6
                  )}`
                : tokenId}
            </p>

            <div className="mt-3 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(viewUrl, "_blank")}
                className="text-xs"
              >
                View
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(copyText)}
                className="text-xs"
              >
                Copy ID
                <Copy className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
