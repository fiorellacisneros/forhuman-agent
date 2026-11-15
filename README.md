# forhuman-agent (cocoliso)

Agente de forHuman construido con [eve](https://eve.dev). Vive en Slack y anota
tareas, eventos, recordatorios y notas en el dashboard (`forhuman-sos`).

```
Slack  →  cocoliso (eve)  →  /api/agente/*  →  dashboard (Supabase)
```

El agente nunca escribe directo en la base: llama al API del dashboard, que
aplica las mismas reglas de siempre (bolsas de horas, visibilidad, etc.).

## Estructura

- `agent/instructions.md`: quién es cocoliso y cómo decide.
- `agent/tools/`: `fecha_actual`, `crear_tarea`, `crear_evento`, `crear_recordatorio`, `crear_nota`.
- `agent/channels/slack.ts`: Slack con credenciales propias.
- `agent/lib/dashboard.ts`: cliente del API del dashboard.
- `slack-manifest.json`: manifest de la Slack App (completar `request_url` tras el primer deploy).

## Variables de entorno

Ver `.env.example`. Se cargan en Vercel, nunca en el repo.

## Desarrollo

Requiere Node 24+.

```bash
npm install
npm run typecheck
npm run dev   # REPL local
```

## Puesta en marcha en Slack

1. Desplegar en Vercel (`eve deploy`) con las variables de entorno cargadas.
2. En la Slack App, poner `https://<url-del-agente>/eve/v1/slack` como Request URL
   en **Event Subscriptions** y suscribir `app_mention` y `message.channels`.
3. Invitar al bot al canal: `/invite @cocoliso`.
