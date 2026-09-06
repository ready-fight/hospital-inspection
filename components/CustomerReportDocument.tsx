import type { ReactNode } from 'react'
import type { WorkReport } from '@/lib/report-demo'

function formatDate(value: string) {
  if (!value) return '—'
  return value.replaceAll('-', '/')
}

function nonZeroEntries(values: Record<string, number>) {
  return Object.entries(values).filter(([, count]) => Number(count) > 0)
}

const confirmationLabels = ['予定の作業はすべて終了しました','作業前の状態に復旧したことを確認しました','確認事項3','確認事項4','確認事項5']

export default function CustomerReportDocument({ report, id = 'customer-report-pdf-source' }:{ report: WorkReport, id?: string }) {
  const workItems = nonZeroEntries(report.workItems)
  const parts = nonZeroEntries(report.parts)

  return (
    <section id={id} className="pdf-document pdf-customer-document" aria-hidden="true">
      <div className="pdf-doc-header">
        <div>
          <p>WORK COMPLETION REPORT</p>
          <h1>作 業 完 了 報 告 書</h1>
        </div>
        <span>No. {report.id.replace('RPT-','')}</span>
      </div>

      <div className="pdf-meta-grid">
        <span>作成日</span><b>{formatDate(report.createdDate)}</b>
        <span>病院名</span><b>{report.hospitalName || '—'}</b>
        <span>作業日</span><b>{formatDate(report.workDate)}</b>
        <span>作業場所</span><b>{report.workPlace || '—'}</b>
        <span>作業者</span><b>{report.workers.length ? report.workers.join('、') : '—'}</b>
        <span>作業件名</span><b>{report.subject || '—'}</b>
      </div>

      <ReportSection title="作業内容">
        {workItems.length ? (
          <div className="pdf-chip-list">
            {workItems.map(([name,count]) => <span key={name}>{name} <b>{count}</b></span>)}
          </div>
        ) : <p>対象機種の登録なし</p>}
        {report.workNote && <p className="pdf-free-note">{report.workNote}</p>}
      </ReportSection>

      <ReportSection title="交換部品">
        {parts.length ? (
          <div className="pdf-chip-list">
            {parts.map(([name,count]) => <span key={name}>{name} <b>{count}</b></span>)}
          </div>
        ) : <p>交換部品なし</p>}
        {report.freePartNote && <p className="pdf-free-note">{report.freePartNote}</p>}
      </ReportSection>

      <ReportSection title="測定値">
        <div className="pdf-measurement-table">
          <div className="pdf-measurement-head"><span>部屋名</span><span>型式</span><span>積算時間</span><span>製造No.</span><span>製造年月</span></div>
          {(report.measurements.length ? report.measurements : [{room:'—',model:'—',hours:'—',serial:'—',manufactured:'—'}]).map((row,index)=>(
            <div className="pdf-measurement-row" key={`${row.room}-${index}`}>
              <span>{row.room || '—'}</span><span>{row.model || '—'}</span><span>{row.hours || '—'}</span><span>{row.serial || '—'}</span><span>{row.manufactured || '—'}</span>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection title="報告事項">
        <p className="pdf-long-text">{report.reportNote || '特記事項なし'}</p>
      </ReportSection>

      <div className="pdf-confirmation-block">
        <div className="pdf-confirmation-list">
          <b>確認事項</b>
          {report.confirmations.map((checked,index)=><span key={index}>{checked ? '✓' : '□'} {confirmationLabels[index] || `確認事項${index+1}`}</span>)}
        </div>
        <div className="pdf-signature-block">
          <span>確認者</span>
          <b>{report.signerName || '—'}</b>
          <div className="pdf-signature-image">
            {report.signatureDataUrl ? <img src={report.signatureDataUrl} alt="確認者サイン"/> : <em>署名なし</em>}
          </div>
        </div>
      </div>

      <div className="pdf-footer">
        <span>作業完了報告書 SYSTEM</span>
        <span>Generated from registered report data</span>
      </div>
    </section>
  )
}

function ReportSection({title,children}:{title:string,children:ReactNode}) {
  return <section className="pdf-section"><h2>{title}</h2><div>{children}</div></section>
}
