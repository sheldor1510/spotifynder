const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Start server
sequelize.sync({ force: false }).then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
