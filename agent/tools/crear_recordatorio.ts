import { defineTool } from "eve/tools";
import { z } from "zod";
import { emailDelSolicitante, llamarDashboard } from "../lib/dashboard";

export default defineTool({
  description:
    "Crea un recordatorio en el calendario del dashboard para la persona que lo pidió ('recuérdame mañana llamar a…'). Es personal por defecto.",
  inputSchema: z.object({
    titulo: z.string().min(1).max(160),
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe("Fecha YYYY-MM-DD."),
    hora: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    visibilidad: z.enum(["personal", "equipo"]).default("personal"),
  }),
  async execute(input, ctx) {
    return llamarDashboard<{ id: string; titulo: string; fecha: string; url?: string }>(
      "eventos",
      { ...input, tipo: "recordatorio" },
      emailDelSolicitante(ctx),
    );
  },
});
