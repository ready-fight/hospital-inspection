export default function ProgressBar({ value, max }: { value: number; max: number }) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="progress-wrap" aria-label={`点検進捗 ${percent}%`}>
      <div className="progress-meta"><span>入力進捗</span><strong>{value}/{max}</strong></div>
      <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
    </div>
  )
}
