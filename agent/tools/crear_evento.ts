import { defineTool } from "eve/tools";
import { z } from "zod";
import { emailDelSolicitante, llamarDashboard } from "../lib/dashboard";

export default defineTool({
  description:
    "Anota un evento en el calendario del dashboard (hackathon, lanzamiento, evento de la comunidad, reunión). Resuelve la fecha con fecha_actual si es relativa o no trae año.",
  inputSchema: z.object({
    titulo: z.string().min(1).max(160),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Fecha YYYY-MM-DD."),
    hora: z.string().regex(/^\d{2}:\d{2}$/).optional().describe("Hora HH:MM en hora de Lima, solo si la dijeron."),
    descripcion: z.string().max(2000).optional(),
    tipo: z.enum(["evento", "reunion"]).default("evento"),
    visibilidad: z.enum(["equipo", "personal"]).default("equipo"),
  }),
  async execute(input, ctx) {
    return llamarDashboard<{ id: string; titulo: string; fecha: string; url?: string }>(
      "eventos",
      input,
      emailDelSolicitante(ctx),
    );
  },
});
