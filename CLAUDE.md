# MAC Funnels — Lead Magnet Pipeline

Sistema automatizado de lead magnets para Jorge Pérez. Genera contenido, landing pages y emails en ~15 minutos con dos comandos.

## Estructura del proyecto

```
.claude/commands/          ← Los tres comandos slash
lead-magnet-system/
  reference/
    conversion-landing-sample.html   ← LEER ESTO antes de generar cualquier landing page
  scripts/
website/
  lead-magnets/            ← Landing pages generadas (se deployean a Vercel)
```

## Los tres comandos

| Comando | Qué hace |
|---|---|
| `/lead-magnet [tema]` | Investiga, escribe el lead magnet, crea página en Notion, registra en pipeline con status "Draft" |
| `/landing-page [tema]` | Genera landing page HTML + email de entrega .txt, hace git push |
| `/execute-lead-magnets` | Procesa todo lo que tiene status "Execute" en Notion → genera assets → deploy → marca "Complete" |

## Reglas críticas

1. **Siempre leer `lead-magnet-system/reference/conversion-landing-sample.html`** antes de generar cualquier landing page. Ese archivo define el sistema de diseño (colores, tipografía, layout).
2. Las landing pages van a `website/lead-magnets/[slug].html`
3. Los emails de entrega van a `website/lead-magnets/[slug]-email.txt`
4. El deploy es via `git push` (Vercel está conectado al repo)

## Placeholders pendientes de configurar

Busca y reemplaza estos valores en `.claude/commands/` cuando los tengas listos:

- `[TU_FOTO_URL]` → URL directa a tu foto (termina en .jpg o .png)
- `[CONVERTKIT_FORM_ENDPOINT]` → URL del formulario de ConvertKit
- `[TU_DOMINIO]` → Tu dominio en Vercel (ej: jorgeperez.com)

## Configuración inicial requerida

### Notion MCP
Edita `~/.claude/settings.json` y agrega:

```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_API_KEY": "secret_xxxxx"
      }
    }
  }
}
```

Obtén el API key en notion.so/my-integrations → New integration.
Comparte la página "MAC Funnels" con esa integración.

### Vercel
```bash
npm install -g vercel
vercel login
vercel link
```

## Tipografía y diseño

- Fuente principal: **Plus Jakarta Sans** (Google Fonts)
- Sistema de colores: variables CSS en `conversion-landing-sample.html`
- Soporte light/dark mode con localStorage
