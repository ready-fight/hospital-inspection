export default function ConnectionBanner({ online }: { online: boolean }) {
  return (
    <div className={online ? 'connection connection-online' : 'connection connection-offline'} role="status">
      <span className="connection-dot" aria-hidden="true" />
      {online ? 'オンライン' : 'オフライン — 入力内容は端末に保存されます'}
    </div>
  )
}
