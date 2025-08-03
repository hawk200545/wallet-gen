import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";
import WalletCard from "./WalletCard";
import WalletSkeleton from "./WalletSkeleton";

export default function WalletList({
  wallets,
  activeCoin,
  loading,
  error
}) {
  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-48 bg-white/20 rounded animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WalletSkeleton />
        <WalletSkeleton />
        <WalletSkeleton />
      </div>
    </div>
  );

  if (error) return <div className="text-center py-8 text-red-400">{error}</div>;
  if (!wallets) return <div className="text-center py-8">No wallets found</div>;

  const walletData = wallets[activeCoin] || { count: 0, addresses: [] };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold mb-4 capitalize">
        {activeCoin} Wallets ({walletData.count || walletData.addresses?.length || 0})
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(walletData.addresses || Array.from({ length: walletData.count })).map((wallet, index) => (
          <WalletCard 
            key={index}
            coinType={activeCoin}
            index={index}
            wallet={wallet}
          />
        ))}
      </div>
    </div>
  );
}