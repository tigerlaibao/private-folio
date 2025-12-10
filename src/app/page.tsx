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
    <main className="p-8 font-mono max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">PrivateFolio</h1>
        <a href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftigerlaibao%2Fprivate-folio" target="_blank" rel="noopener noreferrer">
          <img src="https://vercel.com/button" alt="Deploy with Vercel" />
        </a>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <p>This is a playground to verify the Client-Side Encryption logic.</p>
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
