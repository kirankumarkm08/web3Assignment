// global.d.ts

interface NamiWallet {
  enable: () => Promise<void>;
  getUsedAddresses: () => Promise<string[]>;
}

interface CardanoWindow extends Window {
  cardano?: {
    nami?: NamiWallet;
  };
}

declare module "*.wasm" {
  const content: WebAssembly.Module;
  export default content;
}
