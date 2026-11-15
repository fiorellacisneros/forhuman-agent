import { defineTool } from "eve/tools";
import { z } from "zod";

const ZONA = "America/Lima";

export default defineTool({
  description:
    "Devuelve la fecha y hora actuales en Lima, Perú. Llámala antes de resolver fechas relativas como 'mañana', 'el viernes' o un día sin año.",
  inputSchema: z.object({}),
  async execute() {
    const ahora = new Date();
    const fecha = new Intl.DateTimeFormat("en-CA", {
      timeZone: ZONA,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(ahora);
    const hora = new Intl.DateTimeFormat("en-GB", {
      timeZone: ZONA,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(ahora);
    const diaSemana = new Intl.DateTimeFormat("es-PE", { timeZone: ZONA, weekday: "long" }).format(ahora);

    return { fecha, hora, dia_semana: diaSemana, zona_horaria: ZONA };
  },
});
