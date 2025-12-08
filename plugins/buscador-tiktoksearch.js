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
      // si no hay url, devolvemos null rápidamente
      if (!url) return null;
      const { data } = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(data);
 
      const content = await generateWAMessageContent(
        { video: buffer },
        { upload: conn.waUploadToServer }
      );
     
      const videoMessage = content?.videoMessage || content;
      return videoMessage;
    } catch (err) {
      console.error("createVideoMessage error:", err?.message || err);
      return null;
    }
  };

  try {
    await m.react?.("⏳");
    await conn.reply?.(m.chat, `🌿 *\`Buscando resultados de titkok\`.*`, m, rcanal);

    const apiUrl = `https://api.starlights.uk/api/search/tiktok?text=${encodeURIComponent(
      text
    )}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data?.status || !data?.result?.data?.length)
      throw new Error("No se encontraron resultados en TikTok.");

    let results = data.result.data.slice(0, 6);
    let cards = [];

    for (let v of results) {
     
      const title = v.title || "Sin título";
      const creator = v.creator || "Desconocido";
      const region = v.region || "N/A";
      const duration = typeof v.duration === "number" ? `${v.duration}s` : (v.duration || "0s");
      const create_time = v.create_time || "N/A";

      const info = `      🎞️  *VIDEO ~ INFO*  🌿
────────────────────────

• ❄️ *Título:* ${title}
• 🌳 *Autor:* ${creator}
• 🎍 *Región:* ${region}
• ⌛ *Duración:* ${duration}
• 🗓️ *Fecha:* ${create_time}

─────────── STATS ───────────
• 🥥 *Vistas:* ${Number(v.views || 0).toLocaleString()}
• 🌾 *Likes:* ${Number(v.likes || 0).toLocaleString()}
• 🍰 *Comentarios:* ${Number(v.comments || 0).toLocaleString()}
• 🌴 *Compartidos:* ${Number(v.share || 0).toLocaleString()}
• 🍄 *Descargas:* ${Number(v.download || 0).toLocaleString()}
• 🚀 *URL:* ${v.url || "No disponible"}
────────────────────────`;

      const possibleVideoUrls = [v.nowm, v.no_watermark, v.play_addr, v.download, v.url].filter(Boolean);
      let videoMsg = null;
      for (const vidUrl of possibleVideoUrls) {
        videoMsg = await createVideoMessage(vidUrl);
        if (videoMsg) break;
      }
      if (!videoMsg) continue;

      cards.push({
        header: {
          title: "────────────────────────",
          hasMediaAttachment: true,
          videoMessage: videoMsg,
        },
        body: {
          text: info,
        },
        footer: {
          text: "",
        },
      });
    }

    if (cards.length === 0) throw new Error("⚠️ No se pudo procesar ningún video.");

    const interactive = proto.Message.InteractiveMessage.fromObject
      ? proto.Message.InteractiveMessage.fromObject({
          body: { text: `🌺 *Resultados de TikTok para:* ${text}` },
          footer: { text: "🌿 Kaneki Bot - AI • 𝐒𝐡𝐚𝐝𝐨𝐰.𝐱𝐲𝐳 ✨" },
          header: { hasMediaAttachment: false },
          carouselMessage: { cards },
        })
      : {
        
          interactiveMessage: {
            body: { text: `🌺 *Resultados de TikTok para:* ${text}` },
            footer: { text: "🌿 Kaneki Bot - AI • 𝐒𝐡𝐚𝐝𝐨𝐰.𝐱𝐲𝐳 ✨" },
            header: { hasMediaAttachment: false },
            carouselMessage: { cards },
          },
        };

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject
              ? proto.Message.InteractiveMessage.fromObject({
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
                })
              : interactive, // fallback
          },
        },
      },
      { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    await m.react?.("✔️");
  } catch (e) {
    console.error(e);
    conn.reply?.(m.chat, `*Error al buscar en TikTok:*\n${e.message || e}`, m);
  }
};

handler.help = ["tiktoksearch <texto>"];
handler.tags = ["search"];
handler.command = ["tiktoksearch", "ttsearch", "tiktoks"];
handler.group = true;

export default handler;