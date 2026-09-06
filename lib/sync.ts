import { getDraft, getQueuedDrafts, saveDraft } from './offline-db'
import { submitInspection } from './appwrite'
import type { InspectionDraft, SubmissionPayload } from './types'

function payloadFromDraft(draft: InspectionDraft): SubmissionPayload {
  if (!draft.signatureDataUrl) throw new Error('サインがありません。')
  const { signatureDataUrl, syncState: _syncState, serverId: _serverId, lastError: _lastError, ...rest } = draft
  return { ...rest, signatureDataUrl }
}

export async function syncDraft(id: string): Promise<InspectionDraft> {
  const draft = await getDraft(id)
  if (!draft) throw new Error('端末保存データが見つかりません。')

  const syncing = { ...draft, syncState: 'syncing' as const, lastError: null, updatedAt: new Date().toISOString() }
  await saveDraft(syncing)

  try {
    const result = await submitInspection(payloadFromDraft(syncing))
    const submitted: InspectionDraft = {
      ...syncing,
      syncState: 'submitted',
      serverId: result.serverId,
      submittedAt: result.submittedAt,
      lastError: null,
      updatedAt: result.submittedAt
    }
    await saveDraft(submitted)
    return submitted
  } catch (error) {
    const failed: InspectionDraft = {
      ...syncing,
      syncState: 'failed',
      lastError: error instanceof Error ? error.message : '送信に失敗しました。',
      updatedAt: new Date().toISOString()
    }
    await saveDraft(failed)
    throw error
  }
}

export async function syncPendingDrafts() {
  const drafts = await getQueuedDrafts()
  const results = [] as InspectionDraft[]
  for (const draft of drafts) {
    try {
      results.push(await syncDraft(draft.id))
    } catch {
      // Keep failed entry for a later retry.
    }
  }
  return results
}
