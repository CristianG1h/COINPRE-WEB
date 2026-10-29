import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const root='public_html/';
const files=fs.readdirSync(root).filter(x=>x.endsWith('.html'));
test('local page links and enrollment targets exist; inline JavaScript compiles',()=>{
 for(const name of files){
  const html=fs.readFileSync(root+name,'utf8');
  for(const match of html.matchAll(/href="([^"?#]+\.html)(?:[?#][^"]*)?"/g)){
   if(!match[1].includes('://'))assert.ok(fs.existsSync(root+match[1]),`${name}: ${match[1]}`);
  }
  if(html.includes('data-enroll'))assert.match(html,/<dialog[^>]*id="cp-enrollment"/);
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
   if(!match[1].includes('application/ld+json'))new vm.Script(match[2],{filename:name});
  }
 }
 const solutions=fs.readFileSync(root+'coinpre-mas-soluciones.html','utf8');
 assert.equal([...solutions.matchAll(/<a[^>]*data-enroll[^>]*>Solicita Cotización/g)].length,4);
});
test('sitemap points to existing canonical production pages',()=>{
 const sitemap=fs.readFileSync(root+'sitemap.xml','utf8');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);
 assert.equal(new Set(urls).size,8);
 for(const url of urls){
  const parsed=new URL(url);assert.equal(parsed.origin,'https://www.coinpresas.co');
  const html=fs.readFileSync(root+(parsed.pathname.slice(1)||'index.html'),'utf8');
  assert.ok(html.includes(`rel="canonical" href="${url}"`));
  assert.doesNotMatch(html,/<meta[^>]*name="robots"[^>]*content="noindex/i);
 }
});
