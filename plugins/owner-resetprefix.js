const handler = async (m, {conn}) => {
  global.prefix = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
  //await m.reply(`✅️ *Prefijo Restablecido Con Éxito!*`);
  conn.fakeReply(m.chat, `🍃 *Prefijo Restablecido Con Éxito!*`, '0@s.whatsapp.net', '✨ PREFIJO RESTABLECIDO ✨')
};
handler.help = ['resetprefix'];
handler.tags = ['owner'];
handler.command = ['resetprefix'];

export default handler;