import Link from 'next/link'
const steps=[['1','基本情報','/reports/new/basic'],['2','作業内容','/reports/new/work'],['3','交換部品','/reports/new/parts'],['4','測定値・報告事項','/reports/new/measurements'],['5','確認・署名','/reports/new/signature']]
export default function StepNav({current}:{current:number}){return <div className="step-nav">{steps.map(([n,label,href],i)=><Link key={href} href={href} className={current===i+1?'active':current>i+1?'done':''}><span>{current>i+1?'✓':n}</span>{label}</Link>)}</div>}
