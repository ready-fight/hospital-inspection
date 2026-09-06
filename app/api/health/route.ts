import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({ ok: true, service: 'hospital-inspection', timestamp: new Date().toISOString() })
}
