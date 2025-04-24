"use client";

import type React from "react";

import { MeshProvider } from "@meshsdk/react";
import "@rainbow-me/rainbowkit/styles.css";
import { WalletProvider } from "@/providers/web3provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function Applayout({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      <MeshProvider>
        <Navbar />
        {children}
        <Footer />
      </MeshProvider>
    </WalletProvider>
  );
}

export default Applayout;
