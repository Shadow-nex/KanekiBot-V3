import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;

function msToTime(ms) {
  if (!ms) return '----'
  let s = Math.floor(ms / 1000)
  let m = Math.floor(s / 60)
  let sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`*🌾 Por favor, ingresa el texto que deseas buscar en SoundCloud.*\n> *Ejemplo:* ${usedPrefix + command} Twice`);
  await m.react('🎐');

  try {
    const response = await axios.get(
      `${global.APIs.delirius.url}/search/soundcloud?q=${encodeURIComponent(text)}&limit=15`
    );

    const results = response.data?.data;

    if (!results || !Array.isArray(results) || results.length === 0) {
      return m.reply('No se encontraron resultados para esta búsqueda en SoundCloud.');
    }

    async function createImage(url) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url } },
        { upload: conn.waUploadToServer }
      );
      return imageMessage;
    }

    let cards = [];
    for (let i = 0; i < results.length; i++) {
      let track = results[i];

      const image = await createImage(track.image || banner);

      const infoHeader = `🌾 𝗦𝗢𝗨𝗡𝗗𝗖𝗟𝗢𝗨𝗗 • 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔`;
      const infoBody = `
 ◦ *Nro:* ${i + 1}
 ◦ *Título:* ${track.title || '----'}
 ◦ *Artista:* ${track.artist || '----'}
 ◦ *Álbum:* ${track.album || '----'}
 ◦ *Género:* ${track.genre || '----'}
 ◦ *Likes:* ${track.likes ?? '----'}
 ◦ *Reproducciones:* ${track.play ?? '----'}
 ° *Comentarios:* ${track.comments ?? '----'}
 ◦ *Duración:* ${msToTime(track.duration)}
 ° *Licencia:* ${track.license || '----'}
 ◦ *Label:* ${track.label_name || '----'}
 ◦ *ID:* ${track.id || '----'}
 ◦ *Fecha:* ${track.created || '----'}
 ◦ *URL:* ${track.link}`;

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: infoHeader }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: infoBody }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '',
          hasMediaAttachment: true,
          imageMessage: image
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: "🍒 𝘋𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳",
                id: "soundcloud2",
                copy_code: `/soundcloud2 ${track.link}`
              })
            },
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: "𝘊𝘢𝘯𝘢𝘭 𝘰𝘧𝘧𝘪𝘤𝘪𝘢𝘭",
                url: channel
              })
            }
          ]
        })
      });
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `🌾 𝗥𝗲𝘀𝘂𝗹𝘁𝗮𝗱𝗼𝘀 de: \`${text}\`\n> Mostrando ${cards.length} resultados`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: '_SoundCloud - Search_' }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards })
          })
        }
      }
    }, { quoted: m });

    await m.react('✔️');
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (error) {
    console.error(error);
    await m.react('✖️');
    await m.reply('Hubo un error al procesar la búsqueda en SoundCloud.');
  }
}

handler.tags = ['search'];
handler.help = ['soundcloudsearch <texto>'];
handler.command = ['soundcloudsearch', 'scsearch'];

export default handler;