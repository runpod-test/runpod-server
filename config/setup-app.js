const cors = require('cors');
const express = require('express');
const routes = require('../src/router/router');

// This could potentially control things like database setup
// where you can plug and play the database
const runpodApplication = () => {
  const app = express();
  const v1Router = express.Router();

  app
    .use(cors())
    .use(express.json())
    .use((req, res, next) => {
      res.contentType('application/json');
      next();
    })
    .use('/api/v1/', v1Router);

  routes(v1Router);

  return app;
};

module.exports = runpodApplication;
