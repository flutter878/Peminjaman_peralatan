import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'

import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id_admin, nama, email, password } = body

    // Validate input
    if (!id_admin || !nama || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi: id_admin, nama, email, password' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Format email tidak valid' }, { status: 400 })
    }

    // Check if email exists in admin table
    let adminRows: any = null

    try {
      ;[adminRows] = await pool.execute('SELECT id_admin_232328 FROM admin_232328 WHERE email_232328 = ?', [email])
    } catch (err: any) {
      console.error('Error checking admin email:', err)
    }

    if (adminRows && adminRows.length > 0) {
      return NextResponse.json({ success: false, message: 'Email sudah terdaftar di sistem admin' }, { status: 409 })
    }

    // Check if id_admin already exists
    let adminIdCheck: any = null

    try {
      ;[adminIdCheck] = await pool.execute('SELECT id_admin_232328 FROM admin_232328 WHERE id_admin_232328 = ?', [
        id_admin
      ])
    } catch (err: any) {
      console.error('Error checking admin id:', err)
    }

    if (adminIdCheck && adminIdCheck.length > 0) {
      return NextResponse.json({ success: false, message: 'ID Admin sudah terdaftar' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new admin
    try {
      await pool.execute(
        'INSERT INTO admin_232328 (id_admin_232328, nama_admin_232328, email_232328, password_232328) VALUES (?, ?, ?, ?)',
        [id_admin, nama, email, hashedPassword]
      )
    } catch (err: any) {
      console.error('Error inserting admin:', err)
      throw err
    }

    return NextResponse.json({ success: true, message: 'Registrasi berhasil! Silakan login.' }, { status: 201 })
  } catch (err: any) {
    console.error('Register error:', err)

    // Handle specific database errors
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, message: 'Email atau ID Admin sudah terdaftar' }, { status: 409 })
    }

    if (err.code === 'ER_NO_REFERENCED_ROW') {
      return NextResponse.json({ success: false, message: 'Data referensi tidak valid' }, { status: 400 })
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
      return NextResponse.json(
        { success: false, message: 'Struktur data tidak valid. Hubungi administrator.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: false, message: err.message || 'Terjadi kesalahan server' }, { status: 500 })
  }
}
