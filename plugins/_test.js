let handler = async (m, { conn, text, participants, groupMetadata }) => {
    // Obtener link del grupo
    let invite = await conn.groupInviteCode(m.chat)
    let link = `https://chat.whatsapp.com/${invite}`

    // Crear "mención falsa" tipo @NombreGrupo
    let fakeTag = `@${groupMetadata.subject}`

    // Mensaje principal
    let isiPesan = text
        ? `📝 *Mensaje del admin:*\n${text}\n\n${fakeTag}`
        : `*––––––『 TAG A TODOS 』––––––*\n${fakeTag}`;

    let teks = isiPesan;

    // Mencionar a todos
    for (let mem of participants) {
        teks += `\n@${mem.id.split("@")[0]}`
    }

    await conn.sendMessage(m.chat, { 
        text: teks + `\n\n🔗 ${link}`, // el link se oculta en vista previa
        mentions: participants.map(a => a.id)
    })
};

handler.help = ["tagall"];
handler.tags = ["group"];
handler.command = ['tagall', 'all', 'invocar', 'todos'];
handler.admin = true;
handler.group = true;

export default handler;