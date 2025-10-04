export default function VerifyGate() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      {/* Background calculator preview */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 overflow-hidden">
        <div className="w-full max-w-sm bg-black p-4">
          <div className="h-40 w-full rounded-2xl bg-green-50 border border-green-200 mb-3 flex items-end justify-end px-4 py-3">
            <div className="text-3xl font-mono text-slate-900">0</div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {['sin', 'cos', 'tan', 'log', 'ln'].map(btn => (
              <div key={btn} className="bg-gray-500 rounded-lg py-2 text-center text-white text-sm">{btn}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {['e', 'π', 'x!', 'xʸ', '√'].map(btn => (
              <div key={btn} className="bg-gray-500 rounded-lg py-2 text-center text-white text-sm">{btn}</div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 mt-2">
            <div className="bg-red-600 rounded-lg py-4 text-center text-white">AC</div>
            <div className="bg-gray-800 rounded-lg py-4 text-center text-white">C</div>
            <div className="bg-gray-500 rounded-lg py-4 text-center text-white">(</div>
            <div className="bg-gray-500 rounded-lg py-4 text-center text-white">)</div>
            <div className="bg-gray-500 rounded-lg py-4 text-center text-white">%</div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−'].map((btn, i) => (
              <div key={i} className={`rounded-lg py-4 text-center text-white ${i % 4 === 3 ? 'bg-gray-600' : 'bg-gray-700'}`}>{btn}</div>
            ))}
            <div className="bg-gray-700 rounded-lg py-4 text-center text-white">0</div>
            <div className="bg-gray-700 rounded-lg py-4 text-center text-white">.</div>
            <div className="bg-orange-600 rounded-lg py-4 text-center text-white">=</div>
            <div className="bg-gray-600 rounded-lg py-4 text-center text-white">＋</div>
          </div>
        </div>
      </div>

      {/* Sign in overlay */}
      <div className="relative z-10 bg-black/80 backdrop-blur-xl rounded-3xl p-10 border border-gray-700 shadow-2xl">
        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xl py-5 px-10 rounded-xl transition-colors">
          Sign In with Wallet
        </button>
      </div>
    </div>
  );
}