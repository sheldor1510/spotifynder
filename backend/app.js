const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); 
const routes = require('./routes'); // Import the routes
require('dotenv').config()


const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced.');
  app.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
  });
});

