import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import OpenAI from 'openai';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app=express();
const PORT=Number(process.env.PORT||8787);
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

app.use(express.json({limit:'12mb'}));


app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  if(req.method==='OPTIONS') return res.sendStatus(204);
  next();
});
app.use(express.static(__dirname));

function cleanDataUrl(value){
  if(typeof value!=='string' || !value.startsWith('data:image/')) throw new Error('Ungültiges Bild.');
  if(value.length>11_000_000) throw new Error('Bild ist für den Test zu groß.');
  return value;
}
async function askVision(image,prompt){
  const response=await client.responses.create({
    model:process.env.OPENAI_MODEL||'gpt-5.6-luna',
    input:[{role:'user',content:[{type:'input_text',text:prompt},{type:'input_image',image_url:image}]}],
    max_output_tokens:900
  });
  return response.output_text||'';
}
function parseJson(text){
  const cleaned=String(text).trim().replace(/^```json\s*/i,'').replace(/^```\s*/,'').replace(/\s*```$/,'');
  try{return JSON.parse(cleaned);}catch{}
  const a=cleaned.indexOf('{'),b=cleaned.lastIndexOf('}');
  if(a>=0&&b>a){try{return JSON.parse(cleaned.slice(a,b+1));}catch{}}
  throw new Error('KI-Antwort konnte nicht als JSON gelesen werden.');
}

app.get('/api/health',(req,res)=>res.json({ok:true,service:'RESPECTURY KI TEST',model:process.env.OPENAI_MODEL||'gpt-5.6-luna'}));

app.post('/api/meter-analyze',async(req,res)=>{
  try{
    const image=cleanDataUrl(req.body?.image);
    const type=String(req.body?.meterType||'Zähler');
    const unit=String(req.body?.unit||'');
    const prompt=`Du bist die Zählerfoto-KI für die deutsche Dokumentations-App RESPECTURY. Analysiere ausschließlich den sichtbaren Zähler auf dem Foto. Lies den aktuellen Zählerstand so genau wie möglich. Erfinde niemals Ziffern. Wenn eine Ziffer nicht sicher lesbar ist, markiere die Unsicherheit. Bestimme, soweit sichtbar, Hersteller und Modell. Gib NUR gültiges JSON zurück, ohne Markdown: {"reading":"","unit":"${unit}","manufacturer":"","model":"","confidence":"hoch|mittel|niedrig","notes":""}. Zählertyp: ${type}.`;
    const text=await askVision(image,prompt);
    const analysis=parseJson(text);
    res.json({ok:true,analysis});
  }catch(e){console.error(e);res.status(500).json({ok:false,error:e.message||'KI-Fehler'});}
});

app.post('/api/room-analyze',async(req,res)=>{
  try{
    const image=cleanDataUrl(req.body?.image);
    const room=String(req.body?.room||'Bereich');
    const area=String(req.body?.area||'Foto');
    const prompt=`Du bist die Foto-Prüf-KI für die deutsche Vorabnahme-/Wohnungsdokumentation RESPECTURY. Analysiere nur sichtbare Merkmale auf diesem Foto. Prüfe passend zum Bereich ${room} / ${area} insbesondere Oberflächen, sichtbare Risse, Abplatzungen, Kratzer, Dellen, Verfärbungen, Beschädigungen, Glas-/Rahmenzustand, sichtbare Feuchtigkeit oder andere erkennbare Auffälligkeiten. Behaupte nichts, was nicht sichtbar ist. Gib NUR gültiges JSON zurück: {"summary":"kurze sachliche Zusammenfassung","findings":["..."],"recommendation":"kurze Empfehlung","confidence":"hoch|mittel|niedrig"}. Wenn nichts Auffälliges sichtbar ist, schreibe das ausdrücklich.`;
    const text=await askVision(image,prompt);
    const analysis=parseJson(text);
    res.json({ok:true,analysis});
  }catch(e){console.error(e);res.status(500).json({ok:false,error:e.message||'KI-Fehler'});}
});

app.listen(PORT,'0.0.0.0',()=>{
  console.log(`RESPECTURY KI-Testserver läuft: http://localhost:${PORT}`);
  console.log(`Für das Handy: http://DEINE-PC-IP:${PORT}`);
  if(!process.env.OPENAI_API_KEY) console.warn('WARNUNG: OPENAI_API_KEY ist noch nicht gesetzt.');
});
