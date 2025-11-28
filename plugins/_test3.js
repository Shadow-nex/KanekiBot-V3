const handler = async (m, { conn }) => {
  try {
    const apiUrl = "https://akirax-api.vercel.app/nsfw/waifu";

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API respondió ${res.status}`);

    const data = await res.json();
    if (!data?.url) throw new Error("La API no devolvió una URL de imagen.");

    const img = await fetch(data.url);
    if (!img.ok) throw new Error(`Imagen respondió ${img.status}`);

    const array = await img.arrayBuffer();
    const buffer = Buffer.from(array);

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption:
`☕ *SFW Waifu encontrada*
👤 *API:* ${data.creator}
⏳ *Expira:* ${data.delete_in}

🌿 *Disfruta!*`
      },
      { quoted: m }
    );

  } catch (err) {
    console.error(err);
    await conn.sendMessage(
      m.chat,
      { text: `❌ Error: ${err.message}` },
      { quoted: m }
    );
  }
};

handler.help = ["tes"];
handler.tags = ["anime"];
handler.command = ["tes"];

export default handler;