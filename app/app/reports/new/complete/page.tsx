'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import AppHeader from '@/components/AppHeader'
import {loadReport,resetReport} from '@/lib/report-demo'

export default function Complete(){
  const r=useRouter()
  const [modal,setModal]=useState<'preview'|'email'|null>(null)
  const [sent,setSent]=useState(false)
  const report=typeof window!=='undefined'?loadReport():null
  return <>
    <AppHeader/>
    <main className="shell narrow"><section className="complete-card">
      <span className="complete-icon">✓</span><p className="eyebrow">COMPLETED</p>
      <h1>報告書を登録しました</h1><p>入力内容から客先提出用の報告書を作成しました。</p>
      <div className="complete-actions">
        <button className="preview-btn" onClick={()=>setModal('preview')}>報告書プレビュー</button>
        <button onClick={()=>window.print()}>印刷</button>
        <button onClick={()=>{setSent(false);setModal('email')}}>メール送信</button>
      </div>
      <div className="complete-next">
        <button onClick={()=>r.push('/internal')}>社内用報告書へ</button>
        <button onClick={()=>r.push('/reports')}>一覧へ</button>
        <button onClick={()=>r.push('/dashboard')}>ダッシュボードへ</button>
      </div>
      <button className="text-btn" onClick={()=>{resetReport();r.push('/reports/new/basic')}}>新しい報告書を作成</button>
    </section></main>

    {modal==='preview'&&<div className="demo-modal-backdrop" onClick={()=>setModal(null)}><div className="demo-modal preview-modal" onClick={e=>e.stopPropagation()}>
      <div className="demo-modal-head"><div><p className="eyebrow">PDF PREVIEW</p><h2>作業完了報告書</h2></div><button onClick={()=>setModal(null)}>×</button></div>
      <div className="report-paper">
        <h3>作 業 完 了 報 告 書</h3>
        <div className="paper-meta"><span>病院名</span><b>{report?.hospitalName||'東京中央医療センター'}</b><span>作業日</span><b>{report?.workDate||'2026-09-05'}</b><span>作業場所</span><b>{report?.workPlace||'3階 無菌病室'}</b><span>作業件名</span><b>{report?.subject||'定期保守点検'}</b></div>
        <div className="paper-section"><b>作業内容</b><p>{report?.workNote||'定期保守点検を実施しました。'}</p></div>
        <div className="paper-section"><b>報告事項</b><p>{report?.reportNote||'設備の運転状態を確認し、点検を完了しました。'}</p></div>
        <div className="paper-sign"><span>確認者</span><b>{report?.signerName||'確認者署名'}</b>{report?.signatureDataUrl&&<img src={report.signatureDataUrl} alt="確認サイン"/>}</div>
      </div>
      <div className="demo-modal-actions"><button className="secondary" onClick={()=>setModal(null)}>閉じる</button><button className="primary" onClick={()=>window.print()}>印刷</button></div>
    </div></div>}

    {modal==='email'&&<div className="demo-modal-backdrop" onClick={()=>setModal(null)}><div className="demo-modal email-modal" onClick={e=>e.stopPropagation()}>
      <div className="demo-modal-head"><div><p className="eyebrow">SEND REPORT</p><h2>メール送信</h2></div><button onClick={()=>setModal(null)}>×</button></div>
      {sent?<div className="sent-state"><span>✓</span><h3>送信しました</h3><p>デモ画面のため実際のメールは送信されません。</p></div>:<div className="email-fields">
        <label>送信先<input type="email" defaultValue="facility@example.jp"/></label>
        <label>件名<input defaultValue="作業完了報告書"/></label>
        <label>CC<input type="email" placeholder="任意"/></label>
        <label>本文<textarea defaultValue={'お世話になっております。\n作業完了報告書をお送りします。\nご確認をお願いいたします。'}/></label>
        <div className="attachment-row"><span>PDF</span><b>作業完了報告書.pdf</b></div>
      </div>}
      <div className="demo-modal-actions"><button className="secondary" onClick={()=>setModal(null)}>閉じる</button>{!sent&&<button className="primary" onClick={()=>setSent(true)}>送信</button>}</div>
    </div></div>}
  </>
}
