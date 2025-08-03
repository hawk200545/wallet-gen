import { useState } from "react";
import down_arrow from "../assets/down-arrow.png";

export default function MnemonicDisplay({ mnemonic }) {
  const [showMnemonic, setShowMnemonic] = useState(false);

  return (
    <div className="backdrop-blur-lg bg-white/10 p-4 rounded-3xl mb-8">
      <div className="flex justify-between">
        <div className="text-lg font-semibold">Recovery Phrase</div>
        <button onClick={() => setShowMnemonic(!showMnemonic)}>
          <img
            src={down_arrow}
            alt="toggle arrow"
            className={`w-5 h-auto transition-transform duration-200 ${
              showMnemonic ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {showMnemonic && (
        <div className="mt-4 p-4 bg-white/20 rounded-lg">
          {mnemonic ? (
            <div className="break-words font-mono text-sm">
              {mnemonic.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline-block bg-white/10 px-2 py-1 rounded m-1"
                >
                  {word}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm">No mnemonic available</p>
          )}
        </div>
      )}
    </div>
  );
}