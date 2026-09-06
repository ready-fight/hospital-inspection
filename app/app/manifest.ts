import type {MetadataRoute} from 'next'
export default function manifest():MetadataRoute.Manifest{return {name:'作業完了報告書SYSTEM',short_name:'作業報告',start_url:'/login',display:'standalone',background_color:'#f4f6f8',theme_color:'#126859',icons:[{src:'/icon.svg',sizes:'any',type:'image/svg+xml'}]}}
