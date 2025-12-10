'use client';

import { useState } from 'react';
import { generateSalt, deriveKey, encryptData, decryptData } from '@/lib/crypto';

export default function Home() {
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState<Uint8Array | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [inputData, setInputData] = useState('');
  const [encrypted, setEncrypted] = useState<{ ciphertext: string; iv: string } | null>(null);
  const [decrypted, setDecrypted] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleSetup = async () => {
    try {
      const s = await generateSalt();
      setSalt(s);
      const k = await deriveKey(password, s);
      setKey(k);
      addLog('Key derived successfully');
    } catch (e: any) {
      addLog('Error deriving key: ' + e.message);
      console.error(e);
    }
  };

  const handleEncrypt = async () => {
    if (!key) return;
    try {
      const data = JSON.parse(inputData);
      const enc = await encryptData(data, key);
      setEncrypted(enc);
      addLog('Encrypted: ' + JSON.stringify(enc));
    } catch (e: any) {
      addLog('Error encrypting (ensure input is valid JSON): ' + e.message);
    }
  };

  const handleDecrypt = async () => {
    if (!key || !encrypted) return;
    try {
      const dec = await decryptData(encrypted.ciphertext, encrypted.iv, key);
      setDecrypted(dec);
      addLog('Decrypted: ' + JSON.stringify(dec));
    } catch (e: any) {
      addLog('Error decrypting: ' + e.message);
    }
  };

  return (
    <main className="p-8 font-mono max-w-3xl mx-auto">
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">PrivateFolio</h1>
        <p className="text-gray-600 mb-8">Your Self-Hosted, End-to-End Encrypted Personal Finance Tracker.</p>

        <div className="bg-gray-50 border rounded-xl p-8 text-left max-w-xl mx-auto shadow-sm">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">🚀 detailed Installation Guide</h2>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold">1</div>
              <div>
                <h3 className="font-bold text-lg">Fork Repository</h3>
                <p className="text-sm text-gray-600 mb-3">Copy the source code to your own GitHub account.</p>
                <a
                  href="https://github.com/tigerlaibao/private-folio/fork"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-black text-black rounded hover:bg-gray-100 transition text-sm font-bold"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  Fork Now
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-black text-white font-bold">2</div>
              <div>
                <h3 className="font-bold text-lg">Deploy to Vercel</h3>
                <p className="text-sm text-gray-600 mb-3">Connect your new repository to Vercel.</p>
                <a
                  href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftigerlaibao%2Fprivate-folio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block hover:opacity-80 transition"
                >
                  <img src="https://vercel.com/button" alt="Deploy with Vercel" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-4">🔐 Crypto Playground (Demo)</h2>
        <p className="text-sm text-gray-600 mb-6">Below is a demonstration of the client-side encryption logic. In the real app, this happens automatically when you add assets.</p>
      </div>

      <div className="mb-8 border p-4 rounded">
        <h2 className="font-bold mb-2">1. Setup</h2>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter Master Password"
          className="border p-2 mr-2 text-black"
        />
        <button onClick={handleSetup} className="bg-blue-500 text-white p-2 rounded">
          Derive Key
        </button>
        {salt && <div className="mt-2 text-xs">Salt (bytes): {salt.join(',')}</div>}
        {key && <div className="mt-2 text-green-500">Key Ready</div>}
      </div>

      <div className="mb-8 border p-4 rounded">
        <h2 className="font-bold mb-2">2. Encrypt</h2>
        <textarea
          value={inputData}
          onChange={e => setInputData(e.target.value)}
          placeholder='{"symbol": "BTC", "amount": 1}'
          className="border p-2 w-full h-24 text-black mb-2"
        />
        <button onClick={handleEncrypt} disabled={!key} className="bg-green-500 text-white p-2 rounded disabled:opacity-50">
          Encrypt
        </button>
        {encrypted && (
          <div className="mt-2 text-xs break-all">
            <p><strong>Ciphertext:</strong> {encrypted.ciphertext}</p>
            <p><strong>IV:</strong> {encrypted.iv}</p>
          </div>
        )}
      </div>

      <div className="mb-8 border p-4 rounded">
        <h2 className="font-bold mb-2">3. Decrypt</h2>
        <button onClick={handleDecrypt} disabled={!key || !encrypted} className="bg-purple-500 text-white p-2 rounded disabled:opacity-50">
          Decrypt
        </button>
        {decrypted && (
          <div className="mt-2 bg-gray-100 text-black p-2">
            Output: {JSON.stringify(decrypted, null, 2)}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="font-bold">Logs:</h3>
        {logs.map((l, i) => <div key={i} className="text-sm">{l}</div>)}
      </div>
    </main>
  );
}
