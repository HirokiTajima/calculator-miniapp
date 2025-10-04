'use client';
import { MiniKit } from '@worldcoin/minikit-js';
import { useEffect, useState } from 'react';

export default function VerifyGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('wallet_auth');
      if (savedAuth) {
        try {
          JSON.parse(savedAuth);
          setOk(true);
        } catch (e) {
          console.error('Failed to parse saved auth:', e);
          localStorage.removeItem('wallet_auth');
        }
      }
    }

    // Check if MiniKit is installed after component mount
    const checkInstalled = () => {
      const installed = MiniKit.isInstalled();
      setIsInstalled(installed);
      setIsChecking(false);
    };

    // Give MiniKit a moment to fully initialize
    const timer = setTimeout(checkInstalled, 200);
    return () => clearTimeout(timer);
  }, []);

  async function handleAuth() {
    setError(null);

    try {
      // Generate a random nonce for security
      const nonce = Math.random().toString(36).substring(2, 15);

      console.log('Starting wallet authentication with nonce:', nonce);

      // Use commandsAsync instead of commands for async/await
      const result = await MiniKit.commandsAsync.walletAuth({
        nonce,
        statement: 'Sign in to Calculator MiniApp',
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      console.log('WalletAuth full result:', JSON.stringify(result, null, 2));
      console.log('Command payload:', result.commandPayload);
      console.log('Final payload:', result.finalPayload);

      // Check finalPayload response from World App
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload = result.finalPayload as any;

      if (!payload) {
        setError('No response from World App. Please try again.');
        console.error('finalPayload is null or undefined');
        return;
      }

      if (payload.status === 'success') {
        // Success: wallet authenticated
        console.log('Authentication successful!', {
          address: payload.address,
          message: payload.message,
          signature: payload.signature,
        });

        // Store authentication state
        const authData = {
          address: payload.address,
          message: payload.message,
          signature: payload.signature,
          timestamp: Date.now(),
        };
        localStorage.setItem('wallet_auth', JSON.stringify(authData));
        setOk(true);
      } else if (payload.status === 'error') {
        // Error response from WalletAuth
        const errorCode = payload.error_code || 'unknown_error';
        const errorDetails = payload.details || '';
        setError(`Authentication error: ${errorCode}${errorDetails ? ` - ${errorDetails}` : ''}`);
        console.error('WalletAuth error:', payload);
      } else {
        // Unexpected response format
        setError(`Unexpected response format: ${JSON.stringify(payload)}`);
        console.error('Unexpected payload structure:', payload);
      }
    } catch (e) {
      console.error('Authentication exception:', e);
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(`Authentication failed: ${errorMessage}`);
    }
  }

  // Still checking MiniKit installation
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }

  // Not in World App
  if (!ok && !isInstalled) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: 20,
        fontFamily: 'system-ui',
        textAlign: 'center'
      }}>
        <h3>Open in World App</h3>
        <p>Please open this page inside World App to verify with World ID.</p>
      </div>
    );
  }

  // In World App but not authenticated yet
  if (!ok) {
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
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}
          <button
            onClick={handleAuth}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold text-xl py-5 px-10 rounded-xl transition-colors"
          >
            Sign In with Wallet
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
