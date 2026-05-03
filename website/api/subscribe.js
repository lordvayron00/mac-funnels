/**
 * Vercel Serverless Function — ConvertKit Subscription
 *
 * Recibe el POST del formulario de la landing page,
 * suscribe al usuario en ConvertKit de forma segura (API key en servidor)
 * y aplica un tag con el slug del lead magnet para la automatización.
 *
 * Variables de entorno requeridas en Vercel:
 *   CONVERTKIT_API_KEY  → API key v3 de ConvertKit
 *   CONVERTKIT_FORM_ID  → ID del formulario maestro "MAC Funnels - Lead Magnets"
 */

export default async function handler(req, res) {
  // ── CORS ─────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Validación básica ─────────────────────────────────────────────
  const { first_name, email, slug } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido o faltante' });
  }

  const API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = process.env.CONVERTKIT_FORM_ID;

  if (!API_KEY) {
    console.error('CONVERTKIT_API_KEY no configurada en Vercel');
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  if (!FORM_ID) {
    console.error('CONVERTKIT_FORM_ID no configurada en Vercel');
    return res.status(500).json({ error: 'Formulario no configurado' });
  }

  try {
    // ── 1. Suscribir al formulario maestro de ConvertKit ─────────────
    const subRes = await fetch(
      `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: API_KEY,
          email: email.trim().toLowerCase(),
          first_name: (first_name || '').trim(),
        }),
      }
    );

    if (!subRes.ok) {
      const errBody = await subRes.text();
      console.error('ConvertKit subscription error:', errBody);
      return res.status(500).json({ error: 'Error al suscribir en ConvertKit' });
    }

    // ── 2. Aplicar tag con el slug del lead magnet ────────────────────
    if (slug) {
      const tagName = `lead-magnet-${slug}`;

      // Obtener tags existentes
      const tagsRes = await fetch(
        `https://api.convertkit.com/v3/tags?api_key=${API_KEY}`
      );
      const tagsData = await tagsRes.json();
      let tag = (tagsData.tags || []).find(t => t.name === tagName);

      // Crear el tag si no existe
      if (!tag) {
        const createRes = await fetch('https://api.convertkit.com/v3/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: API_KEY, tag: { name: tagName } }),
        });
        const created = await createRes.json();
        tag = created;
      }

      // Aplicar el tag al suscriptor
      if (tag && tag.id) {
        await fetch(`https://api.convertkit.com/v3/tags/${tag.id}/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: API_KEY, email: email.trim().toLowerCase() }),
        });
      }
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscription handler error:', err);
    return res.status(500).json({ error: 'Error inesperado del servidor' });
  }
}
