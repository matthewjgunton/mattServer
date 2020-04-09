let offenseDown = 0;
let users = [];
let score = [];
let offenseUser = 0;

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
         offenseDown++;
           //we'll recalculate power here
           if(offenseDown > 2){
             offenseUser = (offenseUser == 0) ? (1) : (0);
             offenseDown = 0;
             io.emit("turnover", {users, user: users[offenseUser], score});

           }else{
             // offenseDown = 0;
             // offenseUser = (offenseUser == 0) ? (1) : (0);
             obj.downs = offenseDown;
             io.emit("move", obj);
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
         for(let i = 0; i < users.length; i++){
           if(users[i]===socket.name){
             users.splice(i, 1);
           }
         }
/*		socket.get('username', function(err, user) {
		      delete users[user];
		      socket.emit('update', users);
		    });
*/	  })
    });
};
