export default function WalletGenerator({ 
  selectedCoin, 
  setSelectedCoin, 
  mnemonic, 
  onGenerate,
  isLoading
}) {

  return (
    <div className="backdrop-blur-lg bg-white/10 p-6 rounded-3xl">
      <h2 className="text-2xl font-bold mb-4 text-white">Generate New Wallet</h2>
      <div className="space-y-4">
        <div className="relative">
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 appearance-none outline-none"
          >
            <option value="bitcoin" className="bg-gray-800 text-white">Bitcoin</option>
            <option value="ethereum" className="bg-gray-800 text-white">Ethereum</option>
            <option value="solana" className="bg-gray-800 text-white">Solana</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <button
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition flex items-center justify-center disabled:bg-purple-400"
          onClick={onGenerate}
          disabled={!mnemonic || isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Generate New Wallet
            </>
          )}
        </button>
      </div>
    </div>
  );
}