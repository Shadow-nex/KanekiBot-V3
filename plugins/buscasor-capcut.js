import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `🌾 Ingresa el nombre de un template de *CapCut*.\n\n🌿 Ejemplo:\n> ${usedPrefix + command} DJ netizen rahmatahalu`
    );
  }

  try {
    await m.reply("🎋 Buscando videos en *CapCut*...");

    let res = await fetch(
      `${global.APIs.vreden.url}/api/v1/search/capcut?query=${encodeURIComponent(text)}`
    );
    let json = await res.json();

    if (!json.status || !json.result || !json.result.search_data?.length) {
      return m.reply("No encontré resultados en CapCut.");
    }

    let resultados = json.result.search_data;

    for (let i = 0; i < resultados.length; i++) {
      let r = resultados[i];

      let caption = `╭━━━〔 📹 𝐂𝐀𝐏𝐂𝐔𝐓 ${i + 1} 〕━━⬣
┃ • Título: ${r.title}
┃ • Short: ${r.short_title || "N/A"}
┃ • Duración: ${(r.duration_ms / 1000).toFixed(0)}s
┃ • Autor: ${r.author.full_name} (@${r.author.username})
┃ • Bio: ${r.author.description || "Sin descripción"}
┃ • Likes: ${r.statistics.like}
┃ • Favoritos: ${r.statistics.favorite}
┃ • Reproducciones: ${r.statistics.play}
┃ • Usos: ${r.statistics.usage}
┃ • Comentarios: ${r.statistics.comment}
┃ • Calidad: ${r.download.definition} - ${r.download.video_quality}
┃ • Bitrate: ${r.download.bitrate}bps
╰━━━━━━━━━━━━━━━━━━⬣`;

      if (r.download?.video_original) {
        await conn.sendMessage(m.chat, {
          video: { url: r.download.video_original },
          caption: caption,
        });
      }
    }
  } catch (e) {
    console.error(e);
    m.reply("Error al buscar el template de CapCut.");
  }
};

handler.help = ["capcut <texto>"];
handler.tags = ["search"];
handler.command = ["capcutsearch", "capcutse"];

export default handler;