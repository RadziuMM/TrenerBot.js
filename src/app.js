const firebase =require('firebase');
const TelegramBot = require('node-telegram-bot-api');
const Discord = require('discord.js');
const express = require('express');

const config = require('./config.json');
const fireBaseC = require('./firebaseConfig.json');

console.clear();

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

let users = '';

//fetch users
function loadData() {
    db.collection(fireBaseC.dbcollection).get().then((querySnapshot) => {
        users=[]
        querySnapshot.forEach((doc) => {
            const arg1= doc.data().data;
            try{
                users.push(new Person(arg1[0],arg1[1],arg1[2],arg1[3],arg1[4],arg1[5],arg1[6]))
            } catch (err) {console.log('error:',err)}
        });
    });
}
class Person {
    constructor(name,arg0,arg1,arg2,arg3,arg4,arg5) {
        this.name= name;
        this.weight = arg0;
        this.benchPress = arg1;
        this.curvedBenchPress = arg2;
        this.deadlift = arg3;
        this.squat = arg4;
        this.gantry = arg5;
    }
}
// new Person
let addMessage = '';
const addPerson = (name) => {
    loadData();
    users = '';
    const check = () =>{setTimeout(function(){ if(users === ''){ check() } else {
        for (let i = 0;i < users.length; i += 1) {
            if(name === users[i].name) {
                addMessage = "User exist! Find another name!"; 
            } else { 
                const data =[name, 0 ,0 ,0 ,0 ,0 ,0];
                db.collection(fireBaseC.dbcollection).doc(name).set({data})
                .then(function() {
                    addMessage = 'New user add to server!';
                })
                .catch(function(error) {
                    addMessage = "Error writing document: " + error;
                });
            }
        }
    }},20)}
    check();
}
//show stats
let statsData = '';
const stats = () =>{
    statsData = '';
    users = 'x';
    loadData();
    const check = () =>{
        setTimeout(function(){
            if(users === 'x'){
                check();
            } else {
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
                statsData = data;
            }
        },200)
    }
    check();
}
// help message
const help = () => {
    return data = `**
    \ help
    \ add NAME
    \ del NAME
    \ stats
    \ set NAME EXERCISE KG`
}
// set statistic
let setMessage = ''
const set = (arg) => {
    loadData();
    setMessage = ''
    users = '';
    const check = () =>{
        setTimeout(function(){
            if(users === ''){
                check()
            } else {
                for (let i = 0;i < users.length; i += 1) {
                    if(arg[1] === users[i].name){
                        let w = users[i].weight;
                        let b = users[i].benchPress;
                        let c = users[i].curvedBenchPress;
                        let d = users[i].deadlift;
                        let s = users[i].squat;
                        let g = users[i].gantry;

                        let exist = false;
                        if (arg[2] === 'weight') { w = arg[3]; exist = true; }
                        if (arg[2] === 'benchPress') { b = arg[3]; exist = true; }
                        if (arg[2] === 'curvedBenchPress') { c = arg[3]; exist = true; }
                        if (arg[2] === 'deadlift') { d = arg[3]; exist = true; }
                        if (arg[2] === 'squat') { s = arg[3]; exist = true; }
                        if (arg[2] === 'gantry') { g = arg[3]; exist = true; }
        
                        if(exist === true){
                        const data =[arg[1], w ,b ,c ,d ,s ,g];
                        db.collection(fireBaseC.dbcollection).doc(arg[1]).set({data})
                        setMessage = 'User statistic updated!'
                        } else { setMessage = 'Bad argument!' }
                    } else { setMessage = 'User not exist!' }
                }
            }
                
        },20)
    }
    check();
}
//delete user
let delMessage = '';
const delUser = async (name) => {
    delMessage = '';
    loadData();
    for(let i = 0;i < users.length; i += 1) {
        if(name === users[i].name){
            const res = await db.collection(fireBaseC.dbcollection).doc(name).delete();
            delMessage = 'User deleted!'
        }
    }
    if(delMessage === ''){delMessage = 'Not found that user in base!'}
}
//discord
const client = new Discord.Client();
client.on('message', msg =>{
    if (msg.content.slice(0,4) === `${config.prefix}add`) {
        addPerson(msg.content.slice(5,20));
        addMessage = '';
        const check = () => {setTimeout(function(){ if(addMessage === ''){check() } else { msg.channel.send(addMessage); }},20)}
        check();
    }
    if (msg.content === `${config.prefix}help`) {
        msg.channel.send(help());
        
    }
    if (msg.content === `${config.prefix}stats`) {
        stats();
        const check = () =>{setTimeout(function(){ if(statsData === ''){ check() } else { msg.channel.send(statsData); }},200)}
        check();
    }
    if (msg.content.slice(0,4) === `${config.prefix}set`) {
        const data = msg.content.split(' ');
        set(data);
        setMessage = '';
        const check = () =>{setTimeout(function(){ if(setMessage === ''){ check() } else { msg.channel.send(setMessage); }},20)}
        check();
    }
    if (msg.content.slice(0,4) === `${config.prefix}del`) {
        const data = msg.content.split(' ');
        delUser(data[1])
        const check = () =>{setTimeout(function(){ if(delMessage === ''){ check() } else { msg.channel.send(delMessage); }},20)}
        check();
    }
});
client.login(config.tokenD);
//telegram
const bot = new TelegramBot(config.tokenT, {polling: true});
bot.onText(/\/(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const task = match[0]
    const command = task.split(' ');
    if (command[0] === '/add'){
        const array = match[1].split(' ')
        addPerson(array[1]);
        addMessage = '';
        const check = () => {setTimeout(function(){ if(addMessage === ''){ check() } else { bot.sendMessage(chatId, addMessage);}},20)}
        check();
    }
    if (command[0] === '/stats'){
        stats();
        const check = () =>{setTimeout(function(){ if(statsData === ''){ check() } else { bot.sendMessage(chatId, statsData); }},200)}
        check();
    }
    if (command[0] === '/help'){
        bot.sendMessage(chatId, help());
    }
    if (command[0] === '/set'){
        set(command);
        setMessage = '';
        const check = () =>{setTimeout(function(){ if(setMessage === ''){ check() } else { bot.sendMessage(chatId, setMessage); }},20)}
        check();
    }
    if (command[0] === '/del'){
        delUser(command[1])
        const check = () =>{setTimeout(function(){ if(delMessage === ''){ check() } else { bot.sendMessage(chatId, delMessage); }},20)}
        check();
    }
});
//hosting
const app = express();
app.set('port', (process.env.PORT || 5000));
app.get('/', function(request, response) {
    const result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});