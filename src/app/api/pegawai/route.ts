import { NextResponse } from 'next/server'

import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log('BODY MASUK:', body)

    // Validate required fields
    const requiredFields = [
      'id_pegawai_232328',
      'nama_pegawai_232328',
      'jabatan_232328',
      'no_hp_232328',
      'email_232328',
      'password_232328'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Field ${field} is required` }, { status: 400 })
      }
    }

    const [result]: any = await pool.execute(
      `INSERT INTO pegawai_232328
      (id_pegawai_232328, nama_pegawai_232328, jabatan_232328, no_hp_232328, email_232328, password_232328)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        body.id_pegawai_232328,
        body.nama_pegawai_232328,
        body.jabatan_232328,
        body.no_hp_232328,
        body.email_232328,
        body.password_232328
      ]
    )

    console.log('HASIL QUERY:', result)

    return NextResponse.json({
      success: true,
      affectedRows: result.affectedRows
    })
  } catch (error: any) {
    console.error('ERROR QUERY:', error)

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
