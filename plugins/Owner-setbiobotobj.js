import { clockString } from './ping.js'; // Import clockString from ping.js

let handler = async (m, { conn, text, command, usedPrefix }) => {
  await global.loading(m, conn);
  try {
    if (!text) {
      // Default to runtime bio if no text is provided
      let runtime = clockString(process.uptime() * 1000);
      let defaultBio = `Lady-Mina | Powered by OmegaTech Running ${runtime}`;
      await conn.setStatus(defaultBio);
      m.reply(`*Bio updated to runtime, sweetie!*\n🌟 *Current Bio: ${defaultBio}*\n🌟 *Powered by Lady-Mina | Owner: Omegatech-01 | Support: https://github.com/Omegatech-01*`);
    } else {
      await conn.setStatus(text);
      m.reply(`*Successfully changed bot bio, sweetie!*\n🌟 *Current Bio: ${text}*\n🌟 *Powered by Lady-Mina | Owner: Omegatech-01 | Support: https://github.com/Omegatech-01*`);
    }
  } catch (e) {
    console.error('Error in setbiobot handler:', e);
    m.reply(`⚠️ *Failed to change bio, sweetie! Try again later or check your connection.*`);
  } finally {
    await global.loading(m, conn, true);
  }
};

handler.help = ['setbiobot']
handler.tags = ['owner']
handler.command = /^set(bio(bot|setbiobot)?)$/i
handler.mods = true // Assuming 'mods' is intended for owner-level access; use handler.owner = true if preferred

export default handler;