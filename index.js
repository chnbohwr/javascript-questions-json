const fs = require('fs');
const path = require('path');
const md5 = require('md5');

// generate question absolute path
const questionPath = path.resolve(__dirname, 'javascript-questions/en-EN/README.md');
const distPath = path.resolve(__dirname, 'dist/');
const jsPath = path.resolve(__dirname, 'dist/js');
const picPath = path.resolve(__dirname, 'dist/pic');
const distJsonFile = path.resolve(distPath, 'question.json');

// create file read stream
const questionMarkdown = fs.readFileSync(questionPath).toString();

let questionObj = {};
let questionJSTextArr = [];
let descText = '';
let questionOption = [];
let recordQuestion = false;
let recordDesc = false;
const questions = [];

const answerParser = (answerText) => {
  switch (answerText) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    case 'E':
      return 4;
    default:
      return undefined;
  }
}

const readlineHandler = (lineString) => {
  const isQuestionTitle = lineString.indexOf('######') === 0;
  const isQuestionScopeTop = lineString.indexOf('```javascrip') === 0;
  const isQuestionScopeEnd = lineString === '```'
  const isOption = lineString.indexOf('- ') === 0;
  const isAnswer = lineString.indexOf('#### Answer:') === 0;
  const isDescEnd = lineString.indexOf('</p>') === 0;

  if (!questionObj.title && isQuestionTitle) {
    questionObj.title = lineString.substr(7, 999);
    // console.log('find title', questionObj);
    return;
  }

  if (questionObj.title && isQuestionScopeTop) {
    // console.log('find scopeTop');
    recordQuestion = true;
    return;
  }

  if (questionObj.title && isQuestionScopeEnd && recordQuestion) {
    recordQuestion = false;
    const question = questionJSTextArr.join('\n');
    questionObj.question = question;
    questionObj.id = md5(question);
    questionJSTextArr = [];
    // console.log('scopeEnd', questionObj);
    return;
  }

  if (questionObj.title && recordQuestion) {
    questionJSTextArr.push(lineString)
    return;
  }

  if (isOption) {
    questionOption.push(lineString.substr(2, 999));
    return;
  }

  if (isAnswer) {
    questionObj.options = questionOption;
    questionOption = [];
    questionObj.answer = answerParser(lineString.substr(13, 1));
    recordDesc = true;
    return;
  }

  if (recordDesc && !isDescEnd) {
    descText += `${lineString}`;
    return;
  }

  if (isDescEnd) {
    questionObj.desc = descText;
    descText = '';
    recordDesc = false;
    // console.log(questionObj);
    questions.push(questionObj);
    questionObj = {};
    return;
  }
}
questionMarkdown.substr(questionMarkdown.indexOf('######'), questionMarkdown.length).split('\n').forEach(readlineHandler);
console.log('parse question success, length: ', questions.length);
if(!fs.existsSync(distPath)){
  fs.mkdirSync(distPath, { recursive: true });
  fs.mkdirSync(jsPath, { recursive: true });
  fs.mkdirSync(picPath, { recursive: true })
}
fs.writeFileSync(distJsonFile, JSON.stringify(questions));

questions.forEach((questionData) => {
  if(questionData.question){
    fs.writeFile(path.resolve(jsPath, `${questionData.id}.js`), questionData.question, () => { })
  }
});