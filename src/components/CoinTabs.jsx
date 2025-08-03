import { 
  CurrencyDollarIcon, 
  CurrencyEuroIcon,
  CurrencyPoundIcon 
} from "@heroicons/react/solid";

export default function CoinTabs({ activeCoin, setActiveCoin }) {
  return (
    <div className="flex space-x-2 mb-6">
      <button
        onClick={() => setActiveCoin("bitcoin")}
        className={`flex items-center px-4 py-2 rounded-lg transition ${
          activeCoin === "bitcoin" 
            ? "bg-purple-600 text-white" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
        Bitcoin
      </button>
      <button
        onClick={() => setActiveCoin("ethereum")}
        className={`flex items-center px-4 py-2 rounded-lg transition ${
          activeCoin === "ethereum" 
            ? "bg-purple-600 text-white" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <CurrencyEuroIcon className="h-5 w-5 mr-2" />
        Ethereum
      </button>
      <button
        onClick={() => setActiveCoin("solana")}
        className={`flex items-center px-4 py-2 rounded-lg transition ${
          activeCoin === "solana" 
            ? "bg-purple-600 text-white" 
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        <CurrencyPoundIcon className="h-5 w-5 mr-2" />
        Solana
      </button>
    </div>
  );
}