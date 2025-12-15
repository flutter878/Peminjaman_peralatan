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
    const [barangs]: any = await pool.execute('SELECT * FROM barang_232328 ORDER BY kode_barang_232328')

    // Convert gambar BLOB to base64
    const barangsWithBase64 = (barangs || []).map((barang: any) => ({
      ...barang,
      gambar_232328: barang.gambar_232328 ? Buffer.from(barang.gambar_232328).toString('base64') : null
    }))

    return NextResponse.json({
      success: true,
      data: barangsWithBase64
    })
  } catch (error: any) {
    console.error('GET BARANG ERROR:', error)

    return NextResponse.json({ success: false, message: 'Gagal mengambil data barang' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { kode_barang, nama_barang, kode_kategori, kode_lokasi, kondisi, status, jumlah, deskripsi, gambar } = body

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

    // Convert gambar to Buffer if provided
    let gambarBuffer = null

    if (gambar) {
      // Assume gambar is base64 string
      gambarBuffer = Buffer.from(gambar, 'base64')
    }

    // Insert barang
    await pool.execute(
      `INSERT INTO barang_232328
       (kode_barang_232328, nama_barang_232328, kode_kategori_232328, kode_lokasi_232328, kondisi_232328, status_232328, jumlah_232328, deskripsi_232328, gambar_232328)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [kode_barang, nama_barang, kode_kategori, kode_lokasi, kondisi, status, jumlah, deskripsi || null, gambarBuffer]
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

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const {
      kode_barang,
      nama_barang,
      kode_kategori,
      kode_lokasi,
      kondisi,
      status,
      jumlah,
      deskripsi,
      gambar,
      kode_barang_lama
    } = body

    // Validate required fields
    if (
      !kode_barang ||
      !nama_barang ||
      !kode_kategori ||
      !kode_lokasi ||
      !kondisi ||
      !status ||
      !jumlah ||
      !kode_barang_lama
    ) {
      return NextResponse.json({ success: false, message: 'Semua field yang diperlukan harus diisi' }, { status: 400 })
    }

    // Check if new kode_barang already exists (if kode changed)
    if (kode_barang !== kode_barang_lama) {
      const [existingBarang] = await pool.execute('SELECT * FROM barang_232328 WHERE kode_barang_232328 = ?', [
        kode_barang
      ])

      if (Array.isArray(existingBarang) && existingBarang.length > 0) {
        return NextResponse.json({ success: false, message: 'Kode barang sudah digunakan' }, { status: 409 })
      }
    }

    // Convert gambar to Buffer if provided
    let gambarBuffer = null

    if (gambar && typeof gambar === 'string' && gambar.length > 0) {
      gambarBuffer = Buffer.from(gambar, 'base64')
    }

    // If no new gambar provided, keep existing one
    if (!gambar || gambar === 'null') {
      const [existingData]: any = await pool.execute(
        'SELECT gambar_232328 FROM barang_232328 WHERE kode_barang_232328 = ?',
        [kode_barang_lama]
      )

      if (Array.isArray(existingData) && existingData.length > 0) {
        gambarBuffer = existingData[0].gambar_232328
      }
    }

    // Update barang
    await pool.execute(
      `UPDATE barang_232328
       SET kode_barang_232328 = ?, nama_barang_232328 = ?, kode_kategori_232328 = ?, kode_lokasi_232328 = ?, kondisi_232328 = ?, status_232328 = ?, jumlah_232328 = ?, deskripsi_232328 = ?, gambar_232328 = ?
       WHERE kode_barang_232328 = ?`,
      [
        kode_barang,
        nama_barang,
        kode_kategori,
        kode_lokasi,
        kondisi,
        status,
        jumlah,
        deskripsi || null,
        gambarBuffer,
        kode_barang_lama
      ]
    )

    return NextResponse.json({
      success: true,
      message: 'Barang berhasil diperbarui'
    })
  } catch (error: any) {
    console.error('PUT BARANG ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat memperbarui barang' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { kode_barang } = body

    // Validate required fields
    if (!kode_barang) {
      return NextResponse.json({ success: false, message: 'Kode barang harus diisi' }, { status: 400 })
    }

    // Delete barang
    await pool.execute('DELETE FROM barang_232328 WHERE kode_barang_232328 = ?', [kode_barang])

    return NextResponse.json({
      success: true,
      message: 'Barang berhasil dihapus'
    })
  } catch (error: any) {
    console.error('DELETE BARANG ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat menghapus barang' }, { status: 500 })
  }
}
