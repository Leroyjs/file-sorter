const path = require("path"),
  util = require("util"),
  fs = require("fs");

const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

(async () => {
  const targetDirectory = process.argv[2];

  if (!targetDirectory) {
    console.log("Specify the target directory");
    return;
  }
  const files = await getFilesDir(targetDirectory);
  const sortFiles = sort(files);
  console.log(sortFiles);
  changeDirFiles(sortFiles, targetDirectory);
})();
function changeDirFiles(files, targetDirectory) {
  files.forEach((element) => {
    const oldPath = path.join(__dirname, element.path);
    const newPathDir = path.join(__dirname, "build", element.title[0]);
    const newPath = path.join(
      __dirname,
      "build",
      element.title[0],
      element.title
    );
    fs.mkdir(newPathDir, { recursive: true }, (err) => {
      if (err) throw err;
      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
      });
    });
  });
}
function sort(files) {
  return files.sort((a, b) => {
    if (a.title > b.title) {
      return 1;
    }
    if (a.title < b.title) {
      return -1;
    }
    return 0;
  });
}
async function getFilesDir(targetDirectory) {
  let files = [];
  const filesInDirectory = await readdir(targetDirectory);

  for (const file of filesInDirectory) {
    await checkItem(file);
  }
  async function checkItem(item) {
    const itemPath = path.join(targetDirectory, item);
    const stats = await stat(itemPath);

    if (stats.isDirectory()) {
      files = [...(await getFilesDir(itemPath)), ...files];
    } else {
      files.push({
        title: item,
        path: itemPath,
      });
    }
  }
  return files;
}
