const fs = require('fs');
fs.createReadStream('./01-read-file/text.txt').pipe(
  process.stdout
);
