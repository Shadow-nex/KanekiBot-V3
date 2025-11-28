if (!global.owners) global.owners = [];

const handler = async (m, { conn, text, command }) => {
  try {
    const msgFaltaUser = `🌿 *Debes mencionar a un usuario o responder a un mensaje.*`;

    const who =
      m.mentionedJid?.[0] ||
      (m.quoted ? m.quoted.sender : null) ||
      (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

    const admin = m.sender;
    const fecha = new Date().toLocaleString('es-PE', { hour12: false });

    switch (command) {

      case 'addowner': {

        if (!who) {
          return conn.reply(m.chat, msgFaltaUser, m);
        }

        if (global.owner.some(o => o[0] === who)) {
          return conn.reply(
            m.chat,
            `⚠️ *Este número ya está en la lista de Owners.*`,
            m
          );
        }

        global.owner.push([who, true]);

       
        global.owners.push({
          accion: "AGREGADO",
          usuario: who,
          ejecutor: admin,
          fecha
        });

        await conn.reply(
          m.chat,
          `✅ *Nuevo Owner agregado*\n\n👤 *Usuario:* @${who.split('@')[0]}\n🛂 *Agregado por:* @${admin.split('@')[0]}\n📅 *Fecha:* ${fecha}`,
          m,
          { mentions: [who, admin] }
        );
      }
      break;
      
      case 'delowner': {

        if (!who) {
          return conn.reply(m.chat, msgFaltaUser, m);
        }

        const index = global.owner.findIndex(o => o[0] === who);

        if (index === -1) {
          return conn.reply(
            m.chat,
            `⚠️ *Este número no está en la lista de Owners.*`,
            m
          );
        }

        global.owner.splice(index, 1);

        global.owners.push({
          accion: "ELIMINADO",
          usuario: who,
          ejecutor: admin,
          fecha
        });

        await conn.reply(
          m.chat,
          `🗑️ *Owner eliminado*\n\n👤 *Usuario:* @${who.split('@')[0]}\n🚫 *Eliminado por:* @${admin.split('@')[0]}\n📅 *Fecha:* ${fecha}`,
          m,
          { mentions: [who, admin] }
        );
      }
      break;

      case 'owners': {
        if (global.owners.length === 0) {
          return conn.reply(
            m.chat,
            `📄 *Aún no hay registros de cambios en Owners.*`,
            m
          );
        }

        let texto = `📜 *Historial de cambios de Owners*\n\n`;

        global.owners.slice().reverse().forEach((log, i) => {
          const usuario = log.usuario.split('@')[0];
          const ejecutor = log.ejecutor.split('@')[0];

          texto += `*${i + 1}. ${log.accion}*\n`;
          texto += `👤 Usuario: @${usuario}\n`;
          texto += `🛂 Por: @${ejecutor}\n`;
          texto += `📅 Fecha: ${log.fecha}\n\n`;
        });

        await conn.reply(m.chat, texto, m);
      }
      break;
    }

  } catch (e) {
    console.error(e);
    conn.reply(m.chat, `❌ *Ocurrió un error inesperado.*`, m);
  }
};

handler.help = ['addowner', 'delowner', 'owners'];
handler.tags = ['owner'];
handler.command = ['addowner', 'delowner', 'owners'];
handler.rowner = true;

export default handler;