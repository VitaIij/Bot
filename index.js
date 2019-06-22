const Telegraf  = require('telegraf');
const getSchedule = require('./parse');
const firebase = require('firebase');

var serviceAccount = require("./accountdb.json")

firebase.initializeApp({
        serviceAccount: serviceAccount,
        databaseURL: "https://shedulebot-eb34e.firebaseio.com"
});

var ref = firebase.database().ref().child('messages');
const bot = new Telegraf('852884645:AAGe3XpxD85OA8J2xntabUB6JYlRlDje40Y');

bot.start((ctx) => ctx.reply('Enter "get"'));
bot.hears( 'get',(ctx) => getSchedule(ctx.message.text).then(result => {
        ref.push({time: new Date().toString(), text: result});
        ctx.reply(result);
}).catch(() => ctx.reply('Error occured')));

// bot.telegram.setWebhook('https://sheduiebot.sot00.now.sh');

// module.exports = bot.webhookCallback('/');

bot.startPolling();