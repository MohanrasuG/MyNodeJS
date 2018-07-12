var winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log` 
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});


//logger.log("Logging Hello Message")

logger.log({
    level: 'info',
    message: 'What is the current time'
});

logger.error({ error: "todays time is not great" });

logger.alert={ Info: "Kafka messages are flowing frequently" };