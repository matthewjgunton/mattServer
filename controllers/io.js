let sidesReady = 0;
let offenseDown = 0;
let users = [];
let score = [];
let offenseUser = 0;

module.exports = (io) => {
    io.on('connection', socket => {
       // handle various socket connections here
       socket.on("arrival", email => {
         users.push(email);
         score.push(0);
         socket.emit('arrive', email);
         //will make this broadcast later
       })
       socket.on("offenseGo", (obj)=>{
         console.log("object received", obj);
         sidesReady++;
         offenseDown++;
         if(sidesReady == 2){
           //we'll recalculate power here
           // if(offenseDown > 2){
             offenseUser = (offenseUser == 0) ? (1) : (0);
             offenseDown = 0;
           // }
           socket.emit("move", obj);
           sidesReady = 0;
         // }
       })
       socket.on("interception", ()=>{
         offenseUser = (offenseUser == 0) ? (1) : (0);
         socket.emit("turnover", {user: users[offenseUser], score});
         console.log("off board");
       })
       socket.on("touchdown", ()=>{
         score[offenseUser] += 7;
         offenseUser = (offenseUser == 0) ? (1) : (0);
         socket.emit("turnover", {user: users[offenseUser], score});
         console.log("TOUCHDOWN!");
       })
       socket.on("disconnect", (reason) => {

       })
    });
};
