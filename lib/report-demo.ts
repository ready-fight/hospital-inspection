export type WorkReport = {
  id: string
  createdDate: string
  hospitalName: string
  workDate: string
  workPlace: string
  workers: string[]
  subject: string
  workItems: Record<string, number>
  workNote: string
  parts: Record<string, number>
  freePartNote: string
  measurements: Array<{ room: string; model: string; hours: string; serial: string; manufactured: string }>
  reportNote: string
  confirmations: boolean[]
  signerName: string
  signatureDataUrl: string | null
  status: 'draft' | 'customer_submitted' | 'complete'
}

export const workModels = ['無菌病室 MIU-201','無菌病室 MIU-401','MDF','RX','LI-11','LI-12','LI-13','LI-32','LI-30','保冷庫','保温庫','アイソレーション盤']
export const replacementParts = ['プレフィルター','水フィルター','配管キット','送風機','HEPAフィルター','スイッチ','ランプ','リレー','風速切替基板','制御基板','ファン']
export const presetNotes = [
  '水フィルター等、消耗部品は交換いたしました。',
  '入口扉の動きを調整し、動作良好です。その他、特に問題ありません。',
  '室内清浄度を確認し、基準内であることを確認しました。',
]

export const createDemoReport = (): WorkReport => ({
  id: 'RPT-' + Date.now(),
  createdDate: new Date().toISOString().slice(0,10),
  hospitalName: '東京中央医療センター',
  workDate: new Date().toISOString().slice(0,10),
  workPlace: '3階 無菌病室',
  workers: ['山田 太郎'],
  subject: '定期保守点検',
  workItems: Object.fromEntries(workModels.map(x => [x, 0])),
  workNote: '',
  parts: Object.fromEntries(replacementParts.map(x => [x, 0])),
  freePartNote: '',
  measurements: [{ room:'3階 無菌病室', model:'MIU-201', hours:'1248', serial:'A10234', manufactured:'2024-04' }],
  reportNote: '',
  confirmations: [false,false,false,false,false],
  signerName: '',
  signatureDataUrl: null,
  status: 'draft',
})

const KEY='work-report-demo'
export function loadReport(): WorkReport {
  if (typeof window === 'undefined') return createDemoReport()
  try { const raw=localStorage.getItem(KEY); return raw ? JSON.parse(raw) : createDemoReport() } catch { return createDemoReport() }
}
export function saveReport(report: WorkReport){ if(typeof window!=='undefined') localStorage.setItem(KEY,JSON.stringify(report)) }
export function resetReport(){ if(typeof window!=='undefined') localStorage.removeItem(KEY) }
