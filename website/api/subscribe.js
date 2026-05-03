/**
 * Vercel Serverless Function — ConvertKit Subscription
 *
 * Flujo automático por lead magnet:
 * 1. Lee data.json para obtener el Notion URL del lead magnet solicitado
 * 2. Suscribe al usuario al formulario maestro de ConvertKit
 * 3. Aplica el tag del lead magnet (lead-magnet-[slug])
 * 4. Pasa el Notion URL como custom field "lead_magnet_url"
 * 5. Suscribe a la secuencia de entrega (que usa {{subscriber.lead_magnet_url}})
 *    → ConvertKit envía el email automáticamente con el link correcto
 *
 * Variables de entorno en Vercel:
 *   CONVERTKIT_API_KEY      → API key v3
 *   CONVERTKIT_FORM_ID      → ID del formulario maestro (ej: 9397580)
 *   CONVERTKIT_SEQUENCE_ID  → ID de la secuencia "Lead Magnet Delivery"
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getLeadMagnets() {
  try {
    return JSON.parse(readFileSync(join(__dirname, 'data.json'), 'utf-8'));
  } catch {
    return {};
  }
}

export default async function handler(req, res) {
  // ── CORS ─────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Validación ────────────────────────────────────────────────────
  const { first_name, email, slug } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido o faltante' });
  }

  const API_KEY     = process.env.CONVERTKIT_API_KEY;
  const FORM_ID     = process.env.CONVERTKIT_FORM_ID;
  const SEQUENCE_ID = process.env.CONVERTKIT_SEQUENCE_ID;

  if (!API_KEY || !FORM_ID) {
    console.error('Faltan variables de entorno: CONVERTKIT_API_KEY o CONVERTKIT_FORM_ID');
    return res.status(500).json({ error: 'Configuración del servidor incompleta' });
  }

  // ── Obtener Notion URL del lead magnet ────────────────────────────
  const leadMagnets = getLeadMagnets();
  const lm = slug ? leadMagnets[slug] : null;
  const notionUrl = lm?.notion_url || null;

  const cleanEmail = email.trim().toLowerCase();
  const cleanName  = (first_name || '').trim();

  try {
    // ── 1. Suscribir al formulario maestro ───────────────────────────
    const formBody = {
      api_key:    API_KEY,
      email:      cleanEmail,
      first_name: cleanName,
    };

    // Pasar Notion URL como custom field para la secuencia
    if (notionUrl) {
      formBody.fields = { lead_magnet_url: notionUrl };
    }

    const subRes = await fetch(
      `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(formBody),
      }
    );

    if (!subRes.ok) {
      const err = await subRes.text();
      console.error('ConvertKit form subscription error:', err);
      return res.status(500).json({ error: 'Error al suscribir en ConvertKit' });
    }

    // ── 2. Aplicar tag del lead magnet ───────────────────────────────
    if (slug) {
      const tagName = `lead-magnet-${slug}`;
      const tagsRes = await fetch(`https://api.convertkit.com/v3/tags?api_key=${API_KEY}`);
      const { tags = [] } = await tagsRes.json();
      let tag = tags.find(t => t.name === tagName);

      if (!tag) {
        const createRes = await fetch('https://api.convertkit.com/v3/tags', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ api_key: API_KEY, tag: { name: tagName } }),
        });
        tag = await createRes.json();
      }

      if (tag?.id) {
        await fetch(`https://api.convertkit.com/v3/tags/${tag.id}/subscribe`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ api_key: API_KEY, email: cleanEmail }),
        });
      }
    }

    // ── 3. Suscribir a la secuencia de entrega ───────────────────────
    // La secuencia en ConvertKit usa {{subscriber.lead_magnet_url}} en el email.
    // Así el link correcto llega automáticamente sin crear una secuencia por lead magnet.
    if (SEQUENCE_ID && notionUrl) {
      await fetch(`https://api.convertkit.com/v3/sequences/${SEQUENCE_ID}/subscribe`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          api_key:    API_KEY,
          email:      cleanEmail,
          first_name: cleanName,
          fields:     { lead_magnet_url: notionUrl },
        }),
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Subscription handler error:', err);
    return res.status(500).json({ error: 'Error inesperado del servidor' });
  }
}
