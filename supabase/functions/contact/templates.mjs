const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const site = 'https://cristiang1h.github.io/COINPRE-WEB';
const button = (text, url) => `<a href="${escape(url)}" style="display:inline-block;background:#f45116;color:white;text-decoration:none;padding:16px 22px;border-radius:8px;font-weight:bold">${escape(text)}</a>`;
const rows = entries => `<table role="presentation" width="100%" cellspacing="0" style="margin:24px 0;border:1px solid #e4e8ef">${entries.map(([k,v])=>`<tr><td style="padding:12px;border-bottom:1px solid #e4e8ef;color:#637087;font-size:12px;vertical-align:top">${escape(k)}</td><td style="padding:12px;border-bottom:1px solid #e4e8ef;word-break:break-word">${escape(v)}</td></tr>`).join('')}</table>`;
function shell(title, content) {
 return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head><body style="margin:0;background:#f2f3f6;font:15px/1.7 Arial,sans-serif;color:#192440"><table role="presentation" width="100%" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellspacing="0" style="width:100%;max-width:600px;background:white;border-radius:14px;overflow:hidden"><tr><td style="background:#192440;border-bottom:4px solid #f45116;padding:26px 28px;color:white"><strong style="font-size:26px;letter-spacing:1px">COINPRE</strong><br><span style="font-size:12px;color:#d9dfec">Formación y soluciones para tu seguridad</span></td></tr><tr><td style="padding:28px"><h1 style="font-size:27px;line-height:1.25">${escape(title)}</h1>${content}</td></tr><tr><td style="padding:22px 28px;background:#f8f6f1;font-size:12px;color:#637087">COINPRE S.A.S. · Fontibón, Bogotá<br>Calle 22K Nº 102-50<br><a href="mailto:contacto@coinpresas.co">contacto@coinpresas.co</a><br><a href="${site}/politica-privacidad.html">Política de privacidad</a> · <a href="${site}/politica-datos.html">Tratamiento de datos</a></td></tr></table></td></tr></table></body></html>`;
}
export function templates(lead) {
 const ref = `CP-${lead.request_id.slice(0,8).toUpperCase()}`;
 const whatsapp = 'https://wa.me/573107918133?text='+encodeURIComponent(`Hola, COINPRE. Envié la solicitud ${ref} sobre ${lead.service}. Quisiera hablar con un asesor.`);
 return {
  internal: {subject:`Nueva solicitud web · ${ref} · ${lead.service}`,htmlContent:shell('Una nueva solicitud para el equipo',
   '<p>Una persona está interesada en nuestros servicios. Estos son los datos que compartió:</p>'+rows([
    ['Referencia',ref],['Nombre',lead.name],['Celular',lead.phone],['Correo',lead.email],['Empresa',lead.company||'No indicada'],['Servicio',lead.service],['Página de origen',lead.source],['Formulario',lead.form_label],['Fecha (Bogotá)',new Date(lead.received_at).toLocaleString('es-CO',{timeZone:'America/Bogota'})]])+
   `<h2 style="font-size:18px">Mensaje del visitante</h2><p style="white-space:pre-wrap;background:#f8f6f1;border-left:3px solid #f45116;padding:16px;word-break:break-word">${escape(lead.message||'No agregó un mensaje adicional.')}</p>`+
   button('Responder por correo','mailto:'+lead.email+'?subject='+encodeURIComponent('Tu solicitud a COINPRE · '+ref))+
   `<p><a href="${site}/${encodeURIComponent(lead.source)}">Ver página de origen</a></p><p style="font-size:11px;color:#637087">Términos y privacidad aceptados por separado. Versión de autorización: 2026-10-28. Registro UTC: ${escape(lead.received_at)}. Usar estos datos para atender la solicitud, no para campañas sin autorización adicional.</p>`)},
  customer: {subject:`Recibimos tu solicitud · COINPRE · ${ref}`,htmlContent:shell('¡Gracias por escribirnos!',
   `<p>Hola, <strong>${escape(lead.name)}</strong>:</p><p>Recibimos tu solicitud. Un asesor revisará la información y se pondrá en contacto contigo para ayudarte con el siguiente paso.</p>`+
   rows([['Servicio de interés',lead.service],['Tu referencia',ref]])+
   '<h2 style="font-size:19px">¿Quieres hablar con un asesor?</h2><p>Puedes continuar por WhatsApp. El mensaje llevará la referencia de tu solicitud para facilitar la atención.</p>'+button('Conversar por WhatsApp ↗',whatsapp)+
   '<p style="font-size:12px;color:#637087;margin-top:24px">Este correo confirma la recepción de tu consulta; la matrícula, disponibilidad o compra se acordará con el asesor. Para corregir tus datos, responde a este mensaje.</p><p style="font-size:11px;color:#637087">Si no realizaste esta solicitud, puedes ignorar este correo o avisarnos. No te hemos suscrito a publicidad.</p>')}
 };
}
