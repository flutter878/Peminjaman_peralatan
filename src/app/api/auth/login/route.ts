import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'

import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, pass } = body

    // Validate required fields
    if (!email || !pass) {
      return NextResponse.json({ success: false, message: 'Email dan password harus diisi' }, { status: 400 })
    }

    // Check if user exists
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    }

    const user = users[0] as any

    // Check password
    const isPasswordValid = await bcrypt.compare(pass, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    }

    // Return user data (without password)
    const userWithoutPassword = { ...user, password: undefined }

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: userWithoutPassword
    })
  } catch (error: any) {
    console.error('LOGIN ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat login' }, { status: 500 })
  }
}
