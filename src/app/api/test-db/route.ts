import { NextResponse } from 'next/server'

import pool from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT 1')

    return NextResponse.json({ success: true, rows })
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
