import fetch from 'node-fetch';
import yts from 'yt-search';
import baileys from '@whiskeysockets/baileys';

const { generateWAMessageContent, generateWAMessageFromContent, proto } = baileys;

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`*🌾 Por favor, ingresa un texto para buscar en YouTube.*\n> *Ejemplo:* ${usedPrefix + command} Bing Bang...`);
  await m.react('🕓');
  try {
    const results = await yts(text);
    const videos = results.videos.slice(0, 15);

    if (!videos.length) throw '⚠️ *No se encontraron resultados para tu búsqueda.*';

    async function createImage(url) {
      const { imageMessage } = await generateWAMessageContent(
        { image: { url } },
        { upload: conn.waUploadToServer }
      );
      return imageMessage;
    }

    let cards = [];
    for (let video of videos) {
      let image = await createImage(video.thumbnail);

      const info = `◌ *Título* › ${video.title}
◌ *Autor* › ${video.author.name}
◌ *Duración* › ${video.timestamp} (${video.seconds} seg)
◌ *Vistas* › ${video.views.toLocaleString()}
◌ *Publicado* › ${video.ago}

> 🌾 *Descripción:* ${video.description ? video.description.slice(0, 100) + '...' : 'No disponible'}`

      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: info
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: dev
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '🌱 Resultado de la búsqueda:',
          hasMediaAttachment: true,
          imageMessage: image
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: "🎍 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐫 𝐀𝐮𝐝𝐢𝐨",
                id: "ytmp3",
                copy_code: `/ytmp3 ${video.url}`
              })
            },
            {
              name: 'cta_copy',
              buttonParamsJson: JSON.stringify({
                display_text: "🍃 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐫 𝐕𝐢𝐝𝐞𝐨",
                id: "ytmp4",
                copy_code: `/ytmp4 ${video.url}`
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
              text: `*🌿 𝘙𝘦𝘴𝘶𝘭𝘵𝘢𝘥𝘰𝘴 𝘥𝘦:* \`${text}\`\n> Mostrando: ${videos.length} resultados`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: '_Y O U T U B E -- S E A R C H_'
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards
            })
          })
        }
      }
    }, { quoted: m });

    await m.react('✔️');
    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

  } catch (e) {
    console.error(e);
    await m.reply('Error en la búsqueda o envío del mensaje.');
  }
};

handler.help = ['ytsearch2 <texto>'];
handler.tags = ['search'];
handler.command = ['ytsearch2', 'yts2'];
handler.register = true;
handler.group = true;

export default handler;