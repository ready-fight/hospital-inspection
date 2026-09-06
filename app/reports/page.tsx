'use client'
import {useMemo,useState} from 'react'
import Link from 'next/link'
import AppHeader from '@/components/AppHeader'
const rows=[['1001','26/10/11','26/10/18','東京中央医療センター','山田','有','●','1','●','完'],['1000','26/09/21','26/09/22','新宿総合病院','佐藤','－','－','0','－','－'],['999','26/09/15','26/09/15','都立中央病院','鈴木','有','●','2','●','完'],['998','26/09/01','26/09/05','品川記念病院','高橋','－','－','0','－','－'],['990','26/08/31','26/08/27','練馬総合病院','加藤','有','●','2','●','完']]
export default function Reports(){
  const[q,setQ]=useState('')
  const filtered=useMemo(()=>rows.filter(r=>!q||r.join(' ').toLowerCase().includes(q.toLowerCase())),[q])
  return <><AppHeader/><main className="shell"><section className="list-head"><div><p className="eyebrow">REPORT LIST</p><h1>報告書一覧</h1><p>過去の報告書を検索・確認・修正できます。</p></div><Link className="primary-link" href="/reports/new/basic">＋ 新規作成</Link></section><section className="table-card"><div className="table-tools"><input placeholder="病院名・作業者で検索" value={q} onChange={e=>setQ(e.target.value)}/><button type="button">検索</button><span>{filtered.length}件表示</span></div><div className="report-table"><div className="rt-head"><span>No.</span><span>作業日</span><span>作成日</span><span>病院名</span><span>作業者</span><span>署名</span><span>PDF</span><span>Mail</span><span>社内用</span><span>状態</span></div>{filtered.map(x=><div className="rt-row" key={x[0]}>{x.map((v,i)=>i===3?<Link key={i} href="/reports/new/basic">{v}</Link>:i===6&&v==='●'?<Link key={i} href="/reports/new/complete" className="center table-action">●</Link>:i===8&&v==='●'?<Link key={i} href="/internal" className="center table-action">●</Link>:<span key={i} className={i>=5?'center':''}>{v}</span>)}</div>)}{filtered.length===0&&<div className="table-empty">該当する報告書はありません。</div>}</div></section></main></>}
