export default function WalletSkeleton() {
  return (
    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="h-5 w-32 bg-white/20 rounded"></div>
          <div className="h-4 w-full bg-white/20 rounded"></div>
          <div className="h-10 w-full bg-white/20 rounded"></div>
        </div>
        <div className="h-5 w-5 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
}