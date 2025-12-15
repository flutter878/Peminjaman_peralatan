import { NextResponse } from 'next/server'

import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id_peminjaman, nama_peminjam, alamat } = body

    const [result] = await pool.execute(
      `INSERT INTO peminjaman_232328
       (id_peminjaman_232328, nama_peminjam_232328, alamat_232328)
       VALUES (?, ?, ?)`,
      [id_peminjaman, nama_peminjam, alamat]
    )

    return NextResponse.json({
      success: true,
      message: 'Data berhasil disimpan',
      result
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json({ success: false, message: 'Gagal insert data' }, { status: 500 })
  }
}
