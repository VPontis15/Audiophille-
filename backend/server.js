const app = require('./app');
const env = require('dotenv').config();
const port = process.env.PORT || 5000;
const { createTables } = require('./config/config');
async function startServer() {
  try {
    await createTables(); // Uncommented to ensure tables are created
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
