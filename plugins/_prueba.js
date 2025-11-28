const handler = async (m, { conn, text, args, usedPrefix, command }) => {
  const why = `🌴 Por favo, menciona a un usuario pará agregar o quitar como owner.`;
  const who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false;
  if (!who) return conn.reply(m.chat, why, m, {mentions: [m.sender]});
  switch (command) {
    case 'addowner':
      const nuevoNumero = who;
      global.owner.push([nuevoNumero]);
      await conn.reply(m.chat, `🌿 Listo Ya Está En La Lista De Owner El Usuario.`, m, fake);
      break;
    case 'delowner':
      const numeroAEliminar = who;
      const index = global.owner.findIndex(owner => owner[0] === numeroAEliminar);
      if (index !== -1) {
        global.owner.splice(index, 1);
        await conn.reply(m.chat, `🥙 Eliminado El Numero de la lista de owner correctamente.`, m, fake);
      } else {
        await conn.reply(m.chat, `🌿 El Numero No Está En La Lista De Owners.`, m, fake);
      }
      break;
  }
};
handler.command = ['addowner', 'delowner']
handler.rowner = true;
export default handler;