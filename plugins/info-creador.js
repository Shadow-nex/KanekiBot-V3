// by dv.shadow - https://github.com/shadox-xyz

import PhoneNumber from 'awesome-phonenumber';
import fetch from 'node-fetch';

const handler = async (m, { conn }) => {
  const name = ' sһᥲძ᥆ᥕ.᥊ᥡz • ᥆𝖿𝖿іᥴіᥲᥣ'
  const numCreador = '51919199620'
  const empresa = ' » ᴋᴀɴᴇᴋɪ ʙᴏᴛ ɪɴɪᴄ.'
  const about = '☏ 2024 - 2025 ⎈'
  const correo = 'shadowcore.xyz@gmail.com'
  const web = 'https://shadow-xyz.vercel.app/'
  const direccion = 'Tokyo, Japón 🇯🇵'

  const vcard = `
BEGIN:VCARD
VERSION:3.0
N:;${name};;;
FN:${name}
ORG:${empresa}
TITLE:CEO & Fundador
TEL;waid=${numCreador}:${new PhoneNumber('+' + numCreador).getNumber('international')}
EMAIL:${correo}
URL:${web}
NOTE:${about}
ADR:;;${direccion};;;;
X-ABADR:ES
X-WA-BIZ-NAME:${name}
X-WA-BIZ-DESCRIPTION:${about}
END:VCARD`.trim();

  const contactMessage = {
    displayName: name,
    vcard
  };

  const Shadow_url = await (await fetch("https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764513335162_487707.jpeg")).buffer();

  const fkontak = {
    key: {
      fromMe: false,
      participant: "0@s.whatsapp.net",
      remoteJid: "status@broadcast"
    },
    message: {
      productMessage: {
        product: {
          productImage: {
            mimetype: "image/jpeg",
            jpegThumbnail: Shadow_url
          },
          title: "𝗦𝗵𝗮𝗱𝗼𝘄.𝘅𝘆𝘇 🍁",
          description: ""
        },
        businessOwnerJid: `${numCreador}@s.whatsapp.net`
      }
    }
  };

  m.react('🌿');
  conn.reply(m.chat, `*\`✎ Enviando contacto xd....\`*`, m)

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: name,
      contacts: [contactMessage]
    },
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: '✆ 𝐂𝐨𝐧𝐭𝐚𝐜𝐭𝐨 𝐝𝐞 𝐦𝐢 𝐜𝐫𝐞𝐚𝐝𝐨𝐫 𝐔𝐰𝐮 ღ',
        body: '❐ ᴄᴏɴᴛᴀᴄᴛᴀ ᴀʟ ᴘʀᴏᴘɪᴇᴛᴀʀɪᴏ ᴠɪᴀ ᴡʜᴀᴛsᴀᴘᴘ.',
        mediaType: 1,
        thumbnailUrl: await (await fetch('https://raw.githubusercontent.com/AkiraDevX/uploads/main/uploads/1764513030769_35769.jpeg')).buffer(),
        renderLargerThumbnail: true,
        sourceUrl: ''
      }
    }
  }, { quoted: fkontak });
};

handler.help = ['creador'];
handler.tags = ['info'];
handler.command = ['creador', 'creator', 'owner'];
export default handler;