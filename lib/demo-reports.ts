import type { InspectionDraft } from './types'

const base = (overrides: Partial<InspectionDraft>): InspectionDraft => ({
  id: cryptoSafeId(overrides.id ?? 'demo-report'),
  hospitalId: 'hospital-demo-001',
  hospitalName: '東京中央医療センター',
  equipmentId: 'AHU-01',
  equipmentName: '中央空調設備 AHU-01',
  inspectorId: 'demo-inspector-001',
  inspectorName: '山田 太郎',
  inspectionDate: '2026-09-05',
  items: [
    { id: 'power', label: '電源状態', result: 'ok', comment: '電源・表示ともに正常。' },
    { id: 'noise', label: '異音・振動', result: 'ok', comment: '' },
    { id: 'leak', label: '漏水・漏れ', result: 'ok', comment: '' },
    { id: 'filter', label: 'フィルター状態', result: 'ng', comment: '軽度の汚れを確認。次回交換を推奨。' },
    { id: 'operation', label: '総合動作確認', result: 'ok', comment: '運転状態に問題なし。' },
  ],
  signatureDataUrl: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22360%22%20height%3D%22120%22%20viewBox%3D%220%200%20360%20120%22%3E%0A%3Cpath%20d%3D%22M30%2076%20C55%2036%2C%2072%2094%2C%2095%2058%20S135%2088%2C%20158%2052%20S200%2090%2C%20223%2054%20S264%2082%2C%20292%2048%22%20fill%3D%22none%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3Cpath%20d%3D%22M62%2092%20C115%2098%2C%20178%2096%2C%20314%2088%22%20fill%3D%22none%22%20stroke%3D%22%231f2937%22%20stroke-width%3D%223%22%20stroke-linecap%3D%22round%22%2F%3E%0A%3C%2Fsvg%3E',
  syncState: 'submitted',
  serverId: 'demo-server-001',
  lastError: null,
  createdAt: '2026-09-05T08:35:00+09:00',
  updatedAt: '2026-09-05T09:28:00+09:00',
  submittedAt: '2026-09-05T09:28:00+09:00',
  ...overrides,
})

function cryptoSafeId(value: string) {
  return value
}

export const demoReports: InspectionDraft[] = [
  base({ id: 'demo-20260905-001' }),
  base({
    id: 'demo-20260904-002',
    hospitalId: 'hospital-demo-002',
    hospitalName: '新宿総合病院',
    equipmentId: 'PUMP-03',
    equipmentName: '給水ポンプ PUMP-03',
    inspectorName: '佐藤 健一',
    inspectionDate: '2026-09-04',
    submittedAt: '2026-09-04T15:42:00+09:00',
    updatedAt: '2026-09-04T15:42:00+09:00',
    items: [
      { id: 'power', label: '電源状態', result: 'ok', comment: '' },
      { id: 'noise', label: '異音・振動', result: 'ok', comment: '' },
      { id: 'leak', label: '漏水・漏れ', result: 'ok', comment: '' },
      { id: 'pressure', label: '圧力値', result: 'ok', comment: '規定値内。' },
      { id: 'operation', label: '総合動作確認', result: 'ok', comment: '' },
    ],
  }),
  base({
    id: 'demo-20260902-003',
    hospitalId: 'hospital-demo-003',
    hospitalName: '品川記念病院',
    equipmentId: 'GEN-02',
    equipmentName: '非常用発電設備 GEN-02',
    inspectorName: '高橋 誠',
    inspectionDate: '2026-09-02',
    submittedAt: '2026-09-02T11:17:00+09:00',
    updatedAt: '2026-09-02T11:17:00+09:00',
    items: [
      { id: 'power', label: '電源状態', result: 'ok', comment: '' },
      { id: 'fuel', label: '燃料残量', result: 'ok', comment: '残量 82%。' },
      { id: 'leak', label: '油漏れ・漏水', result: 'ok', comment: '' },
      { id: 'battery', label: 'バッテリー状態', result: 'ok', comment: '' },
      { id: 'operation', label: '試運転確認', result: 'ok', comment: '自動起動・停止ともに正常。' },
    ],
  }),
]
