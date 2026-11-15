import { defineTool } from "eve/tools";
import { z } from "zod";
import { emailDelSolicitante, llamarDashboard } from "../lib/dashboard";

export default defineTool({
  description:
    "Guarda una nota suelta con fecha en el calendario del dashboard, sin acción asociada. Si implica trabajo por hacer, usa crear_tarea en su lugar.",
  inputSchema: z.object({
    titulo: z.string().min(1).max(160),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Fecha YYYY-MM-DD; usa la de hoy si no dicen otra."),
    descripcion: z.string().max(2000).optional(),
    visibilidad: z.enum(["equipo", "personal"]).default("equipo"),
  }),
  async execute(input, ctx) {
    return llamarDashboard<{ id: string; titulo: string; fecha: string; url?: string }>(
      "eventos",
      { ...input, tipo: "nota" },
      emailDelSolicitante(ctx),
    );
  },
});
