const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

// ❌ Directly added bot token (NOT recommended for public repos)
const TOKEN = "7964379250:AAECKcNdQ_ucWb7BVPyeoA8Q6wMBUiLkkMU";

const bot = new TelegramBot(TOKEN, { polling: true });

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `👋 Welcome!\n\n🎵 I am a Song Bot.\n\nUse:\n/song <song name>\nExample:\n/song Shape of You`
  );
});

// /song command
bot.onText(/\/song (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  bot.sendMessage(chatId, `🔍 Searching for "${query}"...`);

  const fileName = `song_${Date.now()}.mp3`;
  const command = `yt-dlp -x --audio-format mp3 -o "${fileName}" "ytsearch1:${query}"`;

  exec(command, (error) => {
    if (error) {
      console.error(error);
      bot.sendMessage(chatId, "❌ Failed to download song.");
      return;
    }

    bot.sendAudio(chatId, fs.createReadStream(fileName)).then(() => {
      fs.unlinkSync(fileName);
    });
  });
});

console.log("🎶 Song Bot is running...");
