import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin }) => {
  try {
    if (!isAdmin) throw '🌳 *Solo un administrador puede ejecutar este comando*';

    const ownerId = (global.owner && global.owner[0] && global.owner[0][0])
      ? `${global.owner[0][0]}@s.whatsapp.net`
      : null;

    let target = m.mentionedJid?.[0] || m.quoted?.sender || text || '';
    target = typeof target === 'object' ? (target[0] || '') : target;

    if (target && !target.includes('@')) target = target.replace(/\D/g, '') + '@s.whatsapp.net';
    if (!target) throw '❄️ Especifica a quién mutear/desmutear (mención, reply o número).';

    if (ownerId && target === ownerId) throw '🍬 *El creador del bot no puede ser mutado*';
    if (target === conn.user?.jid) throw '🍭 *No puedes mutar el bot*';

    if (!global.db) global.db = { data: { users: {} } };
    if (!global.db.data) global.db.data = { users: {} };
    if (!global.db.data.users) global.db.data.users = {};
    if (!global.db.data.users[target]) global.db.data.users[target] = { mute: false };

    const userData = global.db.data.users[target];

    if (command === 'mute') {
      if (userData.mute === true) throw '🍭 *Este usuario ya ha sido mutado*';

      const thumbnail = await (await fetch('https://telegra.ph/file/f8324d9798fa2ed2317bc.png')).buffer();
      const quotedMsg = {
        key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'mute-id' },
        message: {
          locationMessage: {
            name: '𝗨𝘀𝘂𝗮𝗿𝗶𝗼 mutado',
            jpegThumbnail: thumbnail,
            vcard: [
              'BEGIN:VCARD',
              'VERSION:3.0',
              'N:;Unlimited;;;',
              'FN:Unlimited',
              'ORG:Unlimited',
              'item1.TEL;waid=19709001746:+1 (970) 900-1746',
              'item1.X-ABLabel:Unlimited',
              'X-WA-BIZ-DESCRIPTION:ofc',
              'X-WA-BIZ-NAME:Unlimited',
              'END:VCARD'
            ].join('\n')
          }
        },
        participant: '0@s.whatsapp.net'
      };

      userData.mute = true;
      await conn.reply(m.chat, '*🔇 Usuario muteado*\nSus mensajes serán eliminados.', quotedMsg, null, { mentions: [target] });
      return;
    }

    if (command === 'unmute') {
      if (userData.mute === false) throw '🍭 *Este usuario no ha sido mutado*';

      const thumbnail = await (await fetch('https://telegra.ph/file/aea704d0b242b8c41bf15.png')).buffer();
      const quotedMsg = {
        key: { participants: '0@s.whatsapp.net', fromMe: false, id: 'unmute-id' },
        message: {
          locationMessage: {
            name: '𝗨𝘀𝘂𝗮𝗿𝗶𝗼 demutado',
            jpegThumbnail: thumbnail,
            vcard: [
              'BEGIN:VCARD',
              'VERSION:3.0',
              'N:;Unlimited;;;',
              'FN:Unlimited',
              'ORG:Unlimited',
              'item1.TEL;waid=19709001746:+1 (970) 900-1746',
              'item1.X-ABLabel:Unlimited',
              'X-WA-BIZ-DESCRIPTION:ofc',
              'X-WA-BIZ-NAME:Unlimited',
              'END:VCARD'
            ].join('\n')
          }
        },
        participant: '0@s.whatsapp.net'
      };

      userData.mute = false;
      await conn.reply(m.chat, '*🔊 Usuario desmuteado*\nAhora sus mensajes no serán eliminados.', quotedMsg, null, { mentions: [target] });
      return;
    }

    throw 'Comando no reconocido.';

  } catch (err) {
    const e = typeof err === 'string' ? err : (err?.message || String(err));
    try { await conn.reply(m.chat, `🌿 Error: ${e}`, m); } catch (__) { }
  }
};

handler.command = ['mute', 'unmute'];
handler.admin = true;
handler.botAdmin = true;


handler.before = async (m, { conn, isAdmin, isBotAdmin }) => {
  try {
    if (!m.isGroup) return;
    if (!global.db?.data?.users[m.sender]) return;
    if (!global.db.data.users[m.sender].mute) return;
    if (!isBotAdmin) return;
    if (isAdmin) return;

    await conn.sendMessage(m.chat, { delete: m.key });
  } catch {}
};

export default handler;