'use client'
import Link from 'next/link'

export default function AppHeader({admin=false}:{admin?:boolean}){
  return (
    <header className={`app-header ${admin ? 'is-admin' : ''}`}>
      <div className="brand-lockup">
        <span className="brand-icon" aria-hidden="true">
          <span className="brand-sheet"/>
          <span className="brand-check">✓</span>
        </span>
        <div className="brand-copy">
          <span className="brand-overline">FIELD SERVICE</span>
          <strong>作業完了報告書</strong>
          <small>{admin ? 'ADMIN CONTROL' : 'REPORT SYSTEM'}</small>
        </div>
      </div>

      <nav>
        <Link href={admin?'/admin':'/dashboard'}>ダッシュボード</Link>
        {!admin&&<Link href="/reports">報告書一覧</Link>}
        <span className="header-demo-state"><i/>DEMO</span>
      </nav>
    </header>
  )
}
