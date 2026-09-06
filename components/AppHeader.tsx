'use client'
import Link from 'next/link'
export default function AppHeader({admin=false}:{admin?:boolean}){
  return <header className="app-header"><div className="brand-lockup"><span className="brand-icon">✓</span><div><strong>作業完了報告書SYSTEM</strong><small>{admin?'管理者サイト':'ユーザーサイト'}</small></div></div><nav><Link href={admin?'/admin':'/dashboard'}>ダッシュボード</Link>{!admin&&<Link href="/reports">報告書一覧</Link>}<span className="demo-pill">DEMO</span></nav></header>
}
