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
         socket.emit('arrive', {email, offenseUser, users});
         //will make this broadcast later
       })
       socket.on("offenseGo", (obj)=>{
         console.log("object received", obj);
         offenseDown++;
           //we'll recalculate power here
           if(offenseDown > 2){
             offenseUser = (offenseUser == 0) ? (1) : (0);
             offenseDown = 0;
             socket.emit("move", obj);
           }else{
             offenseDown = 0;
             offenseUser = (offenseUser == 0) ? (1) : (0);
             socket.emit("turnover", {users, user: users[offenseUser], score});
           }
       })
       socket.on("interception", ()=>{
         offenseDown = 0;
         offenseUser = (offenseUser == 0) ? (1) : (0);
         socket.emit("turnover", {users, user: users[offenseUser], score});
         console.log("off board");
       })
       socket.on("touchdown", ()=>{
         offenseDown = 0;
         score[offenseUser] += 7;
         offenseUser = (offenseUser == 0) ? (1) : (0);
         socket.emit("turnover", {users, user: users[offenseUser], score});
         console.log("TOUCHDOWN!");
       })
       socket.on("disconnect", (reason) => {

       })
    });
};
