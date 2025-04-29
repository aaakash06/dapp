import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const RequestAirdrop = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleAirdrop = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const signature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(signature);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to request airdrop"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gray-50 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Airdrop</h2>
      <p className="text-gray-600 mb-6 text-center">
        Get some SOL tokens to test your transactions on the devnet
      </p>

      <button
        onClick={handleAirdrop}
        disabled={loading || !publicKey}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          loading || !publicKey
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Processing..." : "Request 1 SOL"}
      </button>

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      {success && (
        <p className="mt-4 text-green-500 text-sm">
          Airdrop successful! Check your wallet balance.
        </p>
      )}
    </div>
  );
};
