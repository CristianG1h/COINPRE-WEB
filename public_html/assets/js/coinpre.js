/* Shared interactions. No trackers or personal data are sent to analytics. */
(() => {
 'use strict';
 const phone = '573107918133'; // Línea comercial principal confirmada para todos los enlaces de WhatsApp.
 const path = location.pathname.split('/').pop() || 'index.html';
 const contexts = {
  'index.html': ['Información general', ['¿Cuál será tu próximo paso?', 'Alturas, confinados o conducción', 'Encuentra la formación que buscas']],
  'coinpre-cursos-alturas.html': ['Trabajo en alturas', ['Da el siguiente paso con seguridad', '¿Necesitas tu reentrenamiento?', 'Consulta requisitos y programación']],
  'coinpre-cursos-confinados.html': ['Espacios confinados', ['Prepárate para espacios confinados', '¿Qué nivel de formación necesitas?', 'Consulta requisitos y programación']],
  'coinpre-cursos-conduccion.html': ['CEA · Cursos de conducción', ['Tu camino al volante empieza aquí', '¿Automóvil o motocicleta?', 'Consulta por tu curso de conducción']],
  'coinpre-cursos-alto-riesgo.html': ['Cursos especializados', ['Fortalece tus habilidades', 'Conoce la formación especializada', 'Consulta por tu próximo curso']],
  'coinpre-mas-soluciones.html': ['Soluciones SST e ingeniería', ['Acompañamos a tu empresa', 'Conversemos sobre tu proyecto', 'Consulta nuestras soluciones SST']],
  'coinpre-nuestra-empresa.html': ['Información sobre COINPRE', ['Conoce a nuestro equipo', 'Formación para tu seguridad', 'Estamos para acompañarte']],
  'coinpre-contacto.html': ['Contacto y ubicación', ['Hablemos de lo que necesitas', 'Te orientamos antes de tu visita', 'Consulta la programación disponible']]
 };
 const [context, notes] = contexts[path] || contexts['index.html'];
 const titleOf = el => el?.closest('.product-details')?.querySelector('.product-details__title')?.textContent.trim().replace(/\s+/g,' ');
 const urlFor = service => 'https://wa.me/' + phone + '?text=' + encodeURIComponent(`Hola, COINPRE. Estoy visitando la página de ${context}${service && service !== context ? ` y me interesa ${service}` : ''}. Quisiera información sobre requisitos, disponibilidad e inscripción. Gracias.`);
 const event = (name,service) => window.dispatchEvent(new CustomEvent('coinpre:lead',{detail:{event:name,service,page:path}}));
 document.querySelectorAll('[data-whatsapp]').forEach(a => { a.href=urlFor(titleOf(a)); a.target='_blank'; a.rel='noopener noreferrer'; a.addEventListener('click',()=>event('whatsapp_click',titleOf(a)||context)); });
 const menu=document.querySelector('.cp-menu-toggle'), nav=document.querySelector('#cp-nav');
 const setMenuOpen = open => {
  menu?.setAttribute('aria-expanded',String(open));
  nav?.classList.toggle('is-open',open);
 };
 menu?.addEventListener('click',()=>setMenuOpen(menu.getAttribute('aria-expanded')!=='true'));
 document.addEventListener('click',e=>{if(menu?.getAttribute('aria-expanded')==='true'&&!e.target.closest('.cp-nav-wrap'))setMenuOpen(false);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){setMenuOpen(false);}});
 const dialog=document.querySelector('#cp-enrollment'); let opener;
 document.querySelectorAll('[data-enroll]').forEach(a => a.addEventListener('click',e=>{
  e.preventDefault();opener=a; const service=titleOf(a)||context;
  dialog.querySelector('[name=service]').value=service;
  dialog.querySelector('[data-whatsapp]').href=urlFor(service);
  dialog.querySelector('.cp-status').textContent='';
  dialog.showModal(); dialog.querySelector('[name=name]').focus();
 }));
 dialog?.querySelector('.cp-dialog-close').addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog?.addEventListener('close',()=>opener?.focus());
 dialog?.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const items=[...dialog.querySelectorAll('button:not(:disabled),a[href],input:not([type=hidden]),textarea,select,[tabindex]')].filter(el=>el.tabIndex>=0&&el.getClientRects().length);
  const first=items[0],last=items[items.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 const offers = {
  'index.html': [
   ['¿Necesitas certificarte en alturas?', 'Quiero información para certificarme en trabajo en alturas.'],
   ['¿Ya te corresponde reentrenamiento?', 'Quiero consultar el reentrenamiento para trabajo en alturas.'],
   ['¿Trabajas en espacios confinados?', 'Quiero información sobre formación para espacios confinados y sus niveles.'],
   ['¿Quieres aprender a conducir?', 'Quiero información sobre los cursos del CEA para automóvil o motocicleta.'],
   ['¿Buscas equipos para trabajo en alturas?', 'Me gustaría cotizar equipos de protección para trabajo en alturas.'],
   ['¿Tu empresa necesita apoyo en SST?', 'Quiero una cotización de soluciones en Seguridad y Salud en el Trabajo para mi empresa.'],
   ['¿Necesitas inspeccionar tus equipos?', 'Me gustaría consultar el servicio de inspección de equipos de protección.'],
   ['¿Buscas formación en rescate?', 'Quiero información sobre formación especializada en rescate.']
  ],
  'coinpre-cursos-alturas.html': [
   ['¿Necesitas el curso de trabajador autorizado?', 'Quiero información del curso de Trabajador Autorizado en alturas.'],
   ['¿Te corresponde reentrenamiento en alturas?', 'Quiero conocer los requisitos y programación del Reentrenamiento en alturas.'],
   ['¿Quieres formarte como coordinador?', 'Quiero información del curso de Coordinador de trabajo en alturas.'],
   ['¿Buscas formación para jefe de área?', 'Quiero información del curso de Jefe de Área para trabajo en alturas.'],
   ['¿Tienes dudas sobre los requisitos?', 'Quiero confirmar los documentos y requisitos para inscribirme en un curso de alturas.']
  ],
  'coinpre-cursos-confinados.html': [
   ['¿Necesitas formación como entrante?', 'Quiero información del curso de Entrante en espacios confinados.'],
   ['¿Tu función es vigilar un espacio confinado?', 'Quiero información del curso de Vigía de espacios confinados.'],
   ['¿Buscas el curso de supervisor?', 'Quiero consultar el curso de Supervisor de espacios confinados.'],
   ['¿Administras el programa de confinados?', 'Quiero información sobre Administrador de Gestión de espacios confinados.']
  ],
  'coinpre-cursos-conduccion.html': [
   ['¿Quieres aprender a conducir automóvil?', 'Quiero información sobre el curso de conducción B1 para automóvil particular.'],
   ['¿Buscas formación para servicio público?', 'Quiero información sobre el curso de conducción C1.'],
   ['¿Quieres aprender a conducir moto?', 'Quiero información de los cursos de motocicleta A1 y A2.'],
   ['¿Qué necesitas para inscribirte en el CEA?', 'Quiero conocer requisitos y programación de los cursos del CEA.']
  ],
  'coinpre-cursos-alto-riesgo.html': [
   ['¿Tu equipo necesita primeros auxilios?', 'Quiero cotizar formación en Primeros Auxilios.'],
   ['¿Buscas entrenamiento en rescate?', 'Quiero consultar la formación en rescate vertical o en espacios confinados.'],
   ['¿Estás formando tu brigada de emergencia?', 'Quiero información de capacitación para Brigadas de Emergencia.'],
   ['¿Necesitas formación en montacargas?', 'Quiero información del curso de Manejo de Montacargas.'],
   ['¿Realizas trabajo en caliente?', 'Quiero consultar la formación en Trabajo en Caliente.']
  ],
  'coinpre-mas-soluciones.html': [
   ['¿Buscas equipos de protección?', 'Me gustaría cotizar equipos para trabajo en alturas y protección contra caídas.'],
   ['¿Necesitas inspeccionar tus equipos?', 'Quiero cotizar la inspección de equipos para trabajo en alturas.'],
   ['¿Tu proyecto necesita puntos de anclaje?', 'Quiero cotizar ingeniería, puntos de anclaje o líneas de vida.'],
   ['¿Necesitas apoyo profesional en SST?', 'Quiero información de acompañamiento y soluciones SST para mi empresa.'],
   ['¿Buscas exámenes ocupacionales?', 'Quiero información sobre el servicio de exámenes médicos ocupacionales.']
  ],
  'coinpre-nuestra-empresa.html': [
   ['¿Quieres conocer el centro de entrenamiento?', 'Me gustaría conocer el centro de entrenamiento y los servicios de COINPRE.'],
   ['¿Buscas formación para tu empresa?', 'Quiero conocer las opciones de formación de COINPRE para mi equipo de trabajo.'],
   ['¿Necesitas un aliado en seguridad?', 'Me gustaría conversar sobre las soluciones de COINPRE para mi empresa.']
  ],
  'coinpre-contacto.html': [
   ['¿Quieres consultar la programación?', 'Quiero consultar la programación disponible para los cursos de COINPRE.'],
   ['¿Necesitas una cotización para tu empresa?', 'Quiero solicitar una cotización para mi empresa.'],
   ['¿Planeas visitar nuestro centro?', 'Quiero confirmar la ubicación y coordinar una visita al centro de entrenamiento.']
  ]
 };
 const note = document.querySelector('.cp-wa-note');
 const bubble = document.querySelector('.cp-wa-bubble');
 const pageOffers = offers[path] || offers['index.html'];
 let offerIndex = 0, dismissed = document.body.classList.contains('cp-legal-page'), idleTimer, typingTimer;
 const smallScreen = matchMedia('(max-width: 767px)');
 const mobileQuietZones = new Set();
 try { dismissed ||= sessionStorage.getItem('cp-wa-dismissed') === '1'; } catch {}
 note.hidden = dismissed;
 note.classList.remove('is-visible');
 note.querySelector('small').textContent = 'CONSULTA CON NUESTRO EQUIPO';
 const hideNote = () => { clearInterval(typingTimer); note.querySelector('strong').classList.remove('is-typing'); note.classList.remove('is-visible'); note.setAttribute('aria-hidden', 'true'); };
 const showOffer = (rotate = false) => {
  if (dismissed || document.hidden || document.querySelector('dialog[open]') || document.activeElement?.closest('form') || (smallScreen.matches && mobileQuietZones.size)) return;
  if (rotate) offerIndex = (offerIndex + 1) % pageOffers.length;
  const [question, message] = pageOffers[offerIndex];
  const href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hola, COINPRE. ' + message + ' Vengo de la página: ' + context + '.');
  note.querySelector('a').href = href; bubble.href = href;
  const label = note.querySelector('strong');
  const animateText = !matchMedia('(prefers-reduced-motion: reduce)').matches && (rotate || !note.classList.contains('is-visible'));
  clearInterval(typingTimer);
  label.setAttribute('aria-label', question);
  if (animateText) {
   label.textContent = '';
   label.classList.add('is-typing');
   let count = 0;
   typingTimer = setInterval(() => {
    label.textContent = question.slice(0, ++count);
    if (count >= question.length) { clearInterval(typingTimer); label.classList.remove('is-typing'); }
   }, 25);
  } else {
   label.textContent = question;
   label.classList.remove('is-typing');
  }
  note.hidden = false;
  note.removeAttribute('aria-hidden');
  requestAnimationFrame(() => note.classList.add('is-visible'));
 };
 note.querySelector('button').addEventListener('click', () => { dismissed = true; hideNote(); note.hidden = true; clearTimeout(idleTimer); try { sessionStorage.setItem('cp-wa-dismissed', '1'); } catch {} });
 idleTimer = setTimeout(() => showOffer(), 1800);
 setInterval(() => { if (note.classList.contains('is-visible')) showOffer(true); }, 19000);
 bubble.addEventListener('mouseenter', () => showOffer());
 bubble.addEventListener('focus', () => showOffer());
 document.addEventListener('focusin', e => { if (e.target.closest('form')) { hideNote(); clearTimeout(idleTimer); } });
 document.addEventListener('focusout', e => { if (e.target.closest('form')) { clearTimeout(idleTimer); idleTimer = setTimeout(() => showOffer(), 5000); } });
 document.addEventListener('visibilitychange', () => { if (document.hidden) hideNote(); });
 document.querySelectorAll('[data-enroll],[data-video]').forEach(el => el.addEventListener('click', hideNote));
 if ('IntersectionObserver' in window) {
  const quietObserver = new IntersectionObserver(entries => {
   for (const entry of entries) {
    if (entry.isIntersecting) mobileQuietZones.add(entry.target);
    else mobileQuietZones.delete(entry.target);
   }
   if (smallScreen.matches && mobileQuietZones.size) hideNote();
  }, {threshold: 0.03});
  document.querySelectorAll('.cp-inquiry-panel,.cp-footer').forEach(section => quietObserver.observe(section));
 }
 smallScreen.addEventListener?.('change', () => { if (smallScreen.matches && mobileQuietZones.size) hideNote(); });
 addEventListener('scroll', () => {
  hideNote();
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => showOffer(), 5000);
 }, {passive:true});
 const top=document.querySelector('.cp-back-top');const onScroll=()=>{top.hidden=window.scrollY<500;};addEventListener('scroll',onScroll,{passive:true});onScroll();top.addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
 document.querySelectorAll('.cp-form').forEach(form=>{
  form.elements.service.value=context;form.elements.source.value=path;
  form.addEventListener('submit',async e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const button=form.querySelector('[type=submit]'), status=form.querySelector('.cp-status');
   if(button.disabled)return; button.disabled=true;status.textContent='Enviando tu solicitud…';status.dataset.error='false';
   const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
   try{
    const response=await fetch(form.action,{method:'POST',body:new FormData(form),signal:controller.signal,headers:{Accept:'application/json'}});
    const data=await response.json();if(!response.ok||data.ok!==true)throw new Error(data.message||'No fue posible enviar. Intenta de nuevo o escríbenos por WhatsApp.');
    event('form_success',form.elements.service.value);status.textContent=data.message;form.reset();form.elements.service.value=context;form.elements.source.value=path;
   }catch(error){status.dataset.error='true';status.textContent=error.name==='AbortError'?'No pudimos confirmar el envío. Escríbenos por WhatsApp antes de reenviar.':(error instanceof SyntaxError?'El envío por correo requiere el servidor PHP configurado. Puedes contactarnos por WhatsApp.':error.message);}
   finally{clearTimeout(timeout);button.disabled=false;}
  });
 });
})();
