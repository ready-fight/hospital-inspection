import type { InspectionDraft } from './types'

export function createInitialDraft(): InspectionDraft {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    hospitalId: 'hospital-demo-001',
    hospitalName: '○○総合病院',
    equipmentId: 'equipment-demo-001',
    equipmentName: '空調設備 AHU-01',
    inspectorId: null,
    inspectorName: '',
    inspectionDate: now.slice(0, 10),
    items: [
      { id: 'power', label: '電源状態', result: null, comment: '' },
      { id: 'noise', label: '異音・振動', result: null, comment: '' },
      { id: 'leak', label: '漏水・漏れ', result: null, comment: '' },
      { id: 'filter', label: 'フィルター状態', result: null, comment: '' },
      { id: 'overall', label: '総合動作確認', result: null, comment: '' }
    ],
    signatureDataUrl: null,
    syncState: 'draft',
    serverId: null,
    lastError: null,
    createdAt: now,
    updatedAt: now,
    submittedAt: null
  }
}
