import axios from "axios";

let handler = async (m, { conn }) => {
  try {
    let group = 'https://chat.whatsapp.com/LJJTHuaBfOXAeavOwOMnEC';
    let packname = 'Mi Bot';
    let imagen2 = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765131768491_902910.jpeg';

    // Bajamos el banner
    let img = await axios.get(imagen2, { responseType: 'arraybuffer' });
    let banner = Buffer.from(img.data);

    // 1️⃣ Enviar banner visible
    await conn.sendMessage(m.chat, { 
      image: banner, 
      caption: "*🌐 Grupo de soporte*\nToca el botón de abajo para unirte." 
    }, { quoted: m });

    // 2️⃣ Mensaje con botón invisible / tarjeta
    let rpl = {
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: "Unirse al grupo",
          mediaType: 1,
          thumbnail: banner, 
          sourceUrl: group,
          renderLargerThumbnail: false // tarjeta, no banner
        }
      }
    };

    await conn.sendMessage(
      m.chat,
      { text: "Toca aquí para unirte 👇", ...rpl },
      { quoted: m }
    );

  } catch (e) {
    console.log(e);
    await m.reply("❌ Error al enviar el mensaje.");
  }
};

handler.help = ['grupo'];
handler.tags = ['main'];
handler.command = ['grupo', 'soporte'];

export default handler;