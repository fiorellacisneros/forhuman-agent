import { defineTool } from "eve/tools";
import { z } from "zod";
import { emailDelSolicitante, llamarDashboard } from "../lib/dashboard";

export default defineTool({
  description:
    "Crea una tarea en el tablero del dashboard de forHuman para un cliente (o para forHuman mismo si es trabajo interno). Úsala para trabajo que alguien debe hacer. Si no sabes el cliente, pregunta antes de llamarla.",
  inputSchema: z.object({
    cliente: z
      .string()
      .min(1)
      .describe("Nombre del cliente tal como lo dijeron (p. ej. 'Avla', 'Hyde Park'). Para trabajo interno usa 'forHuman'."),
    titulo: z.string().min(1).max(160).describe("Título corto y accionable, en español."),
    descripcion: z.string().max(4000).optional().describe("Detalle del pedido, en español."),
    prioridad: z.enum(["baja", "media", "alta"]).default("media"),
    fecha_limite: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .describe("Fecha límite en formato YYYY-MM-DD, solo si la mencionaron."),
  }),
  async execute(input, ctx) {
    return llamarDashboard<{ id: string; titulo: string; url?: string }>(
      "tareas",
      input,
      emailDelSolicitante(ctx),
    );
  },
});
