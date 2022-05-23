const path = require('path');
const fs = require('fs');

const projectDist = path.join(__dirname, 'project-dist');

const copyAssets = async (copyFrom, copyIn) => {
  await fs.promises.rm(copyIn, {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(copyIn);
  const items = await fs.promises.readdir(copyFrom, {
    withFileTypes: true,
  });
  items.forEach(async (file) => {
    if (file.isFile()) {
      await fs.promises.copyFile(
        path.join(copyFrom, file.name),
        path.join(copyIn, file.name)
      );
    } else {
      await copyAssets(
        path.join(copyFrom, file.name),
        path.join(copyIn, file.name)
      );
    }
  });
};

const styles = async () => {
  const writeStream = fs.createWriteStream(
    path.join(projectDist, 'style.css'),
    'utf-8'
  );
  const stylePath = path.join(__dirname, 'styles');
  const files = await fs.promises.readdir(stylePath, {
    withFileTypes: true,
  });
  files
    .filter((file) => file.isFile())
    .forEach(async (file) => {
      const filePath = path.join(stylePath, file.name);
      if (path.extname(filePath) === '.css') {
        const readStream = fs.createReadStream(
          filePath,
          'utf-8'
        );
        readStream.pipe(writeStream);
      }
    });
};

const getFiles = async () => {
  const result = {};
  const componentsPath = path.join(__dirname, 'components');
  const components = await fs.promises.readdir(
    componentsPath,
    { withFileTypes: true }
  );
  for (const file of components) {
    const filePath = path.join(componentsPath, file.name);
    if (
      file.isFile() &&
      path.extname(filePath) === '.html'
    ) {
      const data = await fs.promises.readFile(filePath);
      result[file.name] = data.toString();
    }
  }
  return result;
};

const html = async () => {
  const comps = await getFiles();
  const stream = fs.createWriteStream(
    path.join(projectDist, 'index.html')
  );

  fs.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
    (err, data) => {
      if (err) throw err.message;
      let readResult = data;
      for (const comp of Object.keys(comps)) {
        readResult = readResult.replace(
          `{{${comp.split('.')[0]}}}`,
          comps[comp]
        );
      }
      stream.write(readResult);
    }
  );
};

const start = async () => {
  await fs.promises.rm(projectDist, {
    recursive: true,
    force: true,
  });
  await fs.promises.mkdir(projectDist);
  await copyAssets(
    path.join(__dirname, 'assets'),
    path.join(projectDist, 'assets')
  );
  await styles();
  await html();
};

start();
