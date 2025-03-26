const app = require('./app');
const env = require('dotenv').config();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
