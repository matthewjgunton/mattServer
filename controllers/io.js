let offenseDown = 0;
let users = [];
let score = [];
let offenseUser = 0;
let offenseResponded = 0;
let defenseResponded = 0;
let angle = 0;
let defAngle = 0;
let power = 0;

module.exports = (io) => {
    io.on('connection', socket => {
       // handle various socket connections here
       socket.on("arrival", email => {
         socket.name = email;
         users.push(email);
         score.push(0);
	console.log(users);
         io.emit('arrive', {email, offenseUser, users});
         //will make this broadcast later
       })
       socket.on("offenseGo", (obj)=>{
         console.log("object received", obj);
           if(power == -1){
             defenseResponded++;
             defAngle = obj.angle > 50 ? (-.5) : (5);
           }else{
              offenseDown++;
              offenseResponded++;
              angle = obj.angle;
              power = obj.power;
           }
           //we'll recalculate power here
           if(offenseResponded > 0 && defenseResponded > 0){
             offenseResponded = 0;
             defenseResponded = 0;
             angle += defAngle;
             if(offenseDown > 2){
               offenseUser = (offenseUser == 0) ? (1) : (0);
               offenseDown = 0;
               io.emit("turnover", {users, user: users[offenseUser], score});
             }else{
               obj.downs = offenseDown;
               io.emit("move", {angle, power, user: obj.user});
             }
           }
       })
       socket.on("interception", ()=>{
         offenseDown = 0;
         offenseUser = (offenseUser == 0) ? (1) : (0);
         io.emit("turnover", {users, user: users[offenseUser], score});
         console.log("off board");
       })
       socket.on("touchdown", ()=>{
         offenseDown = 0;
         score[offenseUser] += 7;
         offenseUser = (offenseUser == 0) ? (1) : (0);
         io.emit("turnover", {users, user: users[offenseUser], score});
         console.log("TOUCHDOWN!");
       })
       socket.on("disconnect", (reason) => {
	        console.log(socket.name, " is leaving");
          for(let i = 0; i < users.length; i++){
           if(users[i]===socket.name){
             users.splice(i, 1);
           }
         }
	    })
  });
};
