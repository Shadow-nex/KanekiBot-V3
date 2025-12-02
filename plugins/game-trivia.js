import fetch from "node-fetch"

const triviaImages = [
  'https://cdn.yupra.my.id/yp/o720p39m.jpg',
  'https://cdn.yupra.my.id/yp/ey5l5cct.jpg',
  'https://i.pinimg.com/originals/b3/67/d5/b367d513d861de468305c32c6cd22756.jpg'
]

const questions = [
    {
        question: "¿Quién fue el padre de Melquisedec?",
        options: ["Abraham", "Noé", "Ninguno, Melquisedec no tenía padre"],
        answer: "C"
    },
    {
        question: "¿Cuál es el nombre del rey que pidió que se escribieran los Salmos?",
        options: ["David", "Salomón", "Ezequías"],
        answer: "A"
    },
    {
        question: "¿En qué libro de la Biblia se describe la creación del mundo?",
        options: ["Éxodo", "Génesis", "Levítico"],
        answer: "B"
    },
    {
        question: "¿Qué profeta desafió a los profetas de Baal en el monte Carmelo?",
        options: ["Isaías", "Elías", "Jeremías"],
        answer: "B"
    },
    {
        question: "¿Quién fue el último juez de Israel?",
        options: ["Samuel", "Débora", "Sansón"],
        answer: "A"
    },
    {
        question: "¿Qué rey ordenó la construcción del Templo de Jerusalén?",
        options: ["David", "Salomón", "Josías"],
        answer: "B"
    },
    {
        question: "¿Cuál es el metal más abundante en la corteza terrestre?",
        options: ["Hierro", "Aluminio", "Cobre"],
        answer: "B"
    }
]

let triviaSessions = new Map()
let userScores = new Map()

// =============================
//     COMANDO PRINCIPAL
// =============================
const handler = async (m, { conn, command, args, usedPrefix }) => {
  try {
    if (command === "trivia") {

      let current = triviaSessions.get(m.chat)
      let available = [...questions]

      if (current?.asked?.length)
        available = available.filter((_, i) => !current.asked.includes(i))

      if (available.length === 0) {
        triviaSessions.delete(m.chat)
        return m.reply("🎉 *Ya respondiste todas las preguntas!* Usa nuevamente *trivia* para reiniciar.")
      }

      const randomIndex = Math.floor(Math.random() * available.length)
      const qIndex = questions.indexOf(available[randomIndex])
      const q = questions[qIndex]
      const img = triviaImages[Math.floor(Math.random() * triviaImages.length)]

      const caption = `
╭━━━〔 🎓 𝐓𝐑𝐈𝐕𝐈𝐀 𝐃𝐄 𝐂𝐔𝐋𝐓𝐔𝐑𝐀 🌸 〕━━⬣
┃ 🧩 *Pregunta:* ${q.question}
┃
┃ 🌿 *Opciones:*
┃  A) ${q.options[0]}
┃  B) ${q.options[1]}
┃  C) ${q.options[2]}
┃
┃ ✏️ *Responde a este mensaje con A, B o C*
╰━━━━━━━━━━━━━━━━━━⬣
`.trim()

      const msg = await conn.sendMessage(
        m.chat,
        { image: { url: img }, caption },
        { quoted: m }
      )

      triviaSessions.set(m.chat, {
        index: qIndex,
        answered: false,
        key: msg.key,
        asked: current?.asked ? [...current.asked, qIndex] : [qIndex]
      })

      return
    }

    if (command === "triviascore") {
      if (userScores.size === 0) return m.reply("📭 Nadie ha jugado aún.")

      const sorted = [...userScores.entries()].sort((a, b) => b[1] - a[1])
      const top = sorted.slice(0, 10)
      const mentions = top.map(([u]) => u)

      const ranking = top
        .map(([user, score], i) => `*${i + 1}.* @${user.split("@")[0]} — 🏅 *${score} pts*`)
        .join("\n")

      const img = triviaImages[Math.floor(Math.random() * triviaImages.length)]

      await conn.sendMessage(
        m.chat,
        { image: { url: img }, caption: ranking, mentions },
        { quoted: m }
      )
    }

  } catch (err) {
    console.error(err)
    m.reply("⚠️ Error ejecutando trivia.")
  }
}

// =============================
//      SISTEMA DE RESPUESTAS
// =============================
handler.before = async (m, { conn }) => {
  const session = triviaSessions.get(m.chat)
  if (!session) return

  if (!m.quoted || m.quoted.id !== session.key.id) return
  if (session.answered) return m.reply("🍬 Ya respondiste. Usa *trivia* para otra pregunta.")

  const txt = m.text.trim().toUpperCase()
  if (!["A", "B", "C"].includes(txt)) return m.reply("❌ Responde solo con A, B o C.")

  const correct = questions[session.index].answer
  const isCorrect = txt === correct

  let uid = m.sender
  if (!userScores.has(uid)) userScores.set(uid, 0)
  if (isCorrect) userScores.set(uid, userScores.get(uid) + 1)

  const points = userScores.get(uid)

  await m.reply(
    isCorrect
      ? `🎉 *Correcto!* Ganaste un punto.\n🏅 *Total:* ${points}`
      : `💔 Incorrecto.\n✅ La respuesta correcta era: *${correct}*\n🏅 *Total:* ${points}`
  )

  triviaSessions.set(m.chat, { ...session, answered: true })
}

handler.help = ["trivia", "triviascore"]
handler.tags = ["game"]
handler.command = ["trivia", "triviascore"]

export default handler