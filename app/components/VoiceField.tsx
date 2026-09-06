'use client'
import {useState} from 'react'
export default function VoiceField({value,onChange,placeholder='',multiline=false}:{value:string,onChange:(v:string)=>void,placeholder?:string,multiline?:boolean}){
 const [listening,setListening]=useState(false)
 const start=()=>{const W:any=window;const SR=W.SpeechRecognition||W.webkitSpeechRecognition;if(!SR){alert('このブラウザでは音声入力を利用できません。');return}const r=new SR();r.lang='ja-JP';r.interimResults=false;r.onstart=()=>setListening(true);r.onend=()=>setListening(false);r.onresult=(e:any)=>onChange(value+(value?' ':'')+e.results[0][0].transcript);r.start()}
 return <div className="voice-field">{multiline?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>:<input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}<button type="button" className={listening?'mic listening':'mic'} onClick={start}>🎤<span>{listening?'入力中':'音声'}</span></button></div>
}
