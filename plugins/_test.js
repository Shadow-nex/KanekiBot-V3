let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    let group = '';
    let packname = 'Mi Bot';
    let imagen2 = 'https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1765131768491_902910.jpeg';


    let rpl = {
      contextInfo: {
        externalAdReply: {
          mediaUrl: group,
          mediaType: 'VIDEO',
          description: 'support group',
          title: packname,
          body: 'grupo de soporte',
          thumbnailUrl: imagen2,
          sourceUrl: group,
        }
      }
    };

   
    let msg = `*🌐 Grupo de soporte*\n\nÚnete al grupo oficial:\n${group}`;

   
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