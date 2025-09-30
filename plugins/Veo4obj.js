/**
 * Veo-3 Video Generation Plugin (Fixed)
 * Credit: https://whatsapp.com/channel/0029Vb618iFG8l57xOu2oj2E
 * Owner: OmegaTech
 * Plugin Type: Esm
 * Feature: Generate Videos with Veo-3 (start → poll → deliver with extended timeout)
 */

import axios from 'axios';

let handler = async (m, { conn, args, command }) => {
  try {
    // Fake "loading" reaction
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    const apiKey = 'sk-paxsenix-JACAA3a2W-KIX9a6FDIZDYPyCnrnxc2yqJ9AWYEDu-woDlyq'; // Your valid key
    const baseUrl = 'https://api.paxsenix.org/ai-video/veo-3';
    const timeGMT = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'GMT',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());

    // Always force defaults
    let prompt = args.join(' ').trim();
    let ratio = '16:9';
    let model = 'veo-3-fast';
    let type = 'text-to-video';

    if (!prompt || prompt.length < 3) {
      throw new Error("Prompt too short, sweetie! Example: `.veo3 goat playing football`");
    }

    // Notify user of processing
    await conn.sendMessage(m.chat, {
      text: `🎮 *Veo-3: Video Generation Started*\n✨═════🔮═════✨\n📝 Prompt: ${prompt}\n📹 Model: ${model}\n⏳ Processing... (may take a few minutes)`
    });

    // Step 1: Start generation
    const queryParams = `?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}&model=${model}&type=${type}`;
    const startUrl = `${baseUrl}${queryParams}`;
    const startRes = await axios.get(startUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Lady-Mina-Bot/1.0'
      }
    });

    const job = startRes.data;
    if (!job || !job.task_url) {
      throw new Error(`Bad response from API: ${JSON.stringify(job)}`);
    }

    // Step 2: Poll for completion
    let pollData = job;
    let pollAttempts = 0;
    while (pollAttempts < 30) { // Increased to 30 attempts (~150s total)
      const pollRes = await axios.get(job.task_url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'User-Agent': 'Lady-Mina-Bot/1.0'
        }
      });

      pollData = pollRes.data;

      if (pollData.status === 'done') break;
      if (pollData.status === 'failed') throw new Error("Generation failed from API.");

      // Check for rate limit hint and adjust delay
      const retryAfter = pollRes.headers['retry-after'];
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // 5s (5000ms) default, or Retry-After in ms
      await new Promise(r => setTimeout(r, delay));
      pollAttempts++;
    }

    if (pollData.status !== 'done' || !pollData.url) {
      throw new Error(`Video generation failed or timed out. Last status: ${pollData.status}`);
    }

    // Step 3: Fetch and send the video
    const videoRes = await axios.get(pollData.url, { responseType: 'arraybuffer' });
    const videoBuffer = Buffer.from(videoRes.data);

    await conn.sendMessage(m.chat, {
      video: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `veo3-${timeGMT}.mp4`,
      caption: `🎮 *Veo-3 Generated Video*\n📝 Prompt: ${prompt}\n📹 Ratio: ${ratio}\n⏰ Generated: ${timeGMT} GMT\n🌟 *Powered by Lady-Mina | Creator: @omega
    });

    // ✅ Done
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

  } catch (e) {
    console.error(`Error in .${command} command:`, e);
    m.reply(`😞 *Failed to generate Veo-3 video.*\n💡 Error: ${e.message}`);
    await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
  }
};

handler.help = ['veo3 <prompt>'];
handler.tags = ['maker'];
handler.command = /^(veo3²)$/i;
handler.register = true;
handler.limit = true;

export default handler;