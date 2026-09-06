import type { WorkReport } from '@/lib/report-demo'

type Props = {
  report: WorkReport
  remaining: string
  parts: string
  sales: string
  note: string
  travelStart: string
  travelEnd: string
  workStart: string
  workEnd: string
  id?: string
}

export default function InternalReportDocument({ report, remaining, parts, sales, note, travelStart, travelEnd, workStart, workEnd, id='internal-report-pdf-source' }:Props) {
  return (
    <section id={id} className="pdf-document pdf-internal-document" aria-hidden="true">
      <div className="pdf-doc-header internal">
        <div><p>INTERNAL WORK REPORT</p><h1>社 内 用 報 告 書</h1></div>
        <span>No. {report.id.replace('RPT-','')}</span>
      </div>

      <div className="pdf-meta-grid">
        <span>作成日</span><b>{report.createdDate.replaceAll('-','/')}</b>
        <span>病院名</span><b>{report.hospitalName || '—'}</b>
        <span>作業日</span><b>{report.workDate.replaceAll('-','/')}</b>
        <span>作業場所</span><b>{report.workPlace || '—'}</b>
        <span>作業者</span><b>{report.workers.join('、') || '—'}</b>
        <span>作業件名</span><b>{report.subject || '—'}</b>
      </div>

      <InternalSection title="今回作業時の残作業" value={remaining}/>
      <InternalSection title="再手配の必要な部材" value={parts}/>

      <section className="pdf-section">
        <h2>移動および作業時間の推移</h2>
        <div className="pdf-time-grid">
          <span>移動</span><b>{travelStart} ～ {travelEnd}</b>
          <span>作業</span><b>{workStart} ～ {workEnd}</b>
        </div>
      </section>

      <InternalSection title="客先への営業アプローチ" value={sales}/>
      <InternalSection title="備考（社内への報告事項）" value={note}/>

      <div className="pdf-footer">
        <span>作業完了報告書 SYSTEM / INTERNAL</span>
        <span>Generated from registered report data</span>
      </div>
    </section>
  )
}

function InternalSection({title,value}:{title:string,value:string}){
  return <section className="pdf-section"><h2>{title}</h2><div><p className="pdf-long-text">{value || '特になし'}</p></div></section>
}
