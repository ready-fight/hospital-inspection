import type {Metadata,Viewport} from 'next';import './globals.css';import PwaRegister from '@/components/PwaRegister'
export const metadata:Metadata={title:'作業完了報告書SYSTEM',description:'病院設備の作業完了報告書システム',applicationName:'作業完了報告書SYSTEM'}
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#126859'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ja"><body><PwaRegister/>{children}</body></html>}
