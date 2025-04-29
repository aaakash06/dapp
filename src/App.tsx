import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { RequestAirdrop } from "./screens/RequestAirdrop";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";

function App() {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center justify-center h-screen w-screen">
            <div className="container flex flex-col items-center justify-center w-full gap-2">
              <>
                <div className="flex justify-between gap-2">
                  <WalletMultiButton
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-white hidden"
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <WalletDisconnectButton className="bg-red-500 text-white px-4 py-2 rounded-md" />
                </div>
                <RequestAirdrop />
              </>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
