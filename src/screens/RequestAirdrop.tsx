import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const RequestAirdrop = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [solAmount, setSolAmount] = useState<string>("1");
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const handleAirdrop = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    const amount = parseFloat(solAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid SOL amount");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const signature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
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
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Request Airdrop
          </h2>
          <p className="text-gray-600">
            Get SOL tokens to test your transactions on the devnet
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="solAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (SOL)
            </label>
            <div className="relative">
              <input
                id="solAmount"
                type="number"
                value={solAmount}
                onChange={(e) => setSolAmount(e.target.value)}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SOL amount"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500">SOL</span>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleAirdrop}
              disabled={loading || !publicKey}
              className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                loading || !publicKey
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Processing...
                </span>
              ) : (
                `Request ${solAmount} SOL`
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">
                Airdrop successful! Check your wallet balance.
              </p>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Note: Airdrops are only available on devnet</p>
          <p className="mt-1">Maximum 2 SOL per request</p>
        </div>
      </div>
    </div>
  );
};
