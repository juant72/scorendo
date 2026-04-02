import { SignJWT, jwtVerify } from 'jose';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-dev-secret-1234'
);

// We define our payload shape
export interface JWTPayload {
  sub: string; // the wallet address
  wallet: string;
  iat?: number;
  exp?: number;
}

/**
 * Verifies a Solana wallet signature.
 * 
 * @param message - The raw string message that was signed (e.g., "Sign into Scorendo: ...")
 * @param signature - The signature array/buffer string sent by the wallet, or base58 representation
 * @param publicKeyStr - The base58 string of the user's public key
 */
export function verifySignature(message: string, signature: string | Buffer | Uint8Array, publicKeyStr: string): boolean {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const pubKeyBytes = bs58.decode(publicKeyStr);
    
    // Convert signature from base58 if it's a string, or treat it as Uint8Array
    let sigBytes: Uint8Array;
    if (typeof signature === 'string') {
      try {
        sigBytes = bs58.decode(signature);
      } catch {
        // Fallback for some clients that might send comma-separated bytes as string
        if (signature.includes(',')) {
          sigBytes = new Uint8Array(signature.split(',').map(Number));
        } else {
          return false;
        }
      }
    } else {
      sigBytes = new Uint8Array(signature);
    }

    // Verify using tweetnacl
    return nacl.sign.detached.verify(messageBytes, sigBytes, pubKeyBytes);
  } catch (error) {
    console.error('Failed to verify signature:', error);
    return false;
  }
}

/**
 * Creates a JWT token for the authenticated user.
 * 
 * @param walletAddress The authenticated wallet address
 */
export async function createSessionToken(walletAddress: string): Promise<string> {
  const token = await new SignJWT({
    sub: walletAddress,
    wallet: walletAddress,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('14d') // 14 days session
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verifies a JWT token.
 * 
 * @param token The JWT token string
 */
export async function verifySessionToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Standard fixed message format to prompt the user to sign.
 */
export function buildSignMessage(nonce: string = Date.now().toString()): string {
  return `Sign into Scorendo to authenticate your wallet.

This request will not trigger a blockchain transaction or cost any gas fees.

Nonce: ${nonce}`;
}
