////var myLogModule = require('./Log.js');
////myLogModule.info('Node.js started');

//var msg = require('./Message.js');
//console.info(msg);

//var msg = require('./Message.js');
//console.log(msg.SimpleMessage);

//var msg = require('./Log.js');

//msg.log('Hello World');

////var person = require('./data.js');

////console.log(person.FirstName + " " + person.LastName);  


//var person = require('./Person.js');

//var person1 = new person('Thirulok', 'Mohan');

//console.log(person1.fullname());



//var express = require('express')
//var router = express.Router();

//router.get('/', function(req, res, next) {
//    res.sendFile('index.html');
// });


const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const port = process.env.PORT || 4001;
const index = require("./public/index");
const app = express();
app.use(index);
const server = http.createServer(app);
const io = socketIo(server);
io.on("connection", socket => {
    console.log("New client connected"), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect", () => console.log("Client disconnected"));
});
const getApiAndEmit = async socket => {
    try {
       
        socket.emit("FromAPI", "Hello world");
    } catch (error) {
        console.error(`Error: ${error.code}`);
    }
};
server.listen(port, () => console.log(`Listening on port ${port}`));



