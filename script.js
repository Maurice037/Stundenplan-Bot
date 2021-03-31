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

  module.exports = {beginn, timedata}