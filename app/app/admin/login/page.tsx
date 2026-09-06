'use client'
import {useRouter} from 'next/navigation'

export default function AdminLogin(){
  const r=useRouter()
  return (
    <main className="login-page redesigned-login admin-redesigned-login">
      <section className="login-showcase admin-showcase">
        <div className="showcase-brand">
          <span className="showcase-mark"><i/>A</span>
          <div><small>ADMIN CONTROL</small><strong>作業完了報告書 SYSTEM</strong></div>
        </div>

        <div className="showcase-copy">
          <p className="eyebrow">ADMINISTRATION</p>
          <h1>報告・マスタを、<br/><em>一元管理。</em></h1>
          <p>提出済み報告書、ユーザー、交換部品、機種、報告事項を管理します。</p>
        </div>

        <div className="showcase-features">
          <div><span>01</span><p><b>報告書管理</b><small>完了状況・PDFを確認</small></p></div>
          <div><span>02</span><p><b>ユーザー管理</b><small>協力会社アカウントを管理</small></p></div>
          <div><span>03</span><p><b>マスタ管理</b><small>部品・機種・報告事項</small></p></div>
        </div>

        <small className="showcase-foot">ADMINISTRATION / MASTER DATA</small>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          <div className="login-heading">
            <span className="login-mini-mark admin">AD</span>
            <div><p>ADMIN PORTAL</p><h2>管理者ログイン</h2></div>
          </div>

          <p className="login-sub">システム管理者専用</p>

          <label>ユーザーID<input defaultValue="admin"/></label>
          <label>パスワード<input type="password" defaultValue="password123"/></label>

          <button className="primary login-main-btn" onClick={()=>r.push('/admin')}>
            <span>管理者ログイン</span><i>→</i>
          </button>

          <div className="login-links">
            <a href="/login">← ユーザーサイトへ戻る</a>
            <span>DEMO MODE</span>
          </div>
        </div>
      </section>
    </main>
  )
}
