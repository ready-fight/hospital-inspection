'use client'
import {useRouter} from 'next/navigation'

export default function Login(){
  const r=useRouter()
  return (
    <main className="login-page redesigned-login">
      <section className="login-showcase">
        <div className="showcase-brand">
          <span className="showcase-mark"><i/>✓</span>
          <div><small>FIELD SERVICE</small><strong>作業完了報告書 SYSTEM</strong></div>
        </div>

        <div className="showcase-copy">
          <p className="eyebrow">WORK COMPLETION REPORT</p>
          <h1>現場の作業を、<br/><em>確実な記録へ。</em></h1>
          <p>タブレットでの入力、署名、報告書作成までを一つの流れで。</p>
        </div>

        <div className="showcase-features">
          <div><span>01</span><p><b>現場入力</b><small>タブレット操作に最適化</small></p></div>
          <div><span>02</span><p><b>端末保存</b><small>通信不安定時も入力を保持</small></p></div>
          <div><span>03</span><p><b>確認・署名</b><small>顧客確認までその場で完了</small></p></div>
        </div>

        <small className="showcase-foot">FIELD OPERATIONS / REPORT MANAGEMENT</small>
      </section>

      <section className="login-panel">
        <div className="login-panel-inner">
          <div className="login-heading">
            <span className="login-mini-mark">FR</span>
            <div><p>USER PORTAL</p><h2>ログイン</h2></div>
          </div>

          <p className="login-sub">協力会社向け 作業完了報告書システム</p>

          <label>ユーザーID<input defaultValue="TOKYO001"/></label>
          <label>パスワード<input type="password" defaultValue="password123"/></label>
          <label className="remember"><input type="checkbox" defaultChecked/>ユーザーID・パスワードを保持</label>

          <button onClick={()=>{localStorage.setItem('demo-auth','1');r.push('/dashboard')}} className="primary login-main-btn">
            <span>ログイン</span><i>→</i>
          </button>

          <div className="login-links">
            <a href="/admin/login">管理者サイトはこちら</a>
            <span>DEMO MODE</span>
          </div>
        </div>
      </section>
    </main>
  )
}
