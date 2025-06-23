const fs = require('fs');
const path = require('path');

function logger(req, res, next) {
  const log = `${new Date().toISOString()} | ${req.method} ${req.url} | IP: ${req.ip}\n`;
  fs.appendFile(path.join(__dirname, '../../logs.txt'), log, (err) => {
    if (err) {
      console.error("Logger error:", err);
    }
  });
  next();
}

module.exports = logger;
