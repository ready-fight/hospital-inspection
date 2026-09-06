"use client"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/AppHeader"
import CustomerReportDocument from "@/components/CustomerReportDocument"
import { loadReport, resetReport, type WorkReport } from "@/lib/report-demo"
import { createPdfObjectUrl, downloadPdf, openPdf } from "@/lib/pdf"

const PDF_SOURCE_ID = "customer-report-pdf-source"

export default function Complete() {
  const r = useRouter()
  const [modal, setModal] = useState<"preview" | "email" | null>(null)
  const [sent, setSent] = useState(false)
  const [report, setReport] = useState<WorkReport | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfBusy, setPdfBusy] = useState(false)
  const [pdfError, setPdfError] = useState("")

  useEffect(() => {
    setReport(loadReport())
  }, [])
  useEffect(
    () => () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    },
    [pdfUrl],
  )

  const pdfFilename = useMemo(() => {
    const date = (
      report?.workDate ||
      report?.createdDate ||
      "report"
    ).replaceAll("-", "")
    const hospital = (report?.hospitalName || "作業完了報告書").replace(
      /[\\/:*?"<>|]/g,
      "_",
    )
    return `${date}_${hospital}_作業完了報告書.pdf`
  }, [report])

  if (!report) {
    return (
      <>
        <AppHeader />
        <main className="shell narrow">
          <section className="complete-card">
            <p className="eyebrow">LOADING</p>
            <h1>報告書を読み込んでいます</h1>
          </section>
        </main>
      </>
    )
  }

  async function generatePreview() {
    setPdfBusy(true)
    setPdfError("")
    try {
      const nextUrl = await createPdfObjectUrl(PDF_SOURCE_ID)
      setPdfUrl((old) => {
        if (old) URL.revokeObjectURL(old)
        return nextUrl
      })
      setModal("preview")
    } catch (error) {
      console.error(error)
      setPdfError("PDFの生成に失敗しました。")
    } finally {
      setPdfBusy(false)
    }
  }

  async function savePdf() {
    setPdfBusy(true)
    setPdfError("")
    try {
      await downloadPdf(PDF_SOURCE_ID, pdfFilename)
    } catch (error) {
      console.error(error)
      setPdfError("PDFの保存に失敗しました。")
    } finally {
      setPdfBusy(false)
    }
  }

  async function printPdf() {
    setPdfBusy(true)
    setPdfError("")
    try {
      await openPdf(PDF_SOURCE_ID)
    } catch (error) {
      console.error(error)
      setPdfError("PDFの生成に失敗しました。")
    } finally {
      setPdfBusy(false)
    }
  }

  async function openEmail() {
    setSent(false)
    setPdfBusy(true)
    setPdfError("")
    try {
      if (!pdfUrl) {
        const nextUrl = await createPdfObjectUrl(PDF_SOURCE_ID)
        setPdfUrl(nextUrl)
      }
      setModal("email")
    } catch (error) {
      console.error(error)
      setPdfError("添付PDFの生成に失敗しました。")
    } finally {
      setPdfBusy(false)
    }
  }

  return (
    <>
      <AppHeader />
      <main className="shell narrow">
        <section className="complete-card">
          <span className="complete-icon">✓</span>
          <p className="eyebrow">COMPLETED</p>
          <h1>報告書を登録しました</h1>
          <p>入力内容から客先提出用のPDF報告書を生成できます。</p>
          <div className="pdf-ready-note">
            <span>PDF</span>
            <div>
              <b>実データからPDF生成</b>
              <small>プレビュー・保存・印刷に対応</small>
            </div>
          </div>
          {pdfError && <div className="pdf-error">{pdfError}</div>}
          <div className="complete-actions">
            <button
              className="preview-btn"
              disabled={pdfBusy}
              onClick={generatePreview}
            >
              {pdfBusy ? "PDF生成中…" : "報告書プレビュー"}
            </button>
            <button disabled={pdfBusy} onClick={savePdf}>
              PDF保存
            </button>
            <button disabled={pdfBusy} onClick={printPdf}>
              印刷
            </button>
            <button disabled={pdfBusy} onClick={openEmail}>
              メール送信
            </button>
          </div>
          <div className="complete-next">
            <button onClick={() => r.push("/internal")}>社内用報告書へ</button>
            <button onClick={() => r.push("/reports")}>一覧へ</button>
            <button onClick={() => r.push("/dashboard")}>
              ダッシュボードへ
            </button>
          </div>
          <button
            className="text-btn"
            onClick={() => {
              resetReport()
              r.push("/reports/new/basic")
            }}
          >
            新しい報告書を作成
          </button>
        </section>
      </main>

      <div className="pdf-capture-root">
        <CustomerReportDocument report={report} id={PDF_SOURCE_ID} />
      </div>

      {modal === "preview" && (
        <div className="demo-modal-backdrop" onClick={() => setModal(null)}>
          <div
            className="demo-modal pdf-preview-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="demo-modal-head">
              <div>
                <p className="eyebrow">GENERATED PDF</p>
                <h2>作業完了報告書</h2>
              </div>
              <button onClick={() => setModal(null)}>×</button>
            </div>
            <div className="generated-pdf-frame">
              {pdfUrl ? (
                <iframe title="作業完了報告書 PDF" src={pdfUrl} />
              ) : (
                <div className="pdf-loading">PDFを生成しています…</div>
              )}
            </div>
            <div className="demo-modal-actions">
              <button className="secondary" onClick={() => setModal(null)}>
                閉じる
              </button>
              <button className="secondary" onClick={savePdf}>
                PDF保存
              </button>
              <button className="primary" onClick={printPdf}>
                印刷
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "email" && (
        <div className="demo-modal-backdrop" onClick={() => setModal(null)}>
          <div
            className="demo-modal email-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="demo-modal-head">
              <div>
                <p className="eyebrow">SEND REPORT</p>
                <h2>メール送信</h2>
              </div>
              <button onClick={() => setModal(null)}>×</button>
            </div>
            {sent ? (
              <div className="sent-state">
                <span>✓</span>
                <h3>送信しました</h3>
                <p>
                  デモ画面のため実際のメール配信は行いませんが、添付PDF自体は実際に生成されています。
                </p>
              </div>
            ) : (
              <div className="email-fields">
                <label>
                  送信先
                  <input type="email" defaultValue="facility@example.jp" />
                </label>
                <label>
                  件名
                  <input defaultValue="作業完了報告書" />
                </label>
                <label>
                  CC
                  <input type="email" placeholder="任意" />
                </label>
                <label>
                  本文
                  <textarea
                    defaultValue={
                      "お世話になっております。\n作業完了報告書をお送りします。\nご確認をお願いいたします。"
                    }
                  />
                </label>
                <button
                  type="button"
                  className="attachment-row generated-attachment"
                  onClick={savePdf}
                >
                  <span>PDF</span>
                  <b>{pdfFilename}</b>
                  <em>生成済み / 保存</em>
                </button>
              </div>
            )}
            <div className="demo-modal-actions">
              <button className="secondary" onClick={() => setModal(null)}>
                閉じる
              </button>
              {!sent && (
                <button className="primary" onClick={() => setSent(true)}>
                  送信（デモ）
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
