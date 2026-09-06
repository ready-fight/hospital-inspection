import type { InspectionDraft } from './types'

const DB_NAME = 'hospital-inspection-db'
const DB_VERSION = 1
const STORE = 'inspections'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) {
        const store = db.createObjectStore(STORE, { keyPath: 'id' })
        store.createIndex('syncState', 'syncState', { unique: false })
        store.createIndex('updatedAt', 'updatedAt', { unique: false })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('IndexedDBを開けませんでした。'))
  })
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = run(tx.objectStore(STORE))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error ?? new Error('端末保存処理に失敗しました。'))
    tx.oncomplete = () => db.close()
    tx.onerror = () => reject(tx.error ?? new Error('端末保存処理に失敗しました。'))
  })
}

export async function saveDraft(draft: InspectionDraft) {
  await withStore('readwrite', store => store.put(draft))
}

export async function loadLatestDraft(): Promise<InspectionDraft | null> {
  const all = await withStore<InspectionDraft[]>('readonly', store => store.getAll())
  const active = all
    .filter(item => item.syncState !== 'submitted')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  return active[0] ?? null
}

export async function getSubmittedDrafts(): Promise<InspectionDraft[]> {
  const all = await withStore<InspectionDraft[]>('readonly', store => store.getAll())
  return all
    .filter(item => item.syncState === 'submitted')
    .sort((a, b) => (b.submittedAt ?? b.updatedAt).localeCompare(a.submittedAt ?? a.updatedAt))
}

export async function getQueuedDrafts(): Promise<InspectionDraft[]> {
  const all = await withStore<InspectionDraft[]>('readonly', store => store.getAll())
  return all.filter(item => item.syncState === 'queued' || item.syncState === 'failed')
}

export async function getDraft(id: string): Promise<InspectionDraft | null> {
  return (await withStore<InspectionDraft | undefined>('readonly', store => store.get(id))) ?? null
}
