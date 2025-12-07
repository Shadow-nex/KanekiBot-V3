import axios from "axios";

let handler = async (m, { conn }) => {
  try {
    let group = 'https://chat.whatsapp.com/LJJTHuaBfOXAeavOwOMnEC';
    let packname = 'Mi Bot';
    let imagen2 = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765131768491_902910.jpeg';

    // 🔥 DESCARGAR IMAGEN Y CONVERTIR A THUMBNAIL BASE64
    let img = await axios.get(imagen2, { responseType: 'arraybuffer' });
    let thumbnail = Buffer.from(img.data);

    let rpl = {
      contextInfo: {
        externalAdReply: {
          title: packname,
          body: "Grupo de soporte",
          mediaType: 1,
          thumbnail: thumbnail,   // 🔥 ESTE ES EL BANNER REAL
          sourceUrl: group,
          renderLargerThumbnail: true
        }
      }
    };

    let msg = `*🌐 Grupo de soporte*\n\nToca el banner para unirte.`;

    await conn.sendMessage(m.chat, { text: msg, ...rpl }, { quoted: m });

  } catch (e) {
    console.log(e);
    await m.reply('❌ Error al enviar el mensaje.');
  }
};

handler.help = ['grupo'];
handler.tags = ['main'];
handler.command = ['grupo', 'soporte'];

export default handler;