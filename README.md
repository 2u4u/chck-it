# Telegram bot which checks exact page and notifies when something changed

This is a simple Telegram bot which checks exact page and notifies when something changed.

## Installation

1. Clone this repository.
2. Replace ```YOUR_BOT_TOKEN``` with your Telegram bot token. You can obtain this token by creating a new bot through the BotFather on Telegram. For more information, visit https://core.telegram.org/bots#botfather.
3. Replace ```YOUR_CHAT_ID``` with the desired chat ID where the bot should send messages. You can obtain the chat ID by sending a message to your bot and checking the chat.id property in the update received by the bot.
or 
Navigate to https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates and check the chat.id property in the update received by the bot.
4. Run the application using the command ```npm run dev```.
5. Send a message to your bot and check if it responds

## Usage

* Send a message to your bot with the following format: ```/monitor [URL] [CRON_EXPRESSION]```
* Send ```/list ``` to get list of available URLs
* Send ```/stop [URL]``` to stop monitoring of the URL

## Troubleshooting

On ubuntu you will probably need to install some dependencies (tested on ubuntu 20.04)):
```bash
sudo apt-get install libcairo2 libpango-1.0-0 libxkbcommon-x11-0 libgbm-dev libxrandr2 libxfixes3 libxdamage1 libxcomposite1 libcups2 libatk-bridge2.0-0
```