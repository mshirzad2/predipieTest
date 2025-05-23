import React, { useState } from 'react';
import { TonConnectUIProvider, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { TonConnectButton } from '@tonconnect/ui-react';

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const userAddress = useTonAddress();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendTransaction = async () => {
    setLoading(true);
    setError('');
    setTxHash('');

    try {
      const transaction = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: recipient,
            amount: (parseFloat(amount) * 1e9).toString(),
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      setTxHash(result.boc);
    } catch (err) {
      setError('Error on send transaction:' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Predepie Test Task:</h1>

      <TonConnectButton />

      <p>You wallet address: {userAddress || 'Wallet not connected.'}</p>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="number"
          placeholder="Amount (TON)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ width: '300px' }}
        />
      </div>

      <button onClick={sendTransaction} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>

      {txHash && (
        <div style={{ marginTop: '10px' }}>
          <p>Transaction sent successfully.</p>
          <p>BOC: {txHash}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '10px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default function WrappedApp() {
  return (
    <TonConnectUIProvider manifestUrl="http://localhost:3000/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
  );
}
