'use client'
import AppHeader from '@/components/AppHeader'
import VoiceField from '@/components/VoiceField'
import InternalReportDocument from '@/components/InternalReportDocument'
import {loadReport,type WorkReport} from '@/lib/report-demo'
import {createPdfObjectUrl,downloadPdf,openPdf} from '@/lib/pdf'
import {useEffect,useMemo,useState} from 'react'

const PDF_SOURCE_ID='internal-report-pdf-source'

export default function Internal(){
  const[remaining,setRemaining]=useState('')
  const[parts,setParts]=useState('')
  const[sales,setSales]=useState('')
  const[note,setNote]=useState('')
  const[travelStart,setTravelStart]=useState('08:00')
  const[travelEnd,setTravelEnd]=useState('09:00')
  const[workStart,setWorkStart]=useState('09:00')
  const[workEnd,setWorkEnd]=useState('15:30')
  const[preview,setPreview]=useState(false)
  const[done,setDone]=useState(false)
  const[pdfBusy,setPdfBusy]=useState(false)
  const[pdfError,setPdfError]=useState('')
  const[pdfUrl,setPdfUrl]=useState<string|null>(null)
  const[report,setReport]=useState<WorkReport|null>(null)

  useEffect(()=>setReport(loadReport()),[])
  useEffect(()=>()=>{if(pdfUrl)URL.revokeObjectURL(pdfUrl)},[pdfUrl])

  const pdfFilename=useMemo(()=>`${(report?.workDate||'report').replaceAll('-','')}_${(report?.hospitalName||'社内用報告書').replace(/[\\/:*?"<>|]/g,'_')}_社内用報告書.pdf`,[report])

  if(!report){
    return <><AppHeader/><main className="form-shell"><section className="form-card wide"><p className="eyebrow">LOADING</p><h1>報告書を読み込んでいます</h1></section></main></>
  }

  async function previewPdf(){
    setPdfBusy(true);setPdfError('')
    try{
      const url=await createPdfObjectUrl(PDF_SOURCE_ID)
      setPdfUrl(old=>{if(old)URL.revokeObjectURL(old);return url})
      setPreview(true)
    }catch(error){console.error(error);setPdfError('PDFの生成に失敗しました。')}
    finally{setPdfBusy(false)}
  }

  async function savePdf(){
    setPdfBusy(true);setPdfError('')
    try{await downloadPdf(PDF_SOURCE_ID,pdfFilename)}
    catch(error){console.error(error);setPdfError('PDFの保存に失敗しました。')}
    finally{setPdfBusy(false)}
  }

  async function printPdf(){
    setPdfBusy(true);setPdfError('')
    try{await openPdf(PDF_SOURCE_ID)}
    catch(error){console.error(error);setPdfError('PDFの生成に失敗しました。')}
    finally{setPdfBusy(false)}
  }

  return <>
    <AppHeader/>
    <main className="form-shell"><section className="form-card wide">
      <div className="form-title"><div><p className="eyebrow">INTERNAL REPORT</p><h1>社内用報告書 作成</h1><p>客先提出済みの内容を引き継ぎ、社内向け情報を追記します。</p></div><span className="status ok">客先提出済</span></div>
      <div className="internal-tabs" aria-label="社内用報告書の入力項目"><span className="active">1 基本情報</span><span>2 今回作業時の残作業</span><span>3 再手配の必要な部材</span><span>4 移動・作業時間</span><span>5 営業アプローチ</span><span>6 備考</span></div>
      <div className="summary-strip"><div><span>病院名</span><b>{report.hospitalName}</b></div><div><span>作業日</span><b>{report.workDate.replaceAll('-','/')}</b></div><div><span>作業者</span><b>{report.workers.join('、')}</b></div></div>
      <div className="internal-grid"><label>今回作業時の残作業<VoiceField multiline value={remaining} onChange={setRemaining} placeholder="残作業がある場合に入力"/></label><label>再手配の必要な部材<VoiceField multiline value={parts} onChange={setParts} placeholder="再手配が必要な部材を入力"/></label><label>客先への営業アプローチ<VoiceField multiline value={sales} onChange={setSales} placeholder="提案・要望などを入力"/></label><label>備考（社内への報告事項）<VoiceField multiline value={note} onChange={setNote} placeholder="社内共有事項を入力"/></label></div>
      <div className="time-entry"><h3>移動および作業時間の推移</h3><div><label>移動 <input type="time" value={travelStart} onChange={e=>setTravelStart(e.target.value)}/> ～ <input type="time" value={travelEnd} onChange={e=>setTravelEnd(e.target.value)}/></label><label>作業 <input type="time" value={workStart} onChange={e=>setWorkStart(e.target.value)}/> ～ <input type="time" value={workEnd} onChange={e=>setWorkEnd(e.target.value)}/></label></div></div>
      {done&&<div className="inline-success">✓ 社内用報告書を完了しました。</div>}
      {pdfError&&<div className="pdf-error">{pdfError}</div>}
      <div className="form-actions"><button className="secondary" disabled={pdfBusy} onClick={previewPdf}>{pdfBusy?'PDF生成中…':'PDFプレビュー'}</button><button className="secondary" disabled={pdfBusy} onClick={savePdf}>PDF保存</button><button className="secondary" disabled={pdfBusy} onClick={printPdf}>印刷</button><button className="primary" onClick={()=>setDone(true)}>社内用報告書を完了</button></div>
    </section></main>

    <div className="pdf-capture-root"><InternalReportDocument report={report} remaining={remaining} parts={parts} sales={sales} note={note} travelStart={travelStart} travelEnd={travelEnd} workStart={workStart} workEnd={workEnd} id={PDF_SOURCE_ID}/></div>

    {preview&&<div className="demo-modal-backdrop" onClick={()=>setPreview(false)}><div className="demo-modal pdf-preview-modal" onClick={e=>e.stopPropagation()}><div className="demo-modal-head"><div><p className="eyebrow">GENERATED PDF</p><h2>社内用報告書</h2></div><button onClick={()=>setPreview(false)}>×</button></div><div className="generated-pdf-frame">{pdfUrl?<iframe title="社内用報告書 PDF" src={pdfUrl}/>:<div className="pdf-loading">PDFを生成しています…</div>}</div><div className="demo-modal-actions"><button className="secondary" onClick={()=>setPreview(false)}>閉じる</button><button className="secondary" onClick={savePdf}>PDF保存</button><button className="primary" onClick={printPdf}>印刷</button></div></div></div>}
  </>
}
