const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const express = require('express');
const config = require('./config.json');

const app     = express();
const client = new Discord.Client();
const bot = new TelegramBot(config.tokenT, {polling: true});


app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});
const site = "https://genius.com/Bon-jovi-you-give-love-a-bad-name-lyrics"

const song = [
`Shot through the heart and you're to blame`,
`Darling, you give love a bad name`,
`An angel's smile is what you sell`,
`You promise me heaven, then put me through hell`,
`Chains of love got a hold on me`,
`When passion's a prison, you can't break free`,
`Whoa, you're a loaded gun, yeah`,
`Whoa, there's nowhere to run`,
`No one can save me, the damage is done`,
`Shot through the heart and you're to blame`,
`You give love a bad name (Bad name)`,
`I play my part and you play your game`,
`You give love a bad name (Bad name)`,
`Yeah, you give love a bad name`,
`Paint your smile on your lips`,
`Blood red nails on your fingertips`,
`A school boy's dream, you act so shy`,
`Your very first kiss was your first kiss goodbye`,
`Whoa, you're a loaded gun`,
`Whoa, there's nowhere to run`,
`No one can save me, the damage is done`,
`Shot through the heart and you're to blame`,
`You give love a bad name (Bad name)`,
`I play my part and you play your game`,
`You give love a bad name (Bad name)`,
`You give love a...`,
`Oh, shot through the heart and you're to blame`,
`You give love a bad name`,
`I play my part and you play your game`,
`You give love a bad name (Bad name)`,
`Shot through the heart and you're to blame`,
`You give love a bad name (Bad name)`,
`I play my part and you play your game`,
`You give love a bad name (Bad name)`,
`You give love`,
`You give love, bad name`,
]

const sing = (arg1) =>{
    for(let i = 0;i < song.length;i += 1) {
        const arg2 = song[i];
        if(arg1 === arg2) {
            return song[i+1];
        }
    }  
}



const users = [];

class Person {
    constructor(name) {
        this.name= name;
        this.weight = 0;
        this.benchPress = 0;
        this.curvedBenchPress = 0;
        this.deadlift = 0;
        this.squat = 0;
        this.gantry = 0;
    }
}
const addPerson = (name) => {
    users.push(new Person(name)) 
}

const stats = () =>{
    let data = 'Statistic:';
    for(let i = 0;i < users.length;i += 1){
        data += `
        \ ${users[i].name}
        \ weight: ${users[i].weight}
        \ bench press: ${users[i].benchPress}
        \ curved bench press: ${users[i].curvedBenchPress}
        \ deadlift: ${users[i].deadlift}
        \ squat: ${users[i].squat}
        \ gantry: ${users[i].gantry}
        `
    }
    return data;
}
const help = () => {
    return data = `**
    \ help - this tips note 
    \ stats - see all statistic
    \ set NAME EXERCISE KG - set statistc`
}
const set = (data) => {
    let j;
    let notfound = true;

    for( let i = 0; i < users.length; i += 1) {
        if(data[1] === users[i].name) { j = i; notfound = false; }
    } 
    if(notfound === true) {
        return x = 'Bad name!';
    } else {
        notfound = true;
        if (data[2] === 'weight') { users[j].weight = data[3]; notfound = false; }
        if (data[2] === 'benchPress') { users[j].benchPress = data[3]; notfound = false; }
        if (data[2] === 'curvedBenchPress') { users[j].curvedBenchPress = data[3]; notfound = false; }
        if (data[2] === 'deadlift') { users[j].deadlift = data[3]; notfound = false; }
        if (data[2] === 'squat') { users[j].squat = data[3]; notfound = false; }
        if (data[2] === 'gantry') { users[j].gantry = data[3]; notfound = false; }

        if(notfound === true) {
            return x = 'Bad name of argument!';
        } else {
            return x = `${users[j].name} statistic updated!`;
        }
    }

}

client.on('ready', () =>{
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg =>{
    if (msg.content.slice(0,4) === `${config.prefix}addP`) {
        addPerson(msg.content.slice(5,20));
    }
    if (msg.content === `${config.prefix}help`) {
        msg.channel.send(help());

    }
    if (msg.content === `${config.prefix}stats`) {
        msg.channel.send(stats());
    }

    if (msg.content.slice(0,4) === `${config.prefix}set`) {
        const data = msg.content.split(' ');
        set(data);
    }
});

bot.onText(/\/addP (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    addPerson(match[1]);
    bot.sendMessage(chatId,'New person added!');
  });
bot.onText(/\/stats/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, stats());
});
bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, help());
  });
bot.onText(/\/set (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = `/set ${match[1]}`
    const data = resp.split(' ')
    bot.sendMessage(chatId, set(data));
  });


bot.onText(/\(.+)/, (msg) => {
    const chatId = msg.chat.id;
    const mess = sing(msg.text);
    bot.sendMessage(chatId, mess);
});

client.login(config.tokenD);