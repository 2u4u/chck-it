import { Telegraf } from 'telegraf';
import { config } from 'dotenv';
import { startUrlMonitor, listUrlMonitors, stopUrlMonitor } from './controllers/urlMonitorController.js';

config();

export function createBot(token) {
  const bot = new Telegraf(token);

  bot.start((ctx) => ctx.reply('Welcome! Send me a URL and a cron schedule to start monitoring the URL. \n\nExample: `/monitor https://example.com "*/5 * * * *"`\n\nTo list all active monitors, send `/list`.\n\nTo stop monitoring a URL, send `/stop <URL>``'));

  // Add the command handler for starting URL monitoring
  bot.command('monitor', (ctx) => startUrlMonitor(ctx));

  // Add the command handler for listing active URL monitors
  bot.command('list', (ctx) => listUrlMonitors(ctx));

  bot.command('stop', (ctx) => stopUrlMonitor(ctx));

  // Other bot event handlers and logic...

  return bot;
}