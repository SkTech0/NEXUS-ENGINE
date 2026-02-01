/**
 * JWT generation for demo/testing only. Uses Web Crypto API (no external deps).
 * Uses dev-demo-secret — set TRUST_JWT_SECRET=dev-demo-secret in engine-trust for local testing.
 * NEVER use in production.
 */
const DEV_DEMO_SECRET = 'dev-demo-secret';

function base64UrlEncode(data: ArrayBuffer | string): string {
  const bytes =
    typeof data === 'string'
      ? new TextEncoder().encode(data)
      : new Uint8Array(data);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signHmacSha256(message: string, secret: string): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
}

/**
 * Generate a demo JWT signed with dev-demo-secret. For local/dev only.
 * Set TRUST_JWT_SECRET=dev-demo-secret in engine-trust to verify it.
 */
export async function generateDemoJwt(): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: 'demo-user',
    aud: 'nexus-engine',
    iat: now,
    exp: now + 3600,
    demo: true,
  };
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const message = `${headerB64}.${payloadB64}`;
  const sig = await signHmacSha256(message, DEV_DEMO_SECRET);
  const sigB64 = base64UrlEncode(sig);
  return `${message}.${sigB64}`;
}
