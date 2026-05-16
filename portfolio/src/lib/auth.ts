import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-this'
const COOKIE_NAME = 'admin_token'

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { valid: boolean; payload?: jwt.JwtPayload } {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    return { valid: true, payload }
  } catch {
    return { valid: false }
  }
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) {
    // Fallback: compare directly (only for dev without hash)
    return password === (process.env.ADMIN_PASSWORD || 'admin123')
  }
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export function getAdminToken(): string | undefined {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export function isAuthenticated(): boolean {
  const token = getAdminToken()
  if (!token) return false
  const { valid } = verifyToken(token)
  return valid
}

export const AUTH_COOKIE = COOKIE_NAME
