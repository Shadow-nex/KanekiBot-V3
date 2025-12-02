import fetch from "node-fetch"

const triviaImages = [
  '',
  '',
  'https://i.pinimg.com/originals/b3/67/d5/b367d513d861de468305c32c6cd22756.jpg'
]

const questions = [
    { question: "¿Quién fue el padre de Melquisedec?", options: ["Abraham", "Noé", "Ninguno, Melquisedec no tenía padre"], answer: "C" },
    { question: "¿Cuál es el nombre del rey que pidió que se escribieran los Salmos?", options: ["David", "Salomón", "Ezequías"], answer: "A" },
    { question: "¿En qué libro de la Biblia se describe la creación del mundo?", options: ["Éxodo", "Génesis", "Levítico"], answer: "B" },
    { question: "¿Cuál es la capital de Bután?", options: ["Katmandú", "Thimphu", "Daca"], answer: "B" },
    { question: "¿Qué físico desarrolló la ecuación de Schrödinger?", options: ["Werner Heisenberg", "Erwin Schrödinger", "Paul Dirac"], answer: "B" },
    { question: "¿Quién compuso 'El barbero de Sevilla'?", options: ["Mozart", "Rossini", "Beethoven"], answer: "B" },
    { question: "¿En qué país está Göbekli Tepe?", options: ["Irak", "Turquía", "Irán"], answer: "B" },
    { question: "¿Quién dijo 'Pienso, luego existo'?", options: ["Kant", "Descartes", "Sócrates"], answer: "B" },
    { question: "¿Cuándo se descubrió la estructura del ADN?", options: ["1943", "1953", "1963"], answer: "B" },
    { question: "¿Quién fundó el cálculo moderno?", options: ["Newton", "Leibniz", "Pascal"], answer: "B" },
    { question: "¿Capital de Japón antes de Tokio?", options: ["Kioto", "Osaka", "Nagasaki"], answer: "A" },
    { question: "¿Guerra de los Treinta Años?", options: ["Siglo XVI", "Siglo XVII", "Siglo XVIII"], answer: "B" },
    { question: "¿Qué país nunca fue colonizado?", options: ["Etiopía", "Tailandia", "Afganistán"], answer: "B" },
    { question: "¿Quién descubrió la penicilina?", options: ["Fleming", "Pasteur", "Koch"], answer: "A" },
    { question: "¿Quién construyó el Muro de Adriano?", options: ["Nerón", "Trajano", "Adriano"], answer: "C" },
    { question: "¿Metal más abundante en la corteza terrestre?", options: ["Hierro", "Aluminio", "Cobre"], answer: "B" }
]

let triviaSessions = new Map()
let userScores = new Map()

const handler = async (m, { conn, command }) => {
  try {

    if (command === "trivia") {

      let current = triviaSessions.get(m.chat)
      let available = [...questions]

      if (current?.asked?.length)
        available = available.filter((_, i) => !current.asked.includes(i))

      if (available.length === 0) {
        triviaSessions.delete(m.chat)
        return m.reply("🎉 *Ya respondiste todas las preguntas!* Usa *trivia* para reiniciar.")
      }

      const randomIndex = Math.floor(Math.random() * available.length)
      const qIndex = questions.indexOf(available[randomIndex])
      const q = questions[qIndex]

      let img = triviaImages[Math.floor(Math.random() * triviaImages.length)]

      try { await fetch(img) } catch { img = triviaImages[0] }

      const pointsRandom = Math.floor(Math.random() * (300 - 100 + 1)) + 100

      const caption = `
╭━━━〔 🎓 𝐓𝐑𝐈𝐕𝐈𝐀 𝐂𝐔𝐋𝐓𝐔𝐑𝐀𝐋 🌸 〕━━⬣
┃ 🧩 *Pregunta:* ${q.question}
┃
┃ 🌿 *Opciones:*
┃  A) ${q.options[0]}
┃  B) ${q.options[1]}
┃  C) ${q.options[2]}
┃
┃ 🏆 *Puntos:* ${pointsRandom}
┃ ⏳ *Tiempo:* 1 minuto
┃ ✏️ Responde con A, B o C.
╰━━━━━━━━━━━━━━━━━━⬣
`.trim()

      const msg = await conn.sendMessage(
        m.chat,
        { image: { url: img }, caption },
        { quoted: m }
      )

      if (!msg?.key?.id) return m.reply("⚠️ Error interno al generar trivia.")

      const timeout = setTimeout(async () => {
        const correct = q.answer
        await conn.sendMessage(
          m.chat,
          { text: `⏳ *Tiempo agotado*\nLa respuesta correcta era: *${correct}*` }
        )
        triviaSessions.delete(m.chat)
      }, 60000)

      triviaSessions.set(m.chat, {
        index: qIndex,
        answered: false,
        key: msg.key,
        asked: current?.asked ? [...current.asked, qIndex] : [qIndex],
        points: pointsRandom,
        timeout
      })

      return
    }

    if (command === "triviascore") {
      if (userScores.size === 0) return m.reply("📭 Nadie ha jugado aún.")

      const sorted = [...userScores.entries()].sort((a, b) => b[1] - a[1])
      const top = sorted.slice(0, 10)
      const mentions = top.map(([u]) => u)

      const ranking =
        top
          .map(([u, s], i) => `*${i + 1}.* @${u.split("@")[0]} — 🏅 *${s} pts*`)
          .join("\n")

      const img = triviaImages[Math.floor(Math.random() * triviaImages.length)]

      await conn.sendMessage(
        m.chat,
        { image: { url: img }, caption: ranking, mentions },
        { quoted: m }
      )
    }

  } catch (err) {
    console.error("TRIVIA ERROR:", err)
    m.reply("⚠️ Ocurrió un error ejecutando la trivia.")
  }
}

handler.before = async (m, { conn }) => {
  try {
    const session = triviaSessions.get(m.chat)
    if (!session) return

    if (!m.quoted?.id) return
    if (m.quoted.id !== session.key.id) return

    if (session.answered)
      return m.reply("🍬 Ya respondiste. Usa *trivia* para otra pregunta.")

    const txt = m.text.trim().toUpperCase()
    if (!["A", "B", "C"].includes(txt))
      return m.reply("❌ Responde solo con A, B o C.")

    const correct = questions[session.index].answer
    const isCorrect = txt === correct

    clearTimeout(session.timeout)

    const uid = m.sender
    if (!userScores.has(uid)) userScores.set(uid, 0)

    if (isCorrect) {
      userScores.set(uid, userScores.get(uid) + session.points)
    }

    const total = userScores.get(uid)

    await m.reply(
      isCorrect
        ? `🎉 *Correcto!* Ganaste *${session.points} pts*.\n🏅 *Total:* ${total}`
        : `💔 Incorrecto.\n✅ Era: *${correct}*\n🏅 *Total:* ${total}`
    )

    triviaSessions.set(m.chat, { ...session, answered: true })

  } catch (err) {
    console.error("TRIVIA BEFORE ERROR:", err)
  }
}

handler.help = ["trivia", "triviascore"]
handler.tags = ["game"]
handler.command = ["trivia", "triviascore"]

export default handler