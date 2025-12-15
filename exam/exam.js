let questions = [];
let question = null;

const display = document.getElementById('pConsole');
const qButton = document.getElementById('questionbutton');
const aButton = document.getElementById('answerbutton');

// Load CSV database
fetch('questions.csv')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load questions.csv');
    return response.text();
  })
  .then(data => {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');

      // Construct question object
      const questionObject = {
        QuestionID: values[0].trim(),
        question: values[1].trim(),
        // Join all columns between 2 and last-1 as the answer
        answer: values.slice(2, values.length - 1).join(',').trim(),
        marks: values[values.length - 1].trim()
      };

      // Convert literal "\n" to real line breaks
      questionObject.answer = questionObject.answer.replace(/\\n/g, '\n');

      questions.push(questionObject);
    }
  })
  .catch(err => console.error(err));

// Show random question
qButton.addEventListener('click', function() {
  if (questions.length === 0) {
    display.value = 'No questions loaded yet.';
    return;
  }

  const randomIndex = Math.floor(Math.random() * questions.length);
  question = questions[randomIndex];
  display.value = 'Q' + question.QuestionID + ': ' + question.question;

  aButton.disabled = false;
});

// Show answer
aButton.addEventListener('click', function() {
  display.value += '\n\nAnswer:\n' + question.answer + '\n[Mark]: ' + question.marks;
  aButton.disabled = true;
});
