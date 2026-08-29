import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// JWT Secret Key configuration
const secretStr = process.env.JWT_SECRET || '30-degree-cafe-secret-cookie-signing-key-value';
const SECRET_KEY = new TextEncoder().encode(secretStr);

/**
 * Hashes a plaintext password using bcryptjs.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compares a plaintext password against a stored bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Creates and signs a JWT session token valid for 24 hours.
 */
export async function signToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT session token and returns its payload, or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Checks for a valid auth_token cookie and returns the parsed user session payload.
 * Runs asynchronously to support Next.js App Router server components/actions.
 */
export async function getSessionUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return null;
    }
    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}
