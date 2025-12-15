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

    // Check admin_232328 table first (admin users)
    const [admins] = await pool.execute('SELECT * FROM admin_232328 WHERE email_232328 = ?', [email])

    if (Array.isArray(admins) && admins.length > 0) {
      const admin = admins[0] as any
      const isPasswordValid = await bcrypt.compare(pass, admin.password_232328)

      if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
      }

      // Admin login success
      const response = NextResponse.json({
        success: true,
        message: 'Login berhasil',
        role: 'admin',
        data: {
          id: admin.id_admin_232328,
          nama: admin.nama_admin_232328,
          email: admin.email_232328,
          role: 'admin'
        }
      })

      // Set session cookie
      response.cookies.set(
        'user_session',
        JSON.stringify({
          id: admin.id_admin_232328,
          nama: admin.nama_admin_232328,
          email: admin.email_232328,
          role: 'admin'
        }),
        {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        }
      )

      return response
    }

    // Check users table (regular users)
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email])

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    }

    const user = users[0] as any
    const isPasswordValid = await bcrypt.compare(pass, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Email atau password salah' }, { status: 401 })
    }

    // User login success
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      role: 'user',
      data: {
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: 'user'
      }
    })

    // Set session cookie
    response.cookies.set(
      'user_session',
      JSON.stringify({
        id: user.id,
        nama: user.nama,
        email: user.email,
        role: 'user'
      }),
      {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    )

    return response
  } catch (error: any) {
    console.error('LOGIN ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat login' }, { status: 500 })
  }
}
