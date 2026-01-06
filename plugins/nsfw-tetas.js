let handler = async (m, { conn }) => {
  if (!db.data.chats[m.chat].nsfw && m.isGroup) {
    return m.reply(`🚫 *El contenido NSFW está desactivado en este grupo.*\n\n✨ Usa *.enable nsfw* si eres admin para activarlo.`);
  }

  let img = 'https://delirius-apiofc.vercel.app/nsfw/boobs';
  let texto = `✨ *Categoría:* Tetas 😋
🎆 *Disfruta el mejor contenido del año nuevo* 🎉

🧨 *Celebra con estilo y placer 😈*`;

  await conn.sendMessage(m.chat, { image: { url: img }, caption: texto, mentions: [m.sender] }, { quoted: m });
  await m.react('🎇');
};

handler.help = ['tetas'];
handler.tags = ['nsfw'];
handler.command = ['tetas'];

export default handler;