const path = require("path"),
  fs = require("fs");

const readdir = fs.readdir;
const stat = fs.stat;

(() => {
  const targetDirectory = process.argv[2];

  if (!targetDirectory) {
    console.log("Specify the target directory");
    return;
  }

  getFilesDir(targetDirectory, sortFiles);
})();

function sortFiles(files) {
  const sortFiles = sort(files);
  changeDirFiles(sortFiles);
}

function changeDirFiles(files) {
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
function getFilesDir(targetDirectory, mainCB) {
  let files = [];

  readdir(targetDirectory, (err, files) => {
    if (!err) {
      fileIterator(files, checkItem);
    } else {
      console.log(err);
    }
  });

  function checkItem(item, callback) {
    const itemPath = path.join(targetDirectory, item);

    stat(itemPath, (err, stat) => {
      if (stat.isDirectory()) {
        files = [...getFilesDir(itemPath), ...files];
      } else {
        files.push({
          title: item,
          path: itemPath,
        });
      }
      callback && callback(files);
    });
  }

  function fileIterator(files, callback) {
    const numberOfFiles = files.length;
    let iterationNumber = 1;
    for (const file of files) {
      if (numberOfFiles === ++iterationNumber) {
        callback(file);
      } else {
        callback(file, mainCB);
      }
    }
  }
}
