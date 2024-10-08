import React, { useState } from 'react';

const AddExchangeAccount = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [balance, setBalance] = useState<string>('');

  const addAccount = async () => {
    try {
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey, secretKey }),
      });
      const data = await response.json();
      if (data.success) {
        setBalance(JSON.stringify(data.balance));
        alert('Exchange account connected successfully!');
      } else {
        alert('Error connecting exchange account.');
      }
    } catch (error) {
      console.error('Add account error:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <input
        type="password"
        placeholder="Secret Key"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
      />
      <button onClick={addAccount}>Add Exchange Account</button>
      {balance && <p>Balance: {balance}</p>}
    </div>
  );
};

export default AddExchangeAccount;
