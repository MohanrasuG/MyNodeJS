//require everything
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = 8080;
//Basic NodeJS stuff 

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//Call SocketIO with the message from Kafka 
function callSockets(io, message) {
    io.sockets.emit('channel', message);
}
// Init the Kafka client. Basically just make topic the same topic as your producer and you are ready to go. group-id can be anything. 
var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client(),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'AutoUpdateTest' }
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

    fs.writeFile(__dirname + "/public/river_data/" + key + "/" + seconds + ".json", JSON.stringify(message), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});


//update function 
function update(message1, caller, flowInfo) {
    if (caller == 0) {
        var message1 = JSON.parse(message1.value)
    }
    var tx = message1.some_text;
    var colorS = color(message1.height);
    svg.append("circle")
        .attr("cx", function (d) {
            return projection([message1.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude, message1.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude])[0];
        })
        .attr("cy", function (d) {
            return projection([message1.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude, message1.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude])[1];
        })
        .attr("r", 4) // circle radius
        .attr("id", "dot" + "wwd")
        .style("fill", colorS)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(tx)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(1000)
                .style("opacity", 0);
        });
}
//init socket 
//var socket = io();

//on message call update 
io.sockets.on('chat message', function (msg) {
    update(msg, 0);
});