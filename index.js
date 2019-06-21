const Telegraf  = require('telegraf');
const getSchedule = require('./parse');

const bot = new Telegraf('852884645:AAGe3XpxD85OA8J2xntabUB6JYlRlDje40Y');

bot.start((ctx) => ctx.reply('Hello! enter "get"'));
bot.hears( 'get',(ctx) => getSchedule(ctx.message.text).then(result => {
        ctx.reply(result);
}).catch(() => ctx.reply('Error occured')));

// bot.telegram.setWebhook('https://sheduiebot.sot00.now.sh');

// module.exports = bot.webhookCallback('/');

bot.startPolling();