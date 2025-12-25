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
      `🍃 *Ingresa un texto para buscar en TikTok.*\n\n🌵 Ejemplo:\n> ${usedPrefix + command} edits de Kaiser`,
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
    } catch (e) {
      return null;
    }
  };

  try {
    m.react("⏳");
    m.reply("*Buscando en tiktok...*");

    const apiUrl = `https://api.vreden.my.id/api/v1/search/tiktok?query=${encodeURIComponent(text)}`;
    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data?.status || !data?.result?.search_data?.length)
      throw new Error("No se encontraron resultados en TikTok.");

    let videos = data.result.search_data;
    let cards = [];

    for (let v of videos) {
      const videoUrl = v.data?.find(d => d.type === "no_watermark")?.url;
      if (!videoUrl) continue;

      const info = `
🎬 *Título:* ${v.title || "Sin título"}
🌍 *Región:* ${v.region || "N/A"}
⏱️ *Duración:* ${v.duration}s
📅 *Publicado:* ${v.taken_at}

👤 *Autor:* ${v.author?.nickname || "N/A"}
🆔 *ID:* ${v.video_id}

🎵 *Música:* ${v.music_info?.title || "N/A"}
🎶 *Artista:* ${v.music_info?.author || "N/A"}

👁️ *Vistas:* ${v.stats?.views || "0"}
❤️ *Likes:* ${v.stats?.likes || "0"}
💬 *Comentarios:* ${v.stats?.comment || "0"}
🔁 *Compartidos:* ${v.stats?.share || "0"}
⬇️ *Descargas:* ${v.stats?.download || "0"}
`;

      const videoMsg = await createVideoMessage(videoUrl);
      if (!videoMsg) continue;

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: info }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: dev,
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: "TikTok",
          hasMediaAttachment: true,
          videoMessage: videoMsg,
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [],
        }),
      });
    }

    if (!cards.length)
      throw new Error("No se pudo procesar ningún video.");

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2,
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `🌿 *Resultados de TikTok para:* ${text}`,
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: botname,
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false,
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards,
              }),
            }),
          },
        },
      },
      { quoted: m }
    );

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });
    m.react("✅");

  } catch (e) {
    console.error(e);
    conn.reply(
      m.chat,
      `*Error al buscar en TikTok:*\n\`\`\`${e.message}\`\`\``,
      m,
      fake
    );
  }
};

handler.help = ["tiktoksearch <texto>"];
handler.tags = ["buscador"];
handler.command = ["tiktoksearch", "ttsearch", "tiktoks"];
handler.register = true;
handler.group = true;

export default handler;