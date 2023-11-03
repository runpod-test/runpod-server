const logger = require("./utils/logger");
require('dotenv').config();

const app = require('./config/setup-app')();

app.listen(process.env.PORT || 4000, () => {
  logger.info(`Server listening on port: ${process.env.PORT || 4000}`);
});
