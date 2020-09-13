const firebase =require('firebase');
const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const express = require('express');

const config = require('./config.json');
const fireBaseC = require('./firebaseConfig.json');

const firebaseConfig = {
    apiKey: fireBaseC.apiKey,
    authDomain: fireBaseC.authDomain,
    databaseURL: fireBaseC.databaseURL,
    projectId: fireBaseC.projectId,
    storageBucket: fireBaseC.storageBucket,
    messagingSenderId: fireBaseC.messagingSenderId,
    appId: fireBaseC.appId,
    measurementId: fireBaseC.measurementId
  };

const MyProject = firebase.initializeApp(firebaseConfig);
MyFirestore = firebase.firestore();
const db = firebase.firestore();

let data = 0;

const loadData = () => {
    db.collection(fireBaseC.dbcollection).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            setData(doc.data());
        });
    });
}
const setData = (arg1) => {
    data = arg1
}
const check = () => {
    setTimeout(() => {
        if (data !== 0) next(); else check();
    }, 10);
}
const next=()=>{
    console.log(data)
};
const pushdata = (dataToPush) => {
    db.collection(fireBaseC.dbcollection).doc(fireBaseC.dbdocument).set({dataToPush})
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });;
};

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
    users.push(new Person(name));
    pushdata(users);
}

const stats = () =>{
    loadData();
    
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

const client = new Discord.Client();
const bot = new TelegramBot(config.tokenT, {polling: true});

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


  bot.onText(/\/(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const mess = sing(match[1]);
    bot.sendMessage(chatId, mess);
});

client.login(config.tokenD);

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});