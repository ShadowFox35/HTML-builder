const fs = require('fs');
const path = require('path');

const currentFolder = path.resolve(__dirname, 'styles');
const finalFolder = path.resolve(__dirname, 'project-dist');

const writeStream = fs.createWriteStream(
  path.resolve(finalFolder, 'bundle.css')
);

async function createBundle() {
  const folder = await fs.promises.readdir(currentFolder, {
    withFileTypes: true,
  });

  folder.forEach((file) => {
    if (
      file.isFile() &&
      path.extname(
        path.resolve(currentFolder, `${file.name}`)
      ) === '.css'
    ) {
      const readStream = fs.createReadStream(
        path.resolve(currentFolder, file.name)
      );
      readStream.pipe(writeStream, { end: false });
    }
  });
}

createBundle();
