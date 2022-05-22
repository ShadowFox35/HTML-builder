const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, './secret-folder'),
  (err, folder) => {
    folder.forEach((file) =>
      fs.stat(
        path.join(__dirname, './secret-folder', file),
        (err, stats) => {
          if (stats.isFile()) {
            const fileName = path.basename(
              file,
              path.extname(file)
            );
            const fileExtension = path
              .extname(file)
              .substring(1);
            const fileSize = stats.size / 1000;

            process.stdout.write(
              `${fileName} - ${fileExtension} - ${fileSize}kb\n`
            );
          }
        }
      )
    );
  }
);
