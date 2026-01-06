/*
 ┌────────────────────────────┐
 │ * Author    :  お sʜᴀᴅᴏᴡ's xʏᴢ 彡
 │ * Project   :  Bot xD
 │ * GitHub    : https://github.com/shadox-xyz
 │ * Channel   : https://whatsapp.com/channel/0029VbC34Nt42DchIWA0q11f
 └────────────────────────────┘
*/

import fetch from 'node-fetch'

let handler = async (m, { conn, command, usedPrefix }) => {
if (!global.db.data.chats[m.chat].nsfw) return m.reply('✐ Los comandos de *NSFW* están desáctivados en este Grupo.')
let mentionedJid = m.mentionedJid || []
let userId = mentionedJid.length > 0
  ? mentionedJid[0]
  : m.quoted
  ? m.quoted.sender
  : m.sender

let name2 = global.db.data.users[m.sender]?.name || m.sender.split('@')[0]
let who = global.db.data.users[userId]?.name || userId.split('@')[0]

let symbols = [
  '(⁠◠⁠‿⁠◕⁠)', '˃͈◡˂͈', '૮(˶ᵔᵕᵔ˶)ა', '(づ｡◕‿‿◕｡)づ',
  '(✿◡‿◡)', '(꒪⌓꒪)', '(✿✪‿✪｡)', '(*≧ω≦)',
  '(✧ω◕)', '˃ 𖥦 ˂', '(⌒‿⌒)', '(¬‿¬)',
  '(✧ω✧)', '✿(◕ ‿◕)✿', 'ʕ•́ᴥ•̀ʔっ',
  '(ㅇㅅㅇ❀)', '(∩︵∩)', '(✪ω✪)',
  '(✯◕‿◕✯)', '(•̀ᴗ•́)و ̑̑'
]

let getRandomSymbol = () =>
  symbols[Math.floor(Math.random() * symbols.length)]

let str, categoria
switch (command) {

case 'sixnine': case '69':
str = name2 === who
  ? `\`${name2}\` *está haciendo un 69* ${getRandomSymbol()}.`
  : `\`${name2}\` *está haciendo un 69 con* \`${who}\` ${getRandomSymbol()}.`
categoria = 'sixnine'
break

case 'anal': case 'culiar':
str = name2 === who
  ? `\`${name2}\` *se la metió en el ano* ${getRandomSymbol()}.`
  : `\`${name2}\` *se la metió en el ano a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'anal'
break

case 'blowjob': case 'mamada':
str = name2 === who
  ? `\`${name2}\` *está dando una rica mamada* ${getRandomSymbol()}.`
  : `\`${name2}\` *le dio una mamada a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'blowjob'
break

case 'boobjob': case 'rusa':
str = name2 === who
  ? `\`${name2}\` *esta haciendo una rusa* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está haciendo una rusa a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'boobjob'
break

case 'cum': case 'leche':
str = name2 === who
  ? `\`${name2}\` *se vino dentro de... Omitiremos eso* ${getRandomSymbol()}.`
  : `\`${name2}\` *se vino dentro de* \`${who}\` ${getRandomSymbol()}.`
categoria = 'cum'
break

case 'fap': case 'paja':
str = name2 === who
  ? `\`${name2}\` *se está masturbando* ${getRandomSymbol()}.`
  : `\`${name2}\` *se está masturbando pensando en* \`${who}\` ${getRandomSymbol()}.`
categoria = 'fap'
break

case 'follar':
str = name2 === who
  ? `\`${name2}\` *está follando ricamente* ${getRandomSymbol()}.`
  : `\`${name2}\` *se la metió durísimo a la perrita de* \`${who}\` ${getRandomSymbol()}.`
categoria = 'follar'
break

case 'footjob': case 'pies':
str = name2 === who
  ? `\`${name2}\` *está haciendo una paja con los pies* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está haciendo una paja con los pies a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'footjob'
break

case 'fuck': case 'coger':
str = name2 === who
  ? `\`${name2}\` *se entrega al deseo* ${getRandomSymbol()}.`
  : `\`${name2}\` *se está cogiendo a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'fuck'
break

case 'grabboobs': case 'agarrartetas':
str = name2 === who
  ? `\`${name2}\` *está agarrando unas tetas* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está agarrando las tetas a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'grabboobs'
break

case 'grop': case 'grope': case 'manosear':
str = name2 === who
  ? `\`${name2}\` *se lo está manoseando* ${getRandomSymbol()}.`
  : `\`${name2}\` *se lo está manoseando a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'grop'
break

case 'lickpussy': case 'coño':
str = name2 === who
  ? `\`${name2}\` *está lamiendo un coño* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está lamiendo el coño a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'lickpussy'
break

case 'sexo': case 'sex':
str = name2 === who
  ? `\`${name2}\` *tiene sexo apasionadamente.* ${getRandomSymbol()}.`
  : `\`${name2}\` *tiene sexo fuertemente con* \`${who}\` ${getRandomSymbol()}.`
categoria = 'sexo'
break

case 'spank': case 'nalgada':
str = name2 === who
  ? `\`${name2}\` *está dando una nalgada* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está dando una nalgada a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'spank'
break

case 'suckboobs': case 'chupartetas':
str = name2 === who
  ? `\`${name2}\` *está chupando unas ricas tetas* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está chupando las tetas a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'suckboobs'
break

case 'undress': case 'encuerar':
str = name2 === who
  ? `\`${name2}\` *se está quitando la ropa* ${getRandomSymbol()}.`
  : `\`${name2}\` *le está quitando la ropa a* \`${who}\` ${getRandomSymbol()}.`
categoria = 'undress'
break

case 'yuri': case 'lesbianas': case 'tijeras':
str = name2 === who
  ? `\`${name2}\` *está haciendo tijeras* ${getRandomSymbol()}.`
  : `\`${name2}\` *está haciendo tijeras con* \`${who}\` ${getRandomSymbol()}.`
categoria = 'yuri'
break

default:
return
}

try {
  const res = await fetch('https://raw.githubusercontent.com/shadox-xyz/Test/main/test/nsfw.json')
  const json = await res.json()

  const vids = json[categoria]?.videos
  if (!vids) return m.reply('ꕥ No se encontraron resultados.')

  const video = vids[Math.floor(Math.random() * vids.length)]

  await conn.sendMessage(
    m.chat,
    {
      video: { url: video },
      gifPlayback: true,
      caption: str,
      mentions: userId !== m.sender ? [userId] : []
    },
    { quoted: m }
  )

} catch (e) {
  m.reply(`⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n\n\n${e.message}`)
}
}

handler.help = ['sixnine/69 + <mention>', 'anal/culiar + <mention>', 'blowjob/mamada + <mention>', 'boobjob/rusa + <mention>', 'cum/leche + <mention>', 'fap/paja + <mention>', 'follar + <mention>', 'footjob/pies + <mention>', 'fuck/coger + <mention>', 'grabboobs/agarrartetas + <mention>', 'grop/manosear + <mention>', 'lickpussy/coño + <mention>', 'sexo/sex + <mention>', 'spank/nalgada + <mention>', 'suckboobs/chupartetas + <mention>', 'undress/encuerar + <mention>', 'yuri/tijeras + <mention>']
handler.tags = ['nsfw']
handler.command = ['sixnine', '69', 'anal', 'culiar', 'blowjob', 'mamada', 'boobjob', 'rusa', 'cum', 'leche', 'fap', 'paja', 'follar', 'footjob', 'pies', 'fuck', 'coger', 'grabboobs', 'agarrartetas', 'grop', 'grope', 'manosear', 'lickpussy', 'coño', 'sexo', 'sex', 'spank', 'nalgada', 'suckboobs', 'chupartetas', 'undress', 'encuerar', 'yuri', 'lesbianas', 'tijeras']
handler.group = true

export default handler