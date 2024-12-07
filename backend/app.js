const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); // Import Sequelize instance
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Sync database and start server
sequelize.sync().then(() => {
  console.log('Database synced.');
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
  });
});
