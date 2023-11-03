const {format, createLogger, transports} = require("winston");
const {combine, timestamp, prettyPrint} = format;

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint(),
  ),
  defaultMeta: {service: 'images-service'},
  transports: [
    new transports.File({filename: 'logs/error.log', level: 'error'}),
    new transports.File({filename: 'logs/combined.log'}),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.json(),
  }));
}

module.exports = logger;
