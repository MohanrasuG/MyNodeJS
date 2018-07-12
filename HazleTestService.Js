var http = require('http');
var express = require('express');
var app = express();
var fs = require('fs');
var HazelcastClient = require('hazelcast-client').Client;
var Config = require('hazelcast-client').Config;
var config = new Config.ClientConfig();
var bodyparser = require('body-parser');
config.networkConfig.addresses = [{ host: '127.0.0.1', port: '5701' }];
var map = {};
HazelcastClient
    .newHazelcastClient(config)
    .then(function (hazelcastClient) {
        map = hazelcastClient.getMap("persons");
        //insertPerson(map);
        //readPerson(map);
        //deletePerson(map);
    });
var printValue = function (text, value) {
    console.log(text + JSON.stringify(value));
};

app.use(bodyparser.json());

app.get('/listUsers', function (req, res) {
    //fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
    //    console.log(data);
    //    res.end(data);
    //});
    HazelcastClient
        .newHazelcastClient(config)
        .then(function (hazelcastClient) {
            map = hazelcastClient.getMap("persons");
            insertPerson(map);
            readPerson(map);
            //deletePerson(map);
        });
    res.send(200);
})


app.post('/addUsers', function (req, res) {
    //fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
    //    console.log(data);
    //    res.end(data);
    //});
 
    //if (!req.body.firstName || !req.body.lastName || !req.body.age) {
    //    return res.send({ "status": "error", "message": "missing a parameter" });
    //} else {
    console.log(req.body);
    let person = req.body;
    console.log(person);
        map.put(1, person).then(function (previousValue) {
            printValue("Previous value: ", previousValue);
        });
   /// }

   
    res.send(200);
})
var insertPerson = function (map) {
    var person = {
        firstName: "Joe",
        lastName: "Doe",
        age: 42
    };
    map.put(1, person).then(function (previousValue) {
        printValue("Previous value: ", previousValue);
    });
};
var readPerson = function (map) {
    map.get(1).then(function (value) {
        printValue("Value for key=1: ", value);
    })
};
var deletePerson = function (map) {
    map.remove(1).then(function (value) {
        printValue("Previous value: ", value);
    })
};

app.listen(8089);