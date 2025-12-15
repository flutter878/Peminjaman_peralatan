import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import pool from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    // Check if query parameter for kode exists
    const kode = req.nextUrl.searchParams.get('kode')
    const nama = req.nextUrl.searchParams.get('nama')

    if (kode) {
      // Check if kode already exists
      const [data] = await pool.execute('SELECT * FROM lokasi_penyimpanan_232328 WHERE kode_lokasi_232328 = ?', [kode])

      return NextResponse.json({
        success: true,
        exists: Array.isArray(data) && data.length > 0
      })
    }

    if (nama) {
      // Check if nama already exists
      const [data] = await pool.execute('SELECT * FROM lokasi_penyimpanan_232328 WHERE nama_lokasi_232328 = ?', [nama])

      return NextResponse.json({
        success: true,
        exists: Array.isArray(data) && data.length > 0
      })
    }

    // Get all lokasi
    const [lokasi] = await pool.execute('SELECT * FROM lokasi_penyimpanan_232328 ORDER BY kode_lokasi_232328')

    return NextResponse.json({
      success: true,
      data: lokasi
    })
  } catch (error: any) {
    console.error('GET LOKASI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Gagal mengambil data lokasi' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { kode_lokasi, nama_lokasi } = body

    // Validate required fields
    if (!kode_lokasi || !nama_lokasi) {
      return NextResponse.json({ success: false, message: 'Kode dan nama lokasi harus diisi' }, { status: 400 })
    }

    // Check if kode_lokasi already exists
    const [existingKode] = await pool.execute('SELECT * FROM lokasi_penyimpanan_232328 WHERE kode_lokasi_232328 = ?', [
      kode_lokasi
    ])

    if (Array.isArray(existingKode) && existingKode.length > 0) {
      return NextResponse.json({ success: false, message: 'Kode lokasi sudah digunakan' }, { status: 409 })
    }

    // Check if nama_lokasi already exists
    const [existingNama] = await pool.execute('SELECT * FROM lokasi_penyimpanan_232328 WHERE nama_lokasi_232328 = ?', [
      nama_lokasi
    ])

    if (Array.isArray(existingNama) && existingNama.length > 0) {
      return NextResponse.json({ success: false, message: 'Nama lokasi sudah digunakan' }, { status: 409 })
    }

    // Insert lokasi
    await pool.execute(
      `INSERT INTO lokasi_penyimpanan_232328
       (kode_lokasi_232328, nama_lokasi_232328)
       VALUES (?, ?)`,
      [kode_lokasi, nama_lokasi]
    )

    return NextResponse.json({
      success: true,
      message: 'Lokasi berhasil ditambahkan',
      data: {
        kode_lokasi,
        nama_lokasi
      }
    })
  } catch (error: any) {
    console.error('POST LOKASI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat menambah lokasi' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { kode_lokasi, nama_lokasi, kode_lokasi_lama } = body

    // Validate required fields
    if (!kode_lokasi || !nama_lokasi || !kode_lokasi_lama) {
      return NextResponse.json({ success: false, message: 'Semua field harus diisi' }, { status: 400 })
    }

    // Check if new kode already exists (if kode changed)
    if (kode_lokasi !== kode_lokasi_lama) {
      const [existingKode] = await pool.execute(
        'SELECT * FROM lokasi_penyimpanan_232328 WHERE kode_lokasi_232328 = ?',
        [kode_lokasi]
      )

      if (Array.isArray(existingKode) && existingKode.length > 0) {
        return NextResponse.json({ success: false, message: 'Kode lokasi sudah digunakan' }, { status: 409 })
      }
    }

    // Check if new nama already exists (if nama changed)
    const [existingByOldKode] = await pool.execute(
      'SELECT * FROM lokasi_penyimpanan_232328 WHERE kode_lokasi_232328 = ?',
      [kode_lokasi_lama]
    )

    if (Array.isArray(existingByOldKode) && existingByOldKode.length > 0) {
      const oldNama = (existingByOldKode[0] as any).nama_lokasi_232328

      if (nama_lokasi !== oldNama) {
        const [existingNama] = await pool.execute(
          'SELECT * FROM lokasi_penyimpanan_232328 WHERE nama_lokasi_232328 = ?',
          [nama_lokasi]
        )

        if (Array.isArray(existingNama) && existingNama.length > 0) {
          return NextResponse.json({ success: false, message: 'Nama lokasi sudah digunakan' }, { status: 409 })
        }
      }
    }

    // Update lokasi
    await pool.execute(
      `UPDATE lokasi_penyimpanan_232328 SET kode_lokasi_232328 = ?, nama_lokasi_232328 = ? WHERE kode_lokasi_232328 = ?`,
      [kode_lokasi, nama_lokasi, kode_lokasi_lama]
    )

    return NextResponse.json({
      success: true,
      message: 'Lokasi berhasil diperbarui'
    })
  } catch (error: any) {
    console.error('PUT LOKASI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat memperbarui lokasi' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { kode_lokasi } = body

    // Validate required fields
    if (!kode_lokasi) {
      return NextResponse.json({ success: false, message: 'Kode lokasi harus diisi' }, { status: 400 })
    }

    // Delete lokasi
    await pool.execute('DELETE FROM lokasi_penyimpanan_232328 WHERE kode_lokasi_232328 = ?', [kode_lokasi])

    return NextResponse.json({
      success: true,
      message: 'Lokasi berhasil dihapus'
    })
  } catch (error: any) {
    console.error('DELETE LOKASI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat menghapus lokasi' }, { status: 500 })
  }
}
