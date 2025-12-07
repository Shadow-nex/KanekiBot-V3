import axios from "axios";
const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent,
} = (await import("@whiskeysockets/baileys")).default;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `🌿 *Ingresa un texto para buscar en TikTok.*\n\n📌 Ejemplo:\n> ${usedPrefix + command} edits de Kaiser`,
      m,
      rcanal
    );

  const createVideoMessage = async (url) => {
    try {
      const { data } = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(data);
      const { videoMessage } = await generateWAMessageContent(
        { video: buffer },
        { upload: conn.waUploadToServer }
      );
      return videoMessage;
    } catch {
      return null;
    }
  };

  try {
    await m.react("⏳");
    await conn.reply(m.chat, `🌿 *\`Buscando resultados de titkok\`.*`, m, rcanal);

    const apiUrl = `https://api.starlights.uk/api/search/tiktok?text=${encodeURIComponent(
      text
    )}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data?.status || !data?.result?.data?.length)
      throw new Error("❌ No se encontraron resultados en TikTok.");

    let results = data.result.data.slice(0, 6);
    let cards = [];

    for (let v of results) {
      let info = `      🎞️  *VIDEO ~ INFO*  🌿
────────────────────────

• ❄️ *Título:* ${v.title || "Sin título"}
• 🌳 *Autor:* ${v.creator || "Desconocido"}
• 🎍 *Región:* ${v.region || "N/A"}
• ⌛ *Duración:* ${v.duration || 0}s
• 🗓️ *Fecha:* ${v.create_time || "N/A"}

─────────── STATS ───────────
• 🥥 *Vistas:* ${v.views?.toLocaleString() || 0}
• 🌾 *Likes:* ${v.likes?.toLocaleString() || 0}
• 🍰 *Comentarios:* ${v.comments?.toLocaleString() || 0}
• 🌴 *Compartidos:* ${v.share?.toLocaleString() || 0}
• 🍄 *Descargas:* ${v.download?.toLocaleString() || 0}
• 🚀 *URL:* ${v.url || "No disponible"}
────────────────────────`;

      let videoMsg = await createVideoMessage(v.nowm);
      if (!videoMsg) continue;

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: info }),
        /*footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: "",
        }),*/
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '────────────────────────',
          hasMediaAttachment: true,
          videoMessage: videoMsg,
        }),
        
    }

    if (cards.length === 0)
      throw new Error("⚠️ No se pudo procesar ningún video.");

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `🌺 *Resultados de TikTok para:* ${text}`,
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "🌿 Kaneki Bot - AI • 𝐒𝐡𝐚𝐝𝐨𝐰.𝐱𝐲𝐳 ✨",
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false,
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject(
                { cards }
              ),
            }),
          },
        },
      },
      { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    m.react("✔️");
  } catch (e) {
    console.error(e);
    conn.reply(
      m.chat,
      `*Error al buscar en TikTok:*\n${e.message}`,
      m
    );
  }
};

handler.help = ["tiktoksearch <texto>"];
handler.tags = ["search"];
handler.command = ["tiktoksearch", "ttsearch", "tiktoks"];
handler.group = true;

export default handler;