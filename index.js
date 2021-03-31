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
  let length =  (''+time).length;
  if(length === 3){
    let x = String(time).slice(0, 1);
    let y = String(time).slice(1, 3);
    return "0"+x+":"+y;
    
  }else{
    let x = String(time).slice(0, 2);
    let y = String(time).slice(2, 4);
    return x+":"+y;
  }
   
}

function timedata(timetable) {
   let data =  timetable.map(x => { 
    return { 
         start: x.startTime,
         end: x.endTime, 
         fach: x.su[0].longname ,
         raum: x.ro[0].name === "---" 
         ? 
         x.ro[0].orgname 
         :
         x.ro[0].name, 
         lehrer:  
         x.te[0].name === "---" 
         ? 
         x.te[0].orgname 
         :
         x.te[0].name 
        } 
    })
    return data;
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
        //return untis.getOwnTimetableFor(new Date("2021-04-12"));
    })
    .then(timetable => {
        //check lesson 
        setInterval(function () {
            const now = new Date();
            let time = parseInt(now.getHours() + "" + now.getMinutes());
            //let time = 0815

            let data = timedata(timetable);
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