// _TODO: take input for category and difficulty
// _TODO: send inputs as a request to the API and store retrived information in a variable
// _TODO: render the data as questions on the page
// _TODO: highlight the option which user selects
// _TODO: after user presses view results, show reults

const baseURL = "https://opentdb.com/api.php";

const form = document.querySelector("form");
const quizContainer = document.querySelector(".quiz-container");
const resultBtn = document.querySelector("#result-btn");
const result = [];

// This function returns a promise which contains the question
const getData = async (category, difficulty) => {
  return axios.get(
    `${baseURL}?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`
  );
};

// Function to shuffle an array
function shuffle(...array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// Gets the next char in the sequence
function getNextChar(char) {
  return String.fromCharCode(char.charCodeAt(0) + 1);
}

const createQuestions = (questions) => {
  const rightAnswers = [];
  const cards = document.querySelectorAll(".quiz-card");
  for (card of cards) {
    card.remove();
  }

  for (let [index, question] of questions.entries()) {
    const quizCard = document.createElement("div");
    const ques = document.createElement("div");
    const options = document.createElement("div");
    ques.innerHTML = `Q${index + 1}) ${question.question}`;

    // Creating a dummy div to convert entity codes to text
    const dummydiv = document.createElement("div");
    dummydiv.innerHTML = question.correct_answer;
    rightAnswers[index] = dummydiv.innerText;

    const answers = [question.correct_answer, ...question.incorrect_answers];
    const shuffledAnswers = shuffle(...answers);

    let char = "a";
    for (option of shuffledAnswers) {
      const optionDiv = document.createElement("div");
      optionDiv.innerHTML = `${char.toUpperCase()}) ${option}`;
      optionDiv.classList.add("option");
      options.append(optionDiv);
      char = getNextChar(char);
    }

    ques.classList.add("question");
    options.classList.add("options");
    quizCard.classList.add("quiz-card");
    quizCard.append(ques, options);
    quizContainer.append(quizCard);
  }
  quizContainer.classList.remove("display-none");
  resultBtn.classList.remove("display-none");
  return rightAnswers;
};

const addOptionEvents = (answers) => {
  const optionDivs = document.querySelectorAll(".options");
  for (let [index, option] of optionDivs.entries()) {
    option.addEventListener("click", (e) => {
      if (e.target !== option) {
        // removing highlight from prev selected option
        for (let opt of option.children) {
          opt.classList.remove("selected");
        }
        // adding highlight to selected option
        e.target.classList.add("selected");

        if (e.target.innerHTML.includes(answers[index])) {
          result[index] = true;
        } else {
          result[index] = false;
        }
      }
    });
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const category = document.querySelector("#category").value;
  const difficulty = document.querySelector("#difficulty").value;
  getData(category, difficulty).then((question) => {
    const answers = createQuestions(question.data.results);
    addOptionEvents(answers);

    resultBtn.addEventListener("click", () => {
      const resultScore = document.querySelector(".score");
      const resultAns = document.querySelector(".right-ans");
      const resultContainer = document.querySelector(".result");
      let score = 0;
      for (let el of result) {
        if (el === true) {
          score++;
        }
      }

      resultContainer.classList.remove("display-none");
      resultScore.innerHTML = `You Scored <strong>${score} / 10</strong>`;

      const oldDivs = document.querySelectorAll('.right-ans div');
      for(let olddiv of oldDivs) {
        olddiv.remove();
      }

      for (let [index, answer] of answers.entries()) {
        const ansDiv = document.createElement("div");
        ansDiv.innerHTML = `${index + 1}) ${answer}`;
        resultAns.append(ansDiv);
      }
    });
  });
});