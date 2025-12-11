import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `⚠️ *Ingresa el link de YouTube*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/xxxx`,
      m
    );

  try {
    await m.react("🔎");

    const api = `https://api-adonix.ultraplus.click/download/ytvideo?apikey=the.shadow&url=${encodeURIComponent(text)}`;

    const res = await fetch(api);
    if (!res.ok)
      return conn.reply(m.chat, "❌ Error al conectar con la API.", m);

    const json = await res.json();
    if (!json.status || !json.data?.url)
      return conn.reply(m.chat, "❌ No se pudo obtener el video.", m);

    const { title, url } = json.data;

    await m.react("⬇️");

    let caption = `🎬 *VIDEO DESCARGADO*\n\n` +
      `📌 *Título:* ${title}\n` +
      `🔗 *Fuente:* YouTube\n` +
      `📥 *Descarga:* Enviando archivo...\n`;

    await conn.sendMessage(m.chat, { text: caption }, { quoted: m });

    // Descargar el archivo desde el enlace de la API
    const buffer = await fetch(url).then((a) => a.arrayBuffer());

    await conn.sendMessage(
      m.chat,
      {
        document: Buffer.from(buffer),
        fileName: `${title}.mp4`,
        mimetype: "video/mp4"
      },
      { quoted: m }
    );

    await m.react("✅");

  } catch (e) {
    console.error(e);
    await conn.reply(m.chat, "❌ Ocurrió un error descargando el video.", m);
  }
};

handler.help = ["ytvideo <url>"];
handler.tags = ["downloader"];
handler.command = ["ytvideo", "ytv2", "video2"];

export default handler;