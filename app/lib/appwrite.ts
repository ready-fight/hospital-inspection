import { Client, Storage, TablesDB } from 'appwrite'
import type { SubmissionPayload, SubmitResult } from './types'

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
const inspectionsTableId = process.env.NEXT_PUBLIC_APPWRITE_INSPECTIONS_TABLE_ID
const bucketId = process.env.NEXT_PUBLIC_APPWRITE_SIGNATURE_BUCKET_ID

export const appwriteConfigured = Boolean(endpoint && projectId && databaseId && inspectionsTableId && bucketId)

const client = appwriteConfigured ? new Client().setEndpoint(endpoint!).setProject(projectId!) : null
const tablesDB = client ? new TablesDB(client) : null
const storage = client ? new Storage(client) : null

function dataUrlToFile(dataUrl: string, filename: string) {
  const [meta, encoded] = dataUrl.split(',')
  const mime = meta.match(/data:(.*?);base64/)?.[1] ?? 'image/png'
  const bytes = Uint8Array.from(atob(encoded), char => char.charCodeAt(0))
  return new File([bytes], filename, { type: mime })
}

async function ensureSignature(payload: SubmissionPayload) {
  if (!storage) throw new Error('Storage client is unavailable.')
  try {
    await storage.getFile({ bucketId: bucketId!, fileId: payload.id })
    return payload.id
  } catch {
    const signature = dataUrlToFile(payload.signatureDataUrl, `signature-${payload.id}.png`)
    const file = await storage.createFile({ bucketId: bucketId!, fileId: payload.id, file: signature })
    return file.$id
  }
}

export async function submitInspection(payload: SubmissionPayload): Promise<SubmitResult> {
  if (!appwriteConfigured || !tablesDB || !storage) {
    throw new Error('Appwrite接続設定が未完了です。READMEの環境変数を設定してください。')
  }

  const signatureFileId = await ensureSignature(payload)
  const submittedAt = new Date().toISOString()

  const row = await tablesDB.upsertRow({
    databaseId: databaseId!,
    tableId: inspectionsTableId!,
    rowId: payload.id,
    data: {
      clientInspectionId: payload.id,
      hospitalId: payload.hospitalId,
      hospitalName: payload.hospitalName,
      equipmentId: payload.equipmentId,
      equipmentName: payload.equipmentName,
      inspectorId: payload.inspectorId,
      inspectorName: payload.inspectorName,
      inspectionDate: payload.inspectionDate,
      itemsJson: JSON.stringify(payload.items),
      signatureFileId,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
      submittedAt
    }
  })

  return { serverId: row.$id, submittedAt }
}
