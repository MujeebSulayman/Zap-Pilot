import prisma from '@/lib/prisma'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev_secret_key_12345')

export async function signToken(payload: { userId: string }): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload
  } catch (err) {
    return null
  }
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('zap_session')?.value
  if (!token) return null
  const payload = await verifyToken(token)
  if (!payload || !payload.userId) return null
  
  return prisma.user.findUnique({
    where: { id: payload.userId as string },
    include: { profile: true, wallet: true }
  })
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('zap_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('zap_session')
}
