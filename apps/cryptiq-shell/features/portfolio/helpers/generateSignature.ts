import crypto from 'crypto';

const generateSignature = (
  apiKey: string,
  secret: string,
  passphrase: string,
  nonce: string
): { timestamp: string; sign: string; nonce: string } => {
  const timestamp = Date.now().toString(); // Current timestamp
  const preHash = `${timestamp}${nonce}${passphrase}`;
  const hmac = crypto.createHmac('sha256', secret).update(preHash).digest('base64'); // HMAC-SHA256

  return {
    timestamp,
    sign: hmac,
    nonce,
  };
};
