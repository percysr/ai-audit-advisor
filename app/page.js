'use client';
import { useState, useRef, useEffect } from 'react';

const PRESETS = [
  { icon: '🔍', label: 'Analizar hallazgo', prompt: 'Analiza el siguiente hallazgo de auditoría y genera una observación formal con: condición, criterio, causa, efecto y recomendación.' },
  { icon: '⚖️', label: 'Evaluar riesgo', prompt: 'Evalúa el riesgo del siguiente escenario considerando probabilidad, impacto, y sugiere controles mitigantes.' },
  { icon: '📋', label: 'Checklist QA', prompt: 'Genera un checklist de Quality Assurance para revisar un trabajo de auditoría, alineado con Normas IIA y NOGAI 2024.' },
  { icon: '🤖', label: 'Gobierno IA', prompt: 'Proporciona lineamientos para el uso responsable de IA en auditoría interna.' },
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEnd = useRef(null);
  const textRef = useRef(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.reply || 'Sin respuesta.' }]);
    } catch (e) {
      setMessages([...updated, { role: 'assistant', content: 'Error: ' + e.message }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{fontFamily:"'Segoe UI',sans-serif",height:'100vh',display:'flex',flexDirection:'column',background:'linear-gradient(165deg,#fdf6ec,#f5ebe0,#eae0d5)',color:'#3d2b1f'}}>
      <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',borderBottom:'1px solid rgba(139,69,19,0.1)',background:'rgba(253,246,236,0.8)'}}>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{width:44,height:44,borderRadius:10,background:'linear-gradient(135deg,#c8553d,#8b4513)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:22,fontWeight:700}}>審</div>
          <div><h1 style={{fontSize:22,fontWeight:700,margin:0}}>AI Audit Advisor</h1><p style={{fontSize:12,color:'#8b7355',margin:0}}>Asistente inteligente de auditoría interna</p></div>
        </div>
        {messages.length > 0 && <button onClick={()=>{setMessages([]);setInput('');}} style={{background:'transparent',border:'1.5px solid rgba(139,69,19,0.2)',borderRadius:8,padding:'8px 16px',fontSize:13,color:'#8b4513',cursor:'pointer'}}>Nueva consulta</button>}
      </header>
      <div style={{flex:1,overflowY:'auto',padding:'20px 24px'}}>
        {messages.length===0?(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',textAlign:'center'}}>
            <div style={{fontSize:48,marginBottom:16,opacity:0.15,fontWeight:700,color:'#8b4513'}}>審計</div>
            <h2 style={{fontSize:26,fontWeight:700,margin:'0 0 8px'}}>¿En qué puedo ayudarte hoy?</h2>
            <p style={{fontSize:14,color:'#8b7355',maxWidth:420,lineHeight:1.6,margin:'0 0 32px'}}>Soy tu asistente de auditoría potenciado por IA. Analizo hallazgos, evalúo riesgos y genero recomendaciones.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12,maxWidth:400,width:'100%'}}>
              {PRESETS.map((p,i)=><button key={i} onClick={()=>{setInput(p.prompt+'\n\n');textRef.current?.focus();}} style={{display:'flex',alignItems:'center',gap:10,padding:'14px 16px',background:'rgba(255,255,255,0.6)',border:'1px solid rgba(139,69,19,0.1)',borderRadius:12,cursor:'pointer',fontSize:13,fontWeight:600,color:'#3d2b1f',textAlign:'left'}}><span style={{fontSize:20}}>{p.icon}</span>{p.label}</button>)}
            </div>
          </div>
        ):(
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {messages.map((m,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
              {m.role==='assistant'&&<div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#c8553d,#8b4513)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700,flexShrink:0}}>審</div>}
              <div style={m.role==='user'?{background:'linear-gradient(135deg,#c8553d,#a0422e)',color:'#fff',padding:'12px 18px',borderRadius:'16px 16px 4px 16px',maxWidth:'75%',fontSize:14,lineHeight:1.6}:{background:'rgba(255,255,255,0.75)',border:'1px solid rgba(139,69,19,0.08)',padding:'14px 18px',borderRadius:'16px 16px 16px 4px',maxWidth:'80%',fontSize:14,lineHeight:1.7,whiteSpace:'pre-wrap'}}>
                <p style={{margin:0}}>{m.content}</p>
              </div>
            </div>)}
            {loading&&<div style={{display:'flex',alignItems:'center',gap:10}}><div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#c8553d,#8b4513)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:14,fontWeight:700}}>審</div><div style={{background:'rgba(255,255,255,0.75)',padding:'14px 18px',borderRadius:16,fontSize:14}}>Analizando...</div></div>}
            <div ref={chatEnd}/>
          </div>
        )}
      </div>
      <div style={{padding:'12px 24px 16px',borderTop:'1px solid rgba(139,69,19,0.08)',background:'rgba(253,246,236,0.9)'}}>
        <div style={{display:'flex',alignItems:'flex-end',gap:10,background:'#fff',border:'1.5px solid rgba(139,69,19,0.12)',borderRadius:14,padding:'8px 12px'}}>
          <textarea ref={textRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send(input);}}} placeholder="Describe tu consulta de auditoría..." rows={1} style={{flex:1,border:'none',outline:'none',resize:'none',fontSize:14,color:'#3d2b1f',background:'transparent',lineHeight:1.5,maxHeight:160}}/>
          <button onClick={()=>send(input)} disabled={loading||!input.trim()} style={{width:38,height:38,borderRadius:10,border:'none',background:'linear-gradient(135deg,#c8553d,#8b4513)',color:'#fff',fontSize:18,cursor:'pointer',opacity:loading||!input.trim()?0.4:1}}>➤</button>
        </div>
        <p style={{fontSize:11,color:'#a89279',textAlign:'center',margin:'8px 0 0'}}>Powered by Claude AI · Las respuestas son orientativas</p>
      </div>
    </div>
  );
          }
