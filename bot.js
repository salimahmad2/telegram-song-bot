const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ BOT_TOKEN not set!");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId,
    `👋 স্বাগতম!\n🎶 আমি Song Bot!\n\nUse this bot like this:\n/song <song name> → Get mp3 file`
  );
});

bot.onText(/\/song (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, `🔎 Searching for "${query}"...`);

  const fileName = `song_${Date.now()}.mp3`;
  const command = `yt-dlp -x --audio-format mp3 -o "${fileName}" "ytsearch1:${query}"`;

  exec(command, (error) => {
    if (error) {
      bot.sendMessage(chatId, "❌ Failed to download song.");
      console.log(error);
      return;
    }

    bot.sendAudio(chatId, fs.createReadStream(fileName)).then(() => {
      fs.unlinkSync(fileName);
    });
  });
});

console.log("🎶 Song Bot running...");
