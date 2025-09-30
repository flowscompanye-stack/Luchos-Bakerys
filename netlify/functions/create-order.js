// Netlify Functions runtime
export async function handler(event) {
  // Preflight CORS for browsers
  const allowedOrigin = 'https://luchosbakerys.netlify.app';
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin, // Solo dominio de producción
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');

    // The real backend URL is stored in an environment variable for security
    // Enviar los datos directamente al webhook de n8n
    const webhookUrl = 'https://n8n.srv943892.hstgr.cloud/webhook/bdfec8dd-7b6d-4206-ba4d-648ad5097138';

    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    // Si el webhook responde, reenviamos la respuesta
    const data = await resp.json();

    return {
      statusCode: resp.status,
      headers: {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error(err); // Log the error for debugging
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': allowedOrigin },
      body: JSON.stringify({ error: 'An internal server error occurred.' })
    };
  }
}
