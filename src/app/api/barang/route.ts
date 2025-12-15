import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Check if query parameter for kode exists
    const kode = req.nextUrl.searchParams.get('kode')

    if (kode) {
      // Check if kode already exists
      const [data] = await pool.execute('SELECT * FROM barang_232328 WHERE kode_barang_232328 = ?', [kode])

      return NextResponse.json({
        success: true,
        exists: Array.isArray(data) && data.length > 0
      })
    }

    // Get all barangs
    const [barangs] = await pool.execute('SELECT * FROM barang_232328 ORDER BY kode_barang_232328')

    return NextResponse.json({
      success: true,
      data: barangs
    })
  } catch (error: any) {
    console.error('GET BARANG ERROR:', error)

    return NextResponse.json({ success: false, message: 'Gagal mengambil data barang' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { kode_barang, nama_barang, kode_kategori, kode_lokasi, kondisi, status, jumlah, deskripsi } = body

    // Validate required fields
    if (!kode_barang || !nama_barang || !kode_kategori || !kode_lokasi || !kondisi || !status || !jumlah) {
      return NextResponse.json({ success: false, message: 'Semua field yang diperlukan harus diisi' }, { status: 400 })
    }

    // Check if kode_barang already exists
    const [existingBarang] = await pool.execute('SELECT * FROM barang_232328 WHERE kode_barang_232328 = ?', [
      kode_barang
    ])

    if (Array.isArray(existingBarang) && existingBarang.length > 0) {
      return NextResponse.json({ success: false, message: 'Kode barang sudah digunakan' }, { status: 409 })
    }

    // Insert barang
    await pool.execute(
      `INSERT INTO barang_232328
       (kode_barang_232328, nama_barang_232328, kode_kategori_232328, kode_lokasi_232328, kondisi_232328, status_232328, jumlah_232328, deskripsi_232328)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [kode_barang, nama_barang, kode_kategori, kode_lokasi, kondisi, status, jumlah, deskripsi || null]
    )

    return NextResponse.json({
      success: true,
      message: 'Barang berhasil ditambahkan',
      data: {
        kode_barang,
        nama_barang,
        kode_kategori,
        kode_lokasi,
        kondisi,
        status,
        jumlah,
        deskripsi
      }
    })
  } catch (error: any) {
    console.error('POST BARANG ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat menambah barang' }, { status: 500 })
  }
}
