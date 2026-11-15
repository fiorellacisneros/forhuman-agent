import { defaultSlackAuth, slackChannel } from "eve/channels/slack";

/**
 * Slack con credenciales propias (SLACK_BOT_TOKEN + SLACK_SIGNING_SECRET).
 * Pide el email de quien escribe para que el dashboard sepa a qué usuario
 * (Fio o Dani) atribuir cada registro.
 */
export default slackChannel({
  messageContext: { users: { email: true } },
  async onMessage(ctx, message) {
    if (message.author?.isBot !== false) return null;
    const auth = defaultSlackAuth(message, ctx);
    const esMensajeDirecto = message.raw.channel_type === "im";
    if (ctx.isBotMentioned() || esMensajeDirecto) return { auth };
    // Respuestas dentro de un hilo donde cocoliso ya preguntó algo (sin @mención).
    if (message.threadTs !== message.ts && (await ctx.isSubscribed())) return { auth };
    return null;
  },
});
