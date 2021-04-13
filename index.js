const cfg = require("./config.js");
const Discord = require('discord.js');
const client = new Discord.Client();
const WebUntis = require("webuntis");
const {beginn, timedata, info, getTime}  = require("./script.js");
let sended = false;

client.on("ready", () => {
    console.log("STARTET")
    client.user.setActivity("COVID-19 PLATIN");
})




const untis = new WebUntis(
    cfg.school.school,
    cfg.school.name,
    cfg.school.pw,
    cfg.school.server
);

untis
    .login()
    .then(() => {
       return untis.getOwnTimetableForToday();
        //return untis.getOwnTimetableFor(new Date("2020-12-04")); 
    })
    .then(timetable => {
        //check lesson 
        setInterval(function () {
            const now = new Date();
            let time = getTime(now)
            //let time = 1005 
            let data = timedata(timetable);
            if (data.some(data => data.start === time) && sended === false) {
                let i = data.findIndex(x => x.start === time);
                client.channels.cache.get(cfg.channel).send(`**Unterricht um ${beginn(data[i].start)} Uhr!** \nFach: ${data[i].fach} \nRaum: ${data[i].raum} \nLehrer: ${data[i].lehrer}${info(data[i].status)}`);
                sended = true
            }
             if(data.some(data => (data.end-1) === time) && sended === true ){
                sended = false
             }
        }, 30000);//check every 30 seconds 
    })
    .catch(err => {
        console.error(err);
    });

//connect bot 
client.login(cfg.token);