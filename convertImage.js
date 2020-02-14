const fs = require('fs');
const path = require('path');
const { convert, IMAGE_FORMATS, LANGUAGES, THEMES } = require('catage');
const jsPath = path.resolve(__dirname, 'dist/js');
const picPath = path.resolve(__dirname, 'dist/pic');

const result = fs.readdirSync(jsPath);

function* generateFileIterator() {
  yield* result;
}

const fileIterator = generateFileIterator()

const execute = async() => {
  const file = fileIterator.next();
  if (file.done) {
    return;
  }
  const jsName = file.value;
  const filePath = path.resolve(jsPath, jsName);
  const outputName = `${jsName.substr(0, jsName.indexOf('.'))}.png`;
  console.log(`converting ${outputName} ...`);
  await convert({
    inputFile: filePath,
    outputFile: path.resolve(picPath, outputName),
    language: LANGUAGES.JAVASCRIPT,
    theme: THEMES.ATOMONELIGHT,
    format: IMAGE_FORMATS.PNG,
    hasFrame: false,
    ignoreLineNumbers: true,
  });
  execute();
}

execute();