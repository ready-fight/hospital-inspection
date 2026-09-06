export type InspectionResult = 'ok' | 'ng' | 'na' | null
export type SyncState = 'draft' | 'queued' | 'syncing' | 'submitted' | 'failed'

export type InspectionItem = {
  id: string
  label: string
  result: InspectionResult
  comment: string
}

export type InspectionDraft = {
  id: string
  hospitalId: string
  hospitalName: string
  equipmentId: string
  equipmentName: string
  inspectorId: string | null
  inspectorName: string
  inspectionDate: string
  items: InspectionItem[]
  signatureDataUrl: string | null
  syncState: SyncState
  serverId: string | null
  lastError: string | null
  createdAt: string
  updatedAt: string
  submittedAt: string | null
}

export type SubmissionPayload = Omit<InspectionDraft, 'signatureDataUrl' | 'syncState' | 'serverId' | 'lastError'> & {
  signatureDataUrl: string
}

export type SubmitResult = { serverId: string; submittedAt: string }
