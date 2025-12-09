import fetch from "node-fetch";

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text)
    return conn.reply(
      m.chat,
      `🌟 *Ingresa un enlace de YouTube*\n\nEjemplo:\n${usedPrefix + command} https://youtu.be/TdrL3QxjyVw`,
      m
    );

  try {
    let api = `https://delirius-apiofc.vercel.app/download/ytmp4?url=${encodeURIComponent(text)}`;

    let res = await fetch(api);
    if (!res.ok) throw new Error("Error al pedir datos de la API");

    let json = await res.json();
    if (!json.status || !json.data) throw new Error("La API no devolvió datos válidos");

    let { title, image, download } = json.data;
    let { url: downloadUrl, size, quality, filename } = download;

    await conn.reply(
      m.chat,
      `📥 *Descargando video...*\n\n📌 *Título:* ${title}\n🎞️ *Calidad:* ${quality}\n💾 *Tamaño:* ${size}`,
      m
    );

    let videoBuffer = await fetch(downloadUrl).then((v) => v.buffer());

    await conn.sendMessage(
      m.chat,
      {
        video: videoBuffer,
        caption: `🎬 *${title}*\n\nCalidad: ${quality}\nTamaño: ${size}`,
        mimetype: "video/mp4",
        jpegThumbnail: await (await fetch(image)).buffer()
      },
      { quoted: m }
    );

  } catch (e) {
    console.error(e);
    conn.reply(
      m.chat,
      `*Hubo un error al descargar el video*\nRevisa si el link es válido.`,
      m
    );
  }
};

handler.command = ["ytmp"];
export default handler;