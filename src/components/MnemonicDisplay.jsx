import { useState } from "react";
import DownArrowIcon from "./DownArrowIcon";

export default function MnemonicDisplay({ mnemonic }) {
  const [showMnemonic, setShowMnemonic] = useState(false);

  return (
    <div className="backdrop-blur-lg bg-white/5 border border-matisse-200/20 px-7 py-5 rounded-xl mb-8">
      <div className="flex justify-between">
        <div className="text-lg text-primary">Recovery Phrase</div>
        <button onClick={() => setShowMnemonic(!showMnemonic)}>
          <DownArrowIcon
            className={`w-5 h-5 transition-transform duration-200  ${
              showMnemonic ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
      {showMnemonic && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg">
          {mnemonic ? (
            <div className="break-words font-mono text-sm">
              {mnemonic.split(" ").map((word, index) => (
                <span
                  key={index}
                  className="inline-block bg-white/5 text-matisse-200 border
                 border-matisse-200/40 px-2 py-1 rounded m-1"
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