/* 
 * Servicio de WhatsApp
 */
const CALLMEBOT_PHONE = process.env.CALLMEBOT_PHONE;
const CALLMEBOT_APIKEY = process.env.CALLMEBOT_APIKEY;

async function sendWhatsAppMessage(text) {
  if (!CALLMEBOT_PHONE || !CALLMEBOT_APIKEY) {
    console.warn('[whatsapp] Faltan CALLMEBOT_PHONE o CALLMEBOT_APIKEY. No se envió el mensaje.');
    return { sent: false, reason: 'not_configured' };
  }

  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
    CALLMEBOT_PHONE
  )}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(CALLMEBOT_APIKEY)}`;

  try {
    const response = await fetch(url);
    const body = await response.text();
    return { sent: response.ok, status: response.status, body };
  } catch (err) {
    console.error('[whatsapp] Error enviando mensaje:', err.message);
    return { sent: false, reason: err.message };
  }
}

function buildContactNotification({ name, email, phone, message }) {
  return (
    `Nuevo mensaje de contacto en la tienda\n` +
    `Nombre: ${name}\n` +
    `Teléfono: ${phone || 'No indicado'}\n` +
    `Email: ${email || 'No indicado'}\n` +
    `Mensaje: ${message}`
  );
}

module.exports = { sendWhatsAppMessage, buildContactNotification };

