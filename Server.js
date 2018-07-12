//var express = require('express');//Importing Express
//var app = express();//Getting App From Express
//var fs = require('fs');//Importing File System Module To Access Files
//const port = 8080;//Creating A Constant For Providing The Port
////Routing Request : http://localhost:port/
//app.get('/', function (request, response) {
//    //Telling Browser That The File Provided Is A HTML File
//    response.writeHead(200, { "Content-Type": "text/html" });
//    //Passing HTML To Browser
//    response.write(fs.readFileSync("./public/index.html"));
//    //Ending Response
//    response.end();
//})
////Routing To Public Folder For Any Static Context
//app.use(express.static(__dirname + '/public'));
//console.log("Server Running At:localhost:" + port);
//var io = require('socket.io').listen(app.listen(port));//Telling Express+Socket.io App To Listen To Port
//io.sockets.on("connection", function (socket) {
//    socket.emit("Start_Chat");
//    //On Event Registar_Name
//    socket.on("Register_Name", function (data) {
//        io.sockets.emit("r_name", "<strong>" + data + "</strong> Has Joined The Chat");
//        //Now Listening To A Chat Message
//        socket.on("Send_msg", function (data) {
//            io.sockets.emit("msg", data);
//            //Now Listening To A Chat Message
//        })
//    })
//})

'use strict';
const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }
const messageSender = new MyEmitter();

var http = require('http');
var fs = require('fs');
var messagetosend = "";
var rloadm = ('require-reload');

var messageCount = 0;
// Loading the index file . html displayed to the client
var server = http.createServer(function (req, res) {
    fs.readFile('./public/index.html', 'utf-8', function (error, content) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
    });
});

//Call SocketIO with the message from Kafka 
function callSockets(io, message) {
    io.sockets.emit('channel', message);
}

//var kafka = require('kafka-node'),
//    Consumer = kafka.Consumer,
//    client = new kafka.KafkaClient({ kafkaHost: 'xxx.yyy.83.91:9092,xxx.yyy.70.227:9092' }),
//    options = {
//        groupId: GROUP_ID
//    },
//    consumer = new Consumer(client, [{ topic: 'test-topic' }], options);

//consumer.on('message', (message) => {
//    console.log(message);
//});
// Init the Kafka client. Basically just make topic the same topic as your producer and you are ready to go. group-id can be anything. 
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({kafkaHost:'10.209.3.88:9092'}),
    consumer = new Consumer(
        client,
        [
            { topic: 'KafkaFlexTest' }
        ],
        {
            groupId: 'my-group'
        }
    );
  consumer.on('message', function (message) {
    //Call our SocketIO function 
    callSockets(io, message);
    // Saving the message is optional but reccomended in case you need it again
    // In production you could write the record directly to your database. But for now we are just going to create an index of files.
    var fs = require('fs');
    var key = message.key
    var seconds = new Date().getTime() / 1000;

    messagetosend = message.value;
    fs.writeFile(__dirname + "/public/river_data/" + key + "/" + seconds + ".json", JSON.stringify(message), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log(messagetosend);
      });


      //const ProducerStream = require('./lib/producerStream');
      //const ConsumerGroupStream = require('./lib/consumerGroupStream');
      //const resultProducer = new ProducerStream();

      //const consumerOptions = {
      //    kafkaHost: '127.0.0.1:9092',
      //    groupId: 'ExampleTestGroup',
      //    sessionTimeout: 15000,
      //    protocol: ['roundrobin'],
      //    asyncPush: false,
      //    id: 'consumer1',
      //    fromOffset: 'latest'
      //};

      //const consumerGroup = new ConsumerGroupStream(consumerOptions, 'KafkaFlexTest');

      //const messageTransform = new Transform({
      //    objectMode: true,
      //    decodeStrings: true,
      //    transform(message, encoding, callback) {
      //        console.log(`Received message ${message.value} transforming input`);
      //        callback(null, {
      //            topic: 'KafkaFlexTest',
      //            messages: `You have been (${message.value}) made an example of`
      //        });
      //    }
      //});

      //consumerGroup.pipe(messageTransform).pipe(resultProducer);


    io.sockets.on('connection', function (socket) {
        console.log('A client is connected!');
    });

    //messageSender.emit('sendMessage', messagetosend)
     
    io.sockets.on('connection', function (socket) {
        //socket.emit('message', JSON.stringify(messagetosend));

        
        setInterval(function () {
            //var stockprice = Math.floor(Math.random() * 1000);
            io.emit('stock price update', JSON.stringify(messagetosend));
        }, 50000);

        //socket.broadcast.emit('message', JSON.stringify(messagetosend));
        socket.send('message', messagetosend);
        socket.on('sendMessage', function (messagetosend) {
            socket.emit('RecebTemp', messagetosend);           
        });

       

        // When the server receives a “message” type signal from the client   
        io.on('message', function (messagetosend) {
            console.log('A client is speaking to me! They’re saying: ' + messagetosend);
        });
    });
});

//rloadm.client.autoRefresh;
// Loading socket.io
var io = require('socket.io').listen(server);

// When a client connects, we note it in the console

server.listen(8080);