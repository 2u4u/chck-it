import { createBot } from './bot.js';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Error: BOT_TOKEN environment variable is missing.');
  process.exit(1);
}

const bot = createBot(token);

bot.launch();

console.log('Bot started successfully.');
