import { NextResponse } from 'next/server'

import bcrypt from 'bcryptjs'

import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id_admin, nama, email, password } = body

    if (!id_admin || !nama || !email || !password) {
      return NextResponse.json({ message: 'Data tidak lengkap' }, { status: 400 })
    }

    // cek email
    const [rows]: any = await pool.execute('SELECT email_232328 FROM admin_232328 WHERE email_232328 = ?', [email])

    if (rows.length > 0) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.execute(
      `INSERT INTO admin_232328
       (id_admin_232328, nama_admin_232328, email_232328, password_232328)
       VALUES (?, ?, ?, ?)`,
      [id_admin, nama, email, hashedPassword]
    )

    return NextResponse.json({ success: true, message: 'Register berhasil' }, { status: 201 })
  } catch (err) {
    console.error(err)

    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
