/**
 * Cliente mínimo del API del dashboard (forhuman-sos). El agente nunca toca
 * la base de datos directo: todo pasa por /api/agente/*, que reutiliza las
 * mismas reglas de negocio del dashboard (bolsas de horas, visibilidad, etc.).
 *
 * Variables de entorno (en Vercel, nunca en el repo):
 *   DASHBOARD_URL      p. ej. https://forhuman-sos.vercel.app
 *   AGENTE_API_KEY     secreto compartido con el dashboard
 */

interface CtxConAuth {
  session?: {
    auth?: {
      current?: { attributes?: Record<string, unknown> } | null;
    } | null;
  };
}

/** Email del usuario de Slack que escribió el mensaje, si el canal lo resolvió. */
export function emailDelSolicitante(ctx: unknown): string | null {
  const attrs = (ctx as CtxConAuth)?.session?.auth?.current?.attributes;
  const email = attrs?.email;
  return typeof email === "string" && email.length > 0 ? email : null;
}

export class ErrorDashboard extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export async function llamarDashboard<T>(
  ruta: string,
  cuerpo: Record<string, unknown>,
  solicitanteEmail: string | null,
): Promise<T> {
  const base = process.env.DASHBOARD_URL;
  const clave = process.env.AGENTE_API_KEY;
  if (!base || !clave) {
    throw new ErrorDashboard("Faltan DASHBOARD_URL / AGENTE_API_KEY en el entorno del agente.", 500);
  }

  const respuesta = await fetch(`${base.replace(/\/$/, "")}/api/agente/${ruta}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${clave}`,
    },
    body: JSON.stringify({ ...cuerpo, solicitante_email: solicitanteEmail, origen: "slack" }),
  });

  const texto = await respuesta.text();
  let datos: unknown = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    // respuesta no JSON: se reporta tal cual abajo
  }

  if (!respuesta.ok) {
    const mensaje =
      (datos as { error?: { message?: string } } | null)?.error?.message ??
      `El dashboard respondió ${respuesta.status}.`;
    throw new ErrorDashboard(mensaje, respuesta.status);
  }

  return datos as T;
}
