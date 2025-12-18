let questions = [];
let question = null;

const display = document.getElementById('pConsole');
const qButton = document.getElementById('questionbutton');
const aButton = document.getElementById('answerbutton');
const csvSelect = document.getElementById('csvSelect'); // csv selector dropdown
let currentCsv = csvSelect.value; // select questions database

function parseLine(line) {
  const values = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      insideQuotes = !insideQuotes; // toggle quote state
    } else if (char === ',' && !insideQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim()); // push remainder
  return values;
}

// load questions from csv
function loadQuestions(csvFile) {
  fetch(csvFile)
    .then(response => {
      if (!response.ok) throw new Error(`failed to load ${csvFile}`);
      return response.text();
    })
    .then(data => {
      questions = []; // reset questions array

      // split CSV into lines (handles multi-line class diagrams)
      const lines = [];
      let currentLine = '';
      let insideQuotes = false;

      for (let i = 0; i < data.length; i++) {
        const char = data[i];

        if (char === '"') insideQuotes = !insideQuotes;

        if (char === '\n' && !insideQuotes) {
          lines.push(currentLine);
          currentLine = '';
        } else {
          currentLine += char;
        }
      }
      if (currentLine) lines.push(currentLine);

      // parse each line into fields
      for (let i = 1; i < lines.length; i++) { 
        if (!lines[i].trim()) continue; // skip empty lines

        const values = parseLine(lines[i]);

        const questionObject = {
          questionID: values[0],
          question: values[1].replace(/^"|"$/g, ''), // remove surrounding quotes
          answer: values[2] ? values[2].replace(/^"|"$/g, '') : '',
          marks: values[3]
        };

        questions.push(questionObject);
      }

      display.value = `loaded ${questions.length} questions from ${csvFile}`;
      aButton.disabled = true;
    })
    .catch(err => console.error(err));
}

// initial load
loadQuestions(currentCsv);

// update questions when dropdown changes
csvSelect.addEventListener('change', () => {
  currentCsv = csvSelect.value;
  loadQuestions(currentCsv);
  display.value = '';
  aButton.disabled = true;
});



// initial load
loadQuestions(currentCsv);

// update questions when dropdown changes
csvSelect.addEventListener('change', () => {
  currentCsv = csvSelect.value;
  loadQuestions(currentCsv);
});

// Show random question
qButton.addEventListener('click', function() {
  if (questions.length === 0) {
    display.value = 'No questions loaded yet.';
    return;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  question = questions[randomIndex];
  display.value = 'Q' + question.questionID + ':\n' + question.question;

  aButton.disabled = false;
});

// Show answer
aButton.addEventListener('click', function() {
  if (currentCsv === "classquestions.csv") {
    const modelAnswer = parseModelAnswer(question.answer);
    const studentText = pScript.value;
    const studentScore = markClassAnswer(studentText, modelAnswer);

    // display answer and score
    display.value = 'Answer:\n' + question.answer + '\n\n[Mark]: ' + studentScore + ' / 5';
  } else {
    // normal code question
    display.value += '\n\nAnswer:\n' + question.answer + '\n\n[Mark]: ' + question.marks;
  }

  aButton.disabled = true;
});


// extract mark scheme comparator
function parseModelAnswer(answerText) {
  const lines = answerText.split('\n').map(line => line.trim());
  const modelAnswer = {
    className: "",
    attributes: [],
    constructorParams: [],
    getters: [],
    setters: []
  };

  let currentMethod = null;

  for (const line of lines) {
    if (line.startsWith('class ')) {
      modelAnswer.className = line.replace('class ', '').trim();
    } else if (line.startsWith('private ')) {
      // get attribute name
      const attr = line.replace('private ', '').trim();
      modelAnswer.attributes.push(attr);
    } else if (line.startsWith('procedure new(')) {
      currentMethod = 'constructor';
      // extract params
      const params = line.match(/\((.*)\)/);
      if (params) {
        modelAnswer.constructorParams = params[1].split(',').map(p => p.trim());
      }
    } else if (line.startsWith('function get')) {
      currentMethod = 'getter';
      const getterName = line.replace('function ', '').trim();
      modelAnswer.getters.push(getterName);
    } else if (line.startsWith('procedure set')) {
      currentMethod = 'setter';
      const setterName = line.replace('procedure ', '').trim();
      modelAnswer.setters.push(setterName);
    } else if (line === 'end procedure' || line === 'end function') {
      currentMethod = null;
    }
  }

  return modelAnswer;
}


function markClassAnswer(studentText, modelAnswer) {
  let score = 0;

  // check class name and end class
  if (studentText.includes(`class ${modelAnswer.className}`) && studentText.includes('end class')) {
    score++;
  }

  // check attributes
  let allAttributesPresent = modelAnswer.attributes.every(attr => studentText.includes(attr));
  if (allAttributesPresent && modelAnswer.attributes.length > 0) {
    score++;
  }

  // check constructor
  if (studentText.includes('procedure new(')) {
    score++;
  }

  // check getters
  let allGettersPresent = modelAnswer.getters.every(getter => studentText.includes(getter));
  if (allGettersPresent && modelAnswer.getters.length > 0) {
    score++;
  }

  // check setters
  let allSettersPresent = modelAnswer.setters.every(setter => studentText.includes(setter));
  if (allSettersPresent && modelAnswer.setters.length > 0) {
    score++;
  }

  return score;
}




