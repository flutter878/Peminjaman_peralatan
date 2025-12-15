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
      const [data] = await pool.execute('SELECT * FROM kategori_232328 WHERE kode_kategori_232328 = ?', [kode])

      return NextResponse.json({
        success: true,
        exists: Array.isArray(data) && data.length > 0
      })
    }

    if (nama) {
      // Check if nama already exists
      const [data] = await pool.execute('SELECT * FROM kategori_232328 WHERE nama_kategori_232328 = ?', [nama])

      return NextResponse.json({
        success: true,
        exists: Array.isArray(data) && data.length > 0
      })
    }

    // Get all kategori
    const [kategori] = await pool.execute('SELECT * FROM kategori_232328 ORDER BY kode_kategori_232328')

    return NextResponse.json({
      success: true,
      data: kategori
    })
  } catch (error: any) {
    console.error('GET KATEGORI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Gagal mengambil data kategori' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { kode_kategori, nama_kategori } = body

    // Validate required fields
    if (!kode_kategori || !nama_kategori) {
      return NextResponse.json({ success: false, message: 'Kode dan nama kategori harus diisi' }, { status: 400 })
    }

    // Check if kode_kategori already exists
    const [existingKode] = await pool.execute('SELECT * FROM kategori_232328 WHERE kode_kategori_232328 = ?', [
      kode_kategori
    ])

    if (Array.isArray(existingKode) && existingKode.length > 0) {
      return NextResponse.json({ success: false, message: 'Kode kategori sudah digunakan' }, { status: 409 })
    }

    // Check if nama_kategori already exists
    const [existingNama] = await pool.execute('SELECT * FROM kategori_232328 WHERE nama_kategori_232328 = ?', [
      nama_kategori
    ])

    if (Array.isArray(existingNama) && existingNama.length > 0) {
      return NextResponse.json({ success: false, message: 'Nama kategori sudah digunakan' }, { status: 409 })
    }

    // Insert kategori
    await pool.execute(
      `INSERT INTO kategori_232328
       (kode_kategori_232328, nama_kategori_232328)
       VALUES (?, ?)`,
      [kode_kategori, nama_kategori]
    )

    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: {
        kode_kategori,
        nama_kategori
      }
    })
  } catch (error: any) {
    console.error('POST KATEGORI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat menambah kategori' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { kode_kategori, nama_kategori, kode_kategori_lama } = body

    // Validate required fields
    if (!kode_kategori || !nama_kategori || !kode_kategori_lama) {
      return NextResponse.json({ success: false, message: 'Semua field harus diisi' }, { status: 400 })
    }

    // Check if new kode already exists (if kode changed)
    if (kode_kategori !== kode_kategori_lama) {
      const [existingKode] = await pool.execute('SELECT * FROM kategori_232328 WHERE kode_kategori_232328 = ?', [
        kode_kategori
      ])

      if (Array.isArray(existingKode) && existingKode.length > 0) {
        return NextResponse.json({ success: false, message: 'Kode kategori sudah digunakan' }, { status: 409 })
      }
    }

    // Check if new nama already exists (if nama changed)
    const [existingByOldKode] = await pool.execute('SELECT * FROM kategori_232328 WHERE kode_kategori_232328 = ?', [
      kode_kategori_lama
    ])

    if (Array.isArray(existingByOldKode) && existingByOldKode.length > 0) {
      const oldNama = (existingByOldKode[0] as any).nama_kategori_232328

      if (nama_kategori !== oldNama) {
        const [existingNama] = await pool.execute('SELECT * FROM kategori_232328 WHERE nama_kategori_232328 = ?', [
          nama_kategori
        ])

        if (Array.isArray(existingNama) && existingNama.length > 0) {
          return NextResponse.json({ success: false, message: 'Nama kategori sudah digunakan' }, { status: 409 })
        }
      }
    }

    // Update kategori
    await pool.execute(
      `UPDATE kategori_232328 SET kode_kategori_232328 = ?, nama_kategori_232328 = ? WHERE kode_kategori_232328 = ?`,
      [kode_kategori, nama_kategori, kode_kategori_lama]
    )

    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil diperbarui'
    })
  } catch (error: any) {
    console.error('PUT KATEGORI ERROR:', error)

    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memperbarui kategori' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { kode_kategori } = body

    // Validate required fields
    if (!kode_kategori) {
      return NextResponse.json({ success: false, message: 'Kode kategori harus diisi' }, { status: 400 })
    }

    // Delete kategori
    await pool.execute('DELETE FROM kategori_232328 WHERE kode_kategori_232328 = ?', [kode_kategori])

    return NextResponse.json({
      success: true,
      message: 'Kategori berhasil dihapus'
    })
  } catch (error: any) {
    console.error('DELETE KATEGORI ERROR:', error)

    return NextResponse.json({ success: false, message: 'Terjadi kesalahan saat menghapus kategori' }, { status: 500 })
  }
}
