import { useState } from 'react';

export function Auth({ onLogin }: { onLogin: (token: string, user: any, password?: string) => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Try Register
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (res.ok) {
                // Register Success
                onLogin(data.token, data.user, password);
                return;
            }

            // 2. If User Exists (409), Try Login
            if (res.status === 409) {
                console.log("User exists, trying login...");
                const loginRes = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const loginData = await loginRes.json();

                if (loginRes.ok) {
                    // Login Success
                    onLogin(loginData.token, loginData.user, password);
                } else {
                    // Login Failed (likely wrong password)
                    throw new Error('User exists but incorrect password.');
                }
            } else {
                throw new Error(data.error || 'Failed to connect');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-sm border w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-2">Welcome to PrivateFolio</h1>
                <p className="text-gray-500 mb-6 text-sm">Create an account or login to continue.</p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">USERNAME</label>
                        <input
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none transition"
                            value={username} onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">PASSWORD</label>
                        <input
                            type="password"
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-black outline-none transition"
                            value={password} onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 disabled:opacity-50 transition"
                    >
                        {loading ? 'Processing...' : 'Get Started'}
                    </button>
                </form>
            </div>
        </div>
    );
}
