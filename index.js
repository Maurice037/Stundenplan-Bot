const cfg = require("./config.js");
const Discord = require('discord.js');
const client = new Discord.Client();
const WebUntis = require("webuntis");

let x = false;

client.on("ready", () => {
    console.log("STARTET")
    client.user.setActivity("COVID-19 PLATIN");
})

function beginn(time) {
    let x = String(time).slice(0, 2);
    let y = String(time).slice(2, 4);
    return x+":"+y;
}


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
    })
    .then(timetable => {
        //check lesson 
        setInterval(function () {
            const now = new Date();
            let time = parseInt(now.getHours() + "" + now.getMinutes());
            let data = timetable.map(x => { return { start: x.startTime, end: x.endTime, fach: x.su[0].longname, raum: x.ro[0].orgname, lehrer: x.te[0].orgname } })
            if (data.some(data => data.start === time) && x === false) {
                let i = data.findIndex(x => x.start === time);
                client.channels.cache.get(cfg.channel).send(`**Unterricht um ${beginn(data[i].start)} Uhr!** \nFach: ${data[i].fach} \nRaum: ${data[i].raum} \nLehrer: ${data[i].lehrer}`);

                x = true
            }
             if(data.some(data => data.end === time) && x === true ){
                 x = false
             }
        }, 30000);//check every 30 seconds 
    })
    .catch(err => {
        console.error(err);
    });

//connect bot 
client.login(cfg.token);