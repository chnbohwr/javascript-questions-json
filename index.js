const fs = require('fs');
const path = require('path');
const md5 = require('md5');
__dirname = path.resolve();

// generate question absolute path
const questionPath = path.resolve(__dirname, 'javascript-questions/en-EN/README.md');
const distPath = path.resolve(__dirname, 'dist/');
const jsPath = path.resolve(__dirname, 'dist/js');
const picPath = path.resolve(__dirname, 'dist/pic');
const distJsonFile = path.resolve(distPath, 'question.json');

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

// create file read stream
const text = fs.readFileSync(questionPath).toString();
const questionMarkdown = text.substr(text.indexOf('######'), text.length).replace(/\n\n/g, '\n');
var questionArray = questionMarkdown.split('---\n');

const getQuestionTitle = (questionText) => {
  return questionText.match(/\d+. ([^?|\.]+)/)[0] + '?';
};

const getQuestionJS = (questionText) => {
  const start = questionText.indexOf('```javascript\n');
  const end = questionText.indexOf('\n```', start);
  if (start > -1) {
    return questionText.slice(start + 14, end);
  }
  return undefined;
};

const getQuestionOptions = (questionText) => {
  return questionText.match(/[A|B|C|D|E]:([^\\\n]+)/g);
};

const getQuestionAnswer = (questionText) => {
  const start = questionText.indexOf('#### Answer:') + 13;
  const end = questionText.indexOf('\n', start);
  return answerParser(questionText.slice(start, end));
};

const getQuestionDesc = (questionText) => {
  const start = questionText.indexOf('#### Answer:') + 5;
  const end = questionText.indexOf('\n</p>');
  return questionText.slice(start, end);
};

const questions = questionArray.map(questionText => {
  const title = getQuestionTitle(questionText);
  const question = getQuestionJS(questionText);
  const options = getQuestionOptions(questionText);
  const answer = getQuestionAnswer(questionText);
  const desc = getQuestionDesc(questionText);
  return {
    id: md5(title), title, question, options, answer, desc
  };
});

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
  fs.mkdirSync(jsPath, { recursive: true });
  fs.mkdirSync(picPath, { recursive: true })
}
fs.writeFileSync(distJsonFile, JSON.stringify(questions));

questions.forEach((questionData) => {
  if (questionData.question) {
    fs.writeFile(path.resolve(jsPath, `${questionData.id}.js`), questionData.question, () => { })
  }
});


/**
 * '###### 101. What\'s the value of output?\n```javascript\nconst one = (false || {} || null)\nconst two = (null || false || "")\nconst three = ([] || 0 || true)\nconsole.log(one, two, three)\n```\n- A: `false` `null` `[]`\n- B: `null` `""` `true`\n- C: `{}` `""` `[]`\n- D: `null` `null` `true`\n<details><summary><b>Answer</b></summary>\n<p>\n#### Answer: C\nWith the `||` operator, we can return the first truthy operand. If all values are falsy, the last operand gets returned.\n`(false || {} || null)`: the empty object `{}` is a truthy value. This is the first (and only) truthy value, which gets returned. `one` is equal to `{}`.\n`(null || false || "")`: all operands are falsy values. This means that the past operand, `""` gets returned. `two` is equal to `""`.\n`([] || 0 || "")`: the empty array`[]` is a truthy value. This is the first truthy value, which gets returned. `three` is equal to `[]`.\n</p>\n</details>\n'
 */