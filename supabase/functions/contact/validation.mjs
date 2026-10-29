export function validate(input, pages) {
 if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('Datos inválidos.');
 const fields = {name:100,phone:25,email:254,company:160,service:160,message:2500,source:100,form_label:100,website:200,request_id:36};
 const lead = {};
 for (const [key,max] of Object.entries(fields)) {
  if (input[key] != null && typeof input[key] !== 'string') throw Error('Datos inválidos.');
  lead[key] = (input[key] || '').trim();
  if (lead[key].length > max || (key !== 'message' && /[\r\n\x00-\x1f]/.test(lead[key]))) throw Error('Revisa la longitud y el formato de los campos.');
 }
 if (lead.website) throw Error('No fue posible procesar la solicitud.');
 if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lead.request_id)) throw Error('Recarga la página e intenta de nuevo.');
 if (lead.name.length<2 || !/^[+\d ()-]{7,25}$/.test(lead.phone) || lead.phone.replace(/\D/g,'').length<7 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(lead.email) || !lead.service) throw Error('Revisa tu nombre, celular y correo electrónico.');
 if (input.terms !== '1' || input.privacy !== '1') throw Error('Acepta por separado los términos y la política de privacidad.');
 if (!pages.includes(lead.source)) throw Error('Página de origen no reconocida.');
 lead.email = lead.email.toLowerCase();
 return lead;
}
