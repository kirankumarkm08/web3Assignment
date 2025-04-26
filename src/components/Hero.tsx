"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useCardanoWallet } from "@/providers/CardanoProvider";

const Hero = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Base/EVM wallet connection
  const { address: baseAddress, isConnected: isEvmConnected } = useAccount();

  // Cardano wallet connection
  const {
    connected: cardanoConnected,
    address: cardanoAddress,
    availableWallets,
    connectWallet,
    connecting,
    error,
  } = useCardanoWallet();
  const [showCardanoWallets, setShowCardanoWallets] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Log wallet connection status for debugging
    console.log("Hero component wallet status:", {
      evmConnected: isEvmConnected,
      baseAddress: baseAddress,
      cardanoConnected: cardanoConnected,
      cardanoAddress: cardanoAddress,
    });
  }, [isEvmConnected, baseAddress, cardanoConnected, cardanoAddress]);

  useEffect(() => {
    if (!isClient) return;

    // Navigate based on which wallet is connected
    if (isEvmConnected && baseAddress) {
      console.log("EVM wallet connected, navigating to /base");
      router.push("/base");
    } else if (cardanoConnected && cardanoAddress) {
      console.log("Cardano wallet connected, navigating to /cardano");
      router.push("/cardano"); // Navigate to Cardano dashboard
    }
  }, [
    baseAddress,
    isEvmConnected,
    cardanoConnected,
    cardanoAddress,
    router,
    isClient,
  ]);

  // Helper function to get wallet installation URLs
  function getWalletUrl(walletType: string): string {
    switch (walletType) {
      case "lace":
        return "https://www.lace.io/";
      case "nami":
        return "https://namiwallet.io/";
      case "eternl":
        return "https://eternl.io/";
      case "flint":
        return "https://flint-wallet.com/";
      case "yoroi":
        return "https://yoroi-wallet.com/";
      case "gero":
        return "https://gerowallet.io/";
      case "vespr":
        return "https://vespr.xyz/";
      default:
        return "https://www.cardano.org/ecosystem/wallets/";
    }
  }

  // Filter installed wallets
  const installedWallets = availableWallets.filter(
    (wallet) => wallet.installed
  );
  const noWalletsInstalled = installedWallets.length === 0;

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-16">
        <div
          className="w-full max-w-6xl bg-gradient-to-b from-[#2d2a4a] to-[#1a1a30] relative overflow-hidden"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          {/* Background stars */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-30"
                style={{
                  width: Math.random() * 2 + 1 + "px",
                  height: Math.random() * 2 + 1 + "px",
                  top: Math.random() * 100 + "%",
                  left: Math.random() * 100 + "%",
                }}
                aria-hidden="true"
              ></div>
            ))}
          </div>

          {/* Gauge element */}
          <div className="absolute top-1/4 left-[10%] opacity-80 transform -translate-y-1/2">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-yellow-500 flex items-center justify-center relative">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#1a1a30] flex items-center justify-center">
                <div
                  className="w-2 h-8 md:h-10 bg-yellow-500 absolute transform rotate-45 origin-bottom rounded-full"
                  style={{ transformOrigin: "center 75%" }}
                ></div>
              </div>
              <div className="w-full h-full rounded-full absolute">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-1.5 h-1.5 rounded-full ${
                      i < 8 ? "bg-emerald-400" : "bg-transparent"
                    }`}
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${
                        i * 15
                      }deg) translate(18px, 0) rotate(-${i * 15}deg)`,
                      transformOrigin: "center",
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Ethereum logo */}
          <div className="absolute top-1/2 right-[10%] opacity-70">
            <div className="w-20 h-20 md:w-28 md:h-28">
              <svg
                viewBox="0 0 320 512"
                className="w-full h-full text-blue-500 fill-current"
                aria-label="Ethereum Logo"
              >
                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
              </svg>
            </div>
          </div>

          {/* Cardano logo */}
          <div className="absolute bottom-1/4 left-[15%] opacity-70">
            <div className="w-16 h-16 md:w-24 md:h-24">
              <svg
                viewBox="0 0 38 38"
                className="w-full h-full text-blue-400 fill-current"
                aria-label="Cardano Logo"
              >
                <path d="M19 0C8.507 0 0 8.507 0 19s8.507 19 19 19 19-8.507 19-19S29.493 0 19 0zm0 6.526c2.792 0 5.053 2.26 5.053 5.053S21.792 16.632 19 16.632s-5.053-2.26-5.053-5.053S16.208 6.526 19 6.526zm-9.211 19c-2.792 0-5.053-2.26-5.053-5.053s2.26-5.053 5.053-5.053 5.053 2.26 5.053 5.053-2.26 5.053-5.053 5.053zm18.422 0c-2.792 0-5.053-2.26-5.053-5.053s2.26-5.053 5.053-5.053 5.053 2.26 5.053 5.053-2.26 5.053-5.053 5.053z" />
              </svg>
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col items-center text-center h-full justify-center">
            <div className="mb-2">
              <div className="w-12 h-12 mx-auto mb-2">
                <svg
                  viewBox="0 0 50 50"
                  className="w-full h-full text-yellow-500 fill-current"
                  aria-label="RARE EVO Icon"
                >
                  <path d="M25 2L37.5 15H12.5L25 2Z M5 20H45V45H5V20Z" />
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-green-300 to-emerald-400">
                  RARE EVO 2025
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 via-green-300 to-emerald-400 mx-auto mb-4"></div>
            </div>

            <h2 className="text-2xl md:text-3xl text-white font-light mb-6">
              NFT Ticket Management System
            </h2>

            <p className="text-white/80 max-w-2xl mb-10 text-center">
              Welcome to the official ticket platform for RARE EVO 2025 — the
              premier web3 and NFT event taking place August 6-10, 2025 at
              Caesar&apos;s Palace in Las Vegas, NV.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex flex-col items-center">
                <ConnectButton label="Connect Base Wallet" />
              </div>

              <div className="flex flex-col items-center">
                {!showCardanoWallets ? (
                  <button
                    onClick={() => setShowCardanoWallets(true)}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 38 38"
                      fill="currentColor"
                      aria-label="Cardano Logo"
                    >
                      <path d="M19 0C8.507 0 0 8.507 0 19s8.507 19 19 19 19-8.507 19-19S29.493 0 19 0zm0 6.526c2.792 0 5.053 2.26 5.053 5.053S21.792 16.632 19 16.632s-5.053-2.26-5.053-5.053S16.208 6.526 19 6.526zm-9.211 19c-2.792 0-5.053-2.26-5.053-5.053s2.26-5.053 5.053-5.053 5.053 2.26 5.053 5.053-2.26 5.053-5.053 5.053zm18.422 0c-2.792 0-5.053-2.26-5.053-5.053s2.26-5.053 5.053-5.053 5.053 2.26 5.053 5.053-2.26 5.053-5.053 5.053z" />
                    </svg>
                    Connect Cardano
                  </button>
                ) : (
                  <div className="bg-gray-900/70 backdrop-blur-sm p-3 rounded-lg">
                    {noWalletsInstalled ? (
                      <div className="text-center py-2">
                        <p className="text-white/80 mb-2 text-sm">
                          No Cardano wallets found. Install one:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {availableWallets.slice(0, 4).map((wallet) => (
                            <button
                              key={wallet.id}
                              className="text-white text-sm border border-white/20 hover:bg-white/10 rounded px-2 py-1 flex items-center"
                              onClick={() =>
                                window.open(getWalletUrl(wallet.id), "_blank")
                              }
                            >
                              <div className="w-4 h-4 mr-1 relative">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundImage: `url(${wallet.icon})`,
                                    backgroundSize: "cover",
                                  }}
                                ></div>
                              </div>
                              {wallet.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {installedWallets.map((wallet) => (
                          <button
                            key={wallet.id}
                            onClick={() => connectWallet(wallet.id)}
                            disabled={connecting}
                            className="w-full text-white bg-purple-700 hover:bg-purple-600 px-3 py-2 rounded flex items-center"
                          >
                            <div className="w-5 h-5 mr-2 relative">
                              <div
                                className="w-5 h-5 rounded-full"
                                style={{
                                  backgroundImage: `url(${wallet.icon})`,
                                  backgroundSize: "cover",
                                }}
                              ></div>
                            </div>
                            {wallet.name}
                          </button>
                        ))}
                      </div>
                    )}

                    {connecting && (
                      <div className="flex items-center justify-center p-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span className="text-white text-sm">
                          Connecting...
                        </span>
                      </div>
                    )}

                    {error && (
                      <p className="text-sm text-red-400 mt-2">{error}</p>
                    )}

                    <button
                      className="w-full text-white/70 hover:text-white hover:bg-white/10 mt-2 px-3 py-1 rounded text-sm"
                      onClick={() => setShowCardanoWallets(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isClient && (
              <>
                {isEvmConnected && baseAddress && (
                  <div className="mt-6 animate-pulse">
                    <p className="text-emerald-400">
                      Base wallet connected! Redirecting to Base dashboard...
                    </p>
                  </div>
                )}

                {cardanoConnected && cardanoAddress && (
                  <div className="mt-6 animate-pulse">
                    <p className="text-emerald-400">
                      Cardano wallet connected! Redirecting to Cardano
                      dashboard...
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hero;
