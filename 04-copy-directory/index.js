const path = require('path');
const fs = require('fs');

const oldPath = path.join(__dirname, 'files');
const newPath = path.join(__dirname, 'files-copy');

fs.access(newPath, (err) => {
  if (err) {
    copyDir(oldPath, newPath);
  } else
    fs.rm(newPath, { recursive: true }, (err) => {
      if (err) throw err;
      copyDir(oldPath, newPath);
    });
});

async function copyDir(oldPath, newPath) {
  await fs.promises.mkdir(newPath, { recursive: true });
  const folder = await fs.promises.readdir(oldPath, {
    withFileTypes: true,
  });

  folder.forEach((file) =>
    fs.promises.copyFile(
      path.join(oldPath, `${file.name}`),
      path.join(newPath, `${file.name}`)
    )
  );
}
