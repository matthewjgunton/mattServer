let users = 0;

module.exports = (io) => {
    io.on('connection', socket => {
       // handle various socket connections here
       socket.on("arrival", email => {
         console.log("Registered!",email);
         socket.emit('arrive', email);
         //will make this broadcast later
         users++;
       })
       socket.on("disconnect", (reason) => {
         // users--;
       })
    });
};
