import { validate } from './validation.mjs';
import { templates } from './templates.mjs';

const allowed = new Set(['https://cristiang1h.github.io','https://coinpresas.co','https://www.coinpresas.co']);
const pages = ['index.html','coinpre-nuestra-empresa.html','coinpre-mas-soluciones.html','coinpre-cursos-confinados.html','coinpre-cursos-conduccion.html','coinpre-cursos-alturas.html','coinpre-cursos-alto-riesgo.html','coinpre-contacto.html','politica-privacidad.html','politica-datos.html','politica-cookies.html','terminos-condiciones.html'];
const env = (name: string) => Deno.env.get(name) || '';
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env('CONTACT_HASH_SALT')+value)))).map(n=>n.toString(16).padStart(2,'0')).join('');

Deno.serve(async req => {
 const origin = req.headers.get('origin') || '';
 const headers = {'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin', ...(allowed.has(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const reply = (status: number, message: string, extra = {}) => new Response(JSON.stringify({ok:status===200,message,...extra}),{status,headers});
 if (!allowed.has(origin)) return reply(403,'Origen no permitido.');
 if (req.method==='OPTIONS') return new Response(null,{status:204,headers});
 if (req.method!=='POST') return reply(405,'Método no permitido.');
 if (!req.headers.get('content-type')?.startsWith('application/json')) return reply(415,'Formato no permitido.');
 if (!['BREVO_API_KEY','BREVO_SENDER_EMAIL','CONTACT_HASH_SALT','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'].every(k=>env(k))) return reply(503,'El correo está en configuración. Puedes escribirnos por WhatsApp.');
 // Bound the stream itself: Content-Length can be absent or forged.
 const reader = req.body?.getReader(); if (!reader) return reply(400,'Solicitud vacía.');
 let bytes=0; const chunks: Uint8Array[]=[];
 while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>16000){await reader.cancel();return reply(413,'Solicitud demasiado larga.');}chunks.push(value);}
 const buffer=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){buffer.set(chunk,offset);offset+=chunk.length;}
 let lead;
 try{lead=validate(JSON.parse(new TextDecoder().decode(buffer)),pages);}catch(error){return reply(400,error instanceof SyntaxError?'Datos inválidos.':(error as Error).message);}
 const db = async (path: string, method: string, body: unknown) => {
  const response=await fetch(env('SUPABASE_URL')+'/rest/v1/'+path,{method,headers:{apikey:env('SUPABASE_SERVICE_ROLE_KEY'),Authorization:'Bearer '+env('SUPABASE_SERVICE_ROLE_KEY'),'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw Error('storage');
  const text=await response.text(); return text?JSON.parse(text):null;
 };
 const update = (fields: object) => db('contact_requests?id=eq.'+lead.request_id,'PATCH',fields);
 const accepted = (confirmed: boolean) => reply(200,confirmed?'Recibimos tu solicitud y enviamos un correo de confirmación. Revisa también la carpeta de spam.':'Recibimos tu solicitud. No pudimos confirmar el correo automático; nuestro equipo tiene tus datos para contactarte.',{reference:'CP-'+lead.request_id.slice(0,8).toUpperCase()});
 try {
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const claim=await db('rpc/claim_contact','POST',{p_id:lead.request_id,p_fingerprint:await hash(JSON.stringify(lead)),p_ip_hash:await hash('ip:'+ip),p_email_hash:await hash('email:'+lead.email)});
  if(claim.result==='limited')return reply(429,'Se alcanzó el límite de solicitudes. Escríbenos por WhatsApp para continuar.');
  if(claim.result==='conflict')return reply(409,'La solicitud cambió durante un envío. Escríbenos por WhatsApp para confirmar tus datos.');
  if(claim.result==='accepted')return accepted(claim.customer==='sent');
  if(claim.result!=='new')return reply(409,'Hay un envío en proceso o pendiente de confirmación. Escríbenos por WhatsApp antes de reenviar.');
  lead.received_at=new Date().toISOString();
  const mail=templates(lead);
  const sender={name:'COINPRE',email:env('BREVO_SENDER_EMAIL')};
  const send=async(payload: object)=>{
   const response=await fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':env('BREVO_API_KEY'),'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({sender,...payload}),signal:AbortSignal.timeout(12000)});
   if(!response.ok)throw Error('provider');
   const result=await response.json();if(!result.messageId)throw Error('provider');
  };
  // Temporary copy is BCC: visitor and permanent recipient do not see it.
  const copy=env('CONTACT_TEST_COPY');
  await send({...mail.internal,to:[{email:'contacto@coinpresas.co',name:'Equipo COINPRE'}],...(copy?{bcc:[{email:copy}]}:{}),replyTo:{email:lead.email,name:lead.name},tags:['coinpre-internal']});
  await update({internal_status:'sent',customer_status:'sending'});
  try {
   await send({...mail.customer,to:[{email:lead.email,name:lead.name}],replyTo:{email:'contacto@coinpresas.co',name:'Equipo COINPRE'},tags:['coinpre-confirmation']});
   await update({customer_status:'sent'});
   return accepted(true);
  } catch { return accepted(false); }
 } catch { return reply(503,'No pudimos confirmar el envío. Conservamos los datos en pantalla; escríbenos por WhatsApp antes de reenviar.'); }
});
