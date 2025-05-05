const app = require('./app');
const env = require('dotenv').config({ path: '.env.development' });
const port = process.env.PORT || 5000;
const { createTables } = require('./config/config');
async function startServer() {
  try {
    await createTables();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
