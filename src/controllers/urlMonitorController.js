import { config } from 'dotenv';
import { validate, schedule as _schedule } from 'node-cron';
import { checkForChanges } from '../helpers/contentChecker.js';
import { prettifyCron } from '../helpers/prettifyCron.js';
const monitors = [];
config();

export function startUrlMonitor(ctx) {
  const chatId = ctx.chat?.id;
  if (chatId === process.env.TELEGRAM_CHAT_ID) {
    const input = ctx.message?.text?.split(' ');
    if (!input || input.length < 3) {
      ctx.reply('Please provide a URL and a cron schedule, separated by a space.');
      return;
    }

    const url = input[1];
    const schedule = input.slice(2).join(' ');

    if (!validate(schedule)) {
      ctx.reply('Invalid cron schedule. Please provide a valid cron schedule.');
      return;
    }

    if (!chatId) {
      ctx.reply('Error: Unable to get chat ID.');
      return;
    }

    const taskId = _schedule(schedule, async () => {
      console.log('_schedule');
      const screenshot = await checkForChanges(url, `assets/${url}.html`);
      console.log('screenshot', screenshot);
      if (screenshot) {
        ctx.reply(`Changes detected for ${url}.`)
        ctx.telegram.sendPhoto(chatId, { source: screenshot });
      }
    });

    monitors.push({ taskId, chatId, url, schedule });

    ctx.reply(`Monitoring started for ${url} with schedule ${prettifyCron(schedule)}`);
  } else {
    ctx.reply('You are not authorized to use this bot.');
  }
}

export function listUrlMonitors(ctx) {
  const chatId = ctx.chat?.id;
  if (chatId === process.env.TELEGRAM_CHAT_ID) {
    if (!chatId) {
      ctx.reply('Error: Unable to get chat ID.');
      return;
    }

    const chatMonitors = monitors.filter((monitor) => monitor.chatId === chatId);

    if (chatMonitors.length === 0) {
      ctx.reply('No active monitors found for this chat.');
      return;
    }

    const monitorList = chatMonitors
      .map((monitor) => `${monitor.url} with schedule ${monitor.schedule}`)
      .join('\n');

    ctx.reply(`Active monitors:\n${monitorList}`);
  } else {
    ctx.reply('You are not authorized to use this bot.');
  }
}

export function stopUrlMonitor(ctx) {
  const chatId = ctx.chat?.id;
  if (chatId === process.env.TELEGRAM_CHAT_ID) {
    const input = ctx.message?.text?.split(' ');
    if (!input || input.length !== 2) {
      ctx.reply('Please provide the URL you want to stop monitoring.');
      return;
    }

    const [, url] = input;
    if (!chatId) {
      ctx.reply('Error: Unable to get chat ID.');
      return;
    }

    const monitorIndex = monitors.findIndex((monitor) => monitor.chatId === chatId && monitor.url === url);

    if (monitorIndex === -1) {
      ctx.reply('No active monitor found for the specified URL.');
      return;
    }

    const monitor = monitors[monitorIndex];
    monitor.taskId.stop();
    monitors.splice(monitorIndex, 1);

    ctx.reply(`Monitoring stopped for ${url}`);
  } else {
    ctx.reply('You are not authorized to use this bot.');
  }
}