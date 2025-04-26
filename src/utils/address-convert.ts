import { bech32 } from "bech32";

// This is a simplified conversion that may not work for all Cardano addresses
// due to their complex structure
export function hexToBech32(hexAddress: string): string {
  try {
    // Remove '0x' prefix if present
    const cleanHex = hexAddress.startsWith("0x")
      ? hexAddress.slice(2)
      : hexAddress;

    // Convert hex to bytes
    const bytes = Buffer.from(cleanHex, "hex");

    // Convert bytes to 5-bit words required by bech32
    const words = bech32.toWords(bytes);

    // Encode with bech32 - using 'addr' as the human-readable part for Cardano mainnet
    return bech32.encode("addr", words);
  } catch (error) {
    console.error("Error converting hex address to bech32:", error);
    throw new Error("Failed to convert address format");
  }
}

// Convert bech32 to hex
export function bech32ToHex(bech32Address: string): string {
  try {
    const decoded = bech32.decode(bech32Address);
    const data = bech32.fromWords(decoded.words);
    return Buffer.from(data).toString("hex");
  } catch (error) {
    console.error("Error converting bech32 address to hex:", error);
    throw new Error("Invalid bech32 address format");
  }
}

// Check if an address is in hex format
export function isHexAddress(address: string): boolean {
  // Check if it's a valid hex string (with or without 0x prefix)
  const hexRegex = /^(0x)?[0-9a-fA-F]+$/;
  return hexRegex.test(address);
}

// Check if an address is in bech32 format
export function isBech32Address(address: string): boolean {
  try {
    // Cardano addresses start with 'addr'
    return address.startsWith("addr") && bech32.decode(address) !== null;
  } catch {
    return false;
  }
}

// Test address that works with Blockfrost API
export const TEST_ADDRESS =
  "addr1qyy4pmcfs0uzcjq5lcw599pmjwccz34ha4kg2q7vvtdlpcud4zwtftrphzq6ah6tjuczwcvq5pgy5furtqehedjfd4wql2gxpt";
