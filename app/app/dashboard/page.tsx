import Link from 'next/link'
import AppHeader from '@/components/AppHeader'

export default function Dashboard(){
  return (
    <>
      <AppHeader/>
      <main className="shell dashboard-shell">
        <section className="ops-hero">
          <div className="ops-hero-copy">
            <p className="eyebrow">FIELD OPERATIONS</p>
            <h1>現場報告を、<br/><em>迷わず・確実に。</em></h1>
            <p>作業完了報告書の作成から提出、履歴確認までを一つの画面から進められます。</p>
            <Link className="hero-cta" href="/reports/new/basic">
              <span>＋</span>
              <div><small>NEW REPORT</small><b>新しい報告書を作成</b></div>
              <i>→</i>
            </Link>
          </div>

          <aside className="ops-console">
            <div className="ops-console-head">
              <span>FIELD STATUS</span>
              <i className="live-dot"/>
            </div>
            <div className="ops-console-main">
              <strong>本日の状況</strong>
              <span>2026.09.06</span>
            </div>
            <div className="ops-stat-grid">
              <div><span>通信</span><b><i className="status-dot online"/>ONLINE</b></div>
              <div><span>端末保存</span><b><i className="status-dot saved"/>ON</b></div>
              <div><span>作成中</span><b>01</b></div>
              <div><span>完了</span><b>02</b></div>
            </div>
            <p>通信が不安定な場合も入力内容を端末側に保持します。</p>
          </aside>
        </section>

        <section className="dashboard-section-head">
          <div>
            <p className="eyebrow">QUICK ACTION</p>
            <h2>よく使う操作</h2>
          </div>
          <span>現場で必要な操作にすぐアクセスできます</span>
        </section>

        <section className="action-grid">
          <Link href="/reports/new/basic" className="action-card primary-action">
            <span className="action-index">01</span>
            <div className="action-symbol">＋</div>
            <div className="action-copy"><small>CREATE</small><h3>報告書を作成</h3><p>現場で新しい作業完了報告書を作成</p></div>
            <i className="action-arrow">↗</i>
          </Link>

          <Link href="/reports" className="action-card">
            <span className="action-index">02</span>
            <div className="action-symbol">▤</div>
            <div className="action-copy"><small>REPORTS</small><h3>報告書一覧</h3><p>コピー・修正・プレビュー・履歴確認</p></div>
            <i className="action-arrow">↗</i>
          </Link>

          <Link href="/internal" className="action-card">
            <span className="action-index">03</span>
            <div className="action-symbol">⌁</div>
            <div className="action-copy"><small>INTERNAL</small><h3>社内用報告書</h3><p>客先提出済みデータから社内報告を作成</p></div>
            <i className="action-arrow">↗</i>
          </Link>
        </section>

        <div className="dashboard-lower">
          <section className="recent recent-modern">
            <div className="panel-head">
              <div><p className="eyebrow">RECENT REPORTS</p><h2>最近の報告書</h2></div>
              <Link href="/reports">すべて見る →</Link>
            </div>

            <div className="recent-row">
              <span className="status ok">完了</span>
              <div><b>東京中央医療センター</b><small>2026/09/05 ・ 定期保守点検</small></div>
              <span>山田 太郎</span><span>PDF ●</span>
            </div>
            <div className="recent-row">
              <span className="status draft">作成中</span>
              <div><b>新宿総合病院</b><small>2026/09/04 ・ フィルター交換</small></div>
              <span>佐藤 健一</span><span>PDF －</span>
            </div>
          </section>

          <aside className="account-panel">
            <p className="eyebrow">MY PAGE</p>
            <h2>マイページ</h2>
            <div className="account-links">
              <a><span>01</span><div><b>ユーザー情報</b><small>ID・メール・会社情報</small></div><i>→</i></a>
              <a><span>02</span><div><b>作業者テーブル</b><small>作業者の追加・修正</small></div><i>→</i></a>
              <a><span>03</span><div><b>報告事項テーブル</b><small>定型文の追加・修正</small></div><i>→</i></a>
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}
