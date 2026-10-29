import {test} from 'node:test';
import assert from 'node:assert/strict';
import {templates} from '../supabase/functions/contact/templates.mjs';
import {validate} from '../supabase/functions/contact/validation.mjs';
const example={request_id:'b6a14f6b-a7b2-4912-a7f0-524df359cafa',name:'Prueba COINPRE',phone:'3107918133',email:'example@example.com',company:'Empresa',service:'Trabajo en alturas',message:'Consulta de prueba',source:'index.html',form_label:'Formulario de la página',terms:'1',privacy:'1',website:''};
test('validates both independent consents, not a truthy value',()=>{
 assert.equal(validate(example,['index.html']).email,example.email);
 for(const field of ['terms','privacy']) for(const value of ['',false,'0',true]) assert.throws(()=>validate({...example,[field]:value},['index.html']));
});
test('rejects injection, honeypot, forged origin and oversized input',()=>{
 for(const change of [{name:'Name\nBcc:attacker@example.com'},{email:'bad@example.com\r\n'},{website:'spam'},{source:'https://evil.test'},{message:'a'.repeat(2501)},{name:['array']},{request_id:'../../foo'}]){
  // Trailing whitespace is normalized, embedded header injection is rejected.
  if(change.email)change.email='a@example.com\r\nBcc:x@example.com';
  assert.throws(()=>validate({...example,...change},['index.html']));
 }
});
test('email escapes user input and keeps temporary recipient out of customer HTML',()=>{
 const lead={...validate({...example,name:'<img src=x onerror=alert(1)>',message:'<script>danger</script>'},['index.html']),received_at:'2026-10-28T15:00:00Z'};
 const result=templates(lead);
 assert.ok(result.internal.htmlContent.includes('&lt;script&gt;'));
 assert.ok(!result.customer.htmlContent.includes('<img src=x'));
 assert.ok(result.customer.htmlContent.includes('https://wa.me/573107918133'));
 assert.ok(result.internal.htmlContent.includes('index.html'));
 assert.ok(!result.customer.htmlContent.includes('Cristianguarin140'));
});
