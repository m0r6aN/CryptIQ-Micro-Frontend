
// HMAC Generator with Web Crypto API
async function generateHmac(secret: string, message: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: { name: "SHA-256" } },
      false,
      ["sign"]
    );
  
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(message)
    );
  
    // Convert ArrayBuffer to Base64
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }
  