import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    
    // Create user and profile
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        profile: {
          create: {
            currency: 'NGN'
          }
        }
      }
    })

    const token = await signToken({ userId: user.id })
    await setSessionCookie(token)

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
