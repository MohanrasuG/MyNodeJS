var http = require('http');
var fs = require('fs');
var HazelcastClient = require('hazelcast-client').Client;
var Config = require('hazelcast-client').Config;
var config = new Config.ClientConfig();
config.networkConfig.addresses = [{ host: '127.0.0.1', port: '5701' }];
var map = {};
HazelcastClient
    .newHazelcastClient(config)
    .then(function (hazelcastClient) {
        map = hazelcastClient.getMap("persons");
        insertPerson(map);
        readPerson(map);
        deletePerson(map);
    });
var printValue = f/unction (text, value) {
    console.log(text + JSON.stringify(value));
};
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
