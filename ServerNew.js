var kafka = require('kafka-node'),
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient({ kafkaHost: 'sacvl385.sac.flextronics.com:9092' }),
    consumer = new Consumer(
        client,
        [
            { topic: 'sacvl-autoupdates' }
        ],
        {
            groupId: 'my-group'
        }
    );
consumer.on('message', function (message) {
    console.log(message);
});
consumer.on('error', function (err) {
    console.log(err);
});

