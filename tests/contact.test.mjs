import {test} from 'node:test';
import assert from 'node:assert/strict';
let handler, mode='ok', mails=[], records=new Map();
const secrets={BREVO_API_KEY:'fake-test-key',BREVO_SENDER_EMAIL:'verified@example.com',CONTACT_HASH_SALT:'test-only-salt',SUPABASE_URL:'https://db.example.test',SUPABASE_SERVICE_ROLE_KEY:'fake-role',CONTACT_TEST_COPY:'Cristianguarin140@gmail.com'};
globalThis.Deno={env:{get:k=>secrets[k]},serve:fn=>{handler=fn;}};
globalThis.fetch=async(url,options)=>{
 const body=JSON.parse(options.body);
 if(url.includes('/rpc/claim_contact')){
  let result;
  if(mode==='limited')result={result:'limited'};
  else if(records.has(body.p_id)) {const r=records.get(body.p_id); result=r.internal_status==='sent'?{result:'accepted',customer:r.customer_status}:{result:'uncertain'};}
  else {records.set(body.p_id,{internal_status:'sending'});result={result:'new'};}
  return Response.json(result);
 }
 if(options.method==='PATCH'){Object.assign(records.get(url.split('eq.')[1]),body);return new Response(null,{status:204});}
 if(url==='https://api.brevo.com/v3/smtp/email'){
  mails.push(body);
  if(mode==='internal-fail'||(mode==='customer-fail'&&mails.length===2))throw Error('network ambiguous');
  return Response.json({messageId:'fake-message'});
 }
 throw Error('Unexpected network request');
};
await import('../supabase/functions/contact/index.ts');
const payload=()=>({request_id:crypto.randomUUID(),name:'Prueba',phone:'3107918133',email:'example@example.com',service:'Alturas',source:'index.html',form_label:'Inscripción',terms:'1',privacy:'1'});
const request=(body,origin='https://cristiang1h.github.io')=>new Request('https://local.test/contact',{method:'POST',headers:{origin,'content-type':'application/json','x-forwarded-for':'192.0.2.1'},body:JSON.stringify(body)});
function reset(next='ok'){mode=next;mails=[];records=new Map();}
test('sends internal plus customer with separate recipients and replyTo; duplicate never resends',async()=>{
 reset();const body=payload();const res=await handler(request(body));assert.equal(res.status,200);assert.equal(mails.length,2);
 assert.equal(mails[0].to[0].email,'contacto@coinpresas.co');assert.equal(mails[0].bcc[0].email,'Cristianguarin140@gmail.com');assert.equal(mails[0].replyTo.email,body.email);
 assert.equal(mails[1].to[0].email,body.email);assert.equal(mails[1].bcc,undefined);assert.equal(mails[1].replyTo.email,'contacto@coinpresas.co');
 assert.equal((await handler(request(body))).status,200);assert.equal(mails.length,2);
});
test('partial delivery is explicit and not duplicated',async()=>{
 reset('customer-fail');const body=payload();const res=await handler(request(body));assert.equal(res.status,200);assert.match((await res.json()).message,/No pudimos confirmar/);
 await handler(request(body));assert.equal(mails.length,2);
});
test('uncertain internal delivery never reports success or blindly resends',async()=>{
 reset('internal-fail');const body=payload();assert.equal((await handler(request(body))).status,503);assert.equal((await handler(request(body))).status,409);assert.equal(mails.length,1);
});
test('origin, size, validation, rate and configuration fail closed',async()=>{
 reset();assert.equal((await handler(request(payload(),'https://evil.test'))).status,403);
 assert.equal((await handler(request({...payload(),message:'a'.repeat(17000)}))).status,413);
 assert.equal((await handler(request({...payload(),privacy:'0'}))).status,400);
 mode='limited';assert.equal((await handler(request(payload()))).status,429);
 const key=secrets.BREVO_API_KEY;delete secrets.BREVO_API_KEY;assert.equal((await handler(request(payload()))).status,503);secrets.BREVO_API_KEY=key;
 assert.equal(mails.length,0);
});
