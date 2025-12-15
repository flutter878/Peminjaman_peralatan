import { NextResponse } from 'next/server'

import pool from '@/lib/db'

// Simple migration endpoint - add gambar column if not exists
export async function GET() {
  try {
    // Check if gambar column exists
    const [columns] = (await pool.execute(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'barang_232328' AND COLUMN_NAME = 'gambar_232328'"
    )) as any

    if (Array.isArray(columns) && columns.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Kolom gambar sudah ada'
      })
    }

    // Add gambar column if not exists
    await pool.execute('ALTER TABLE barang_232328 ADD COLUMN gambar_232328 LONGBLOB AFTER deskripsi_232328')

    return NextResponse.json({
      success: true,
      message: 'Kolom gambar berhasil ditambahkan'
    })
  } catch (error: any) {
    console.error('Migration error:', error)

    return NextResponse.json({ success: false, message: error.message || 'Gagal melakukan migration' }, { status: 500 })
  }
}
