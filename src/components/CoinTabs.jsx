import BitcoinIcon from './BitcoinIcon.jsx'
import EthereumIcon from './EthereumIcon.jsx'
import SolanaIcon from './SolanaIcon.jsx'

export default function CoinTabs({ activeCoin, setActiveCoin }) {
  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => setActiveCoin("bitcoin")}
        className={`flex items-center px-4 py-2 rounded-lg transition cursor-pointer ${
          activeCoin === "bitcoin"
            ? "bg-matisse-600 text-white"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <BitcoinIcon className="w-5 h-5 mr-1" />
        Bitcoin
      </button>
      <button
        onClick={() => setActiveCoin("ethereum")}
        className={`flex items-center px-4 py-2 rounded-lg transition cursor-pointer ${
          activeCoin === "ethereum"
            ? "bg-matisse-600 text-white"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <EthereumIcon className="h-5 w-5 mr-2" />
        Ethereum
      </button>
      <button
        onClick={() => setActiveCoin("solana")}
        className={`flex items-center px-4 py-2 rounded-lg transition cursor-pointer ${
          activeCoin === "solana"
            ? "bg-matisse-600 text-white"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <SolanaIcon className="h-5 w-5 mr-2" />
        Solana
      </button>
    </div>
  );
}