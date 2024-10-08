import React, { useState } from 'react';

const ConnectWalletModal = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('');

  const connectWallet = async () => {
    try {
      const response = await fetch('/api/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: walletAddress }),
      });
      const data = await response.json();
      if (data.success) {
        setBalance(data.balance);
      } else {
        alert('Error fetching wallet balance.');
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Wallet Address"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
      />
      <button onClick={connectWallet}>Connect Wallet</button>
      {balance && <p>Balance: {balance} ETH</p>}
    </div>
  );
};

export default ConnectWalletModal;
