const express = require('express');
const urlsRouter = require('./routes/urls');
const logger = require('./middleware/logger');

const app = express();

app.use(express.json());
app.use(logger);

const urls = require('./routes/urls');
app.use('/', urls);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});



