const startQuizBtn = document.getElementById('startQuizBtn');
const chooseCategoryPage = document.querySelector('.chooseCategoryPage');
const chooseDifficultyPage = document.querySelector('.chooseDifficultyPage');
const numOfQuestionsPage = document.querySelector('.chooseNumOfQuestionsPage')
const homePage = document.querySelector('.homePage');
const quizPage = document.querySelector('.quizPage');
const resultPage = document.querySelector('.resultPage');
const question = document.getElementById('question');
const optionsBox = document.querySelector('.optionsBox')
const nextBtn = document.getElementById('nextBtn');
const previousBtn = document.getElementById('previousBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const currentQuestionCounter = document.getElementById('currentQuestionCounter');
const progressBar = document.querySelector('.progressBar');
const noOfQuestionsBtn = document.querySelectorAll('.numOfQuestionsBtn');
const difficultyLevelBtn = document.querySelectorAll('.difficultyLevelBtn');
const reviewOrReplayBtnsBox = document.querySelector('.reviewOrReplayBtnsBox')
const reviewQuizBtn = document.getElementById('reviewQuizBtn');
const timerElement =  document.getElementById('timer')
const categoryBtn = document.querySelectorAll('.categoryBtn');
const languageBtn = document.querySelector('#languageBtn');
let questionBank = [];

let duration = 0;
let currentQuestionIndex = 0;
let points = 0;
let attemptedQuestions = 0;
let difficulty = null;
let category = null;
let numOfQuestions = 0;
let currentProgress = 0;
let selectedOption = null;
let userAnswers = [];
let selectedQuestions;

//function to shuffle questions (random question order)
function shuffleQuestions(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}
//handle language change
let language = "romanized";
languageBtn.addEventListener('click', () => {
    /*if language is already = romanized and button to switch is clicked, then make language become thai and vice versa*/
    language = (language == "romanized") ? "thai" : "romanized";
    languageBtn.textContent = (language == "romanized") ? "Switch to thai" : "Switch to romanized";
    loadQuiz()
})
function loadQuiz(){
    //set pages
    chooseCategoryPage.style.display = 'none';
    chooseDifficultyPage.style.display = 'none';
    numOfQuestionsPage.style.display = 'none';
    homePage.style.display = 'none';
    resultPage.style.display = 'none';
    quizPage.style.display = 'block';

    updateProgressBar();

    //load question
    let currentQuestion = questionBank[currentQuestionIndex];
    question.textContent = `${currentQuestionIndex+1}. ${currentQuestion.question[language]}`;
    optionsBox.innerHTML = ''; //clear previous options
    //load options
    currentQuestion.options[language].forEach((option, index) => {
        let btn = document.createElement('button');
        btn.className = 'options';
        btn.textContent = option;

        userAnswers[currentQuestionIndex] = null;
        //when an option is selected
        btn.addEventListener('click', () => {
            //if user clicks an option they already selected to unselect it
            if(btn.classList.contains('selected')){
                btn.classList.remove('selected');
                selectedOption = null;
            }
            else{
                //loop through all options to remove the selected classList in case they change their answer
                document.querySelectorAll('.options').forEach((opt) => {
                    opt.classList.remove('selected');
                })
                btn.classList.add('selected');
                selectedOption = index;//stores option's index rather than answer itself
            }
            userAnswers[currentQuestionIndex] = selectedOption;
        })
        if(currentQuestionIndex == 0){
            previousBtn.style.display = 'none';
        }else{
            previousBtn.style.display = 'block';
        }
        optionsBox.append(btn);
    })

    currentQuestionCounter.textContent = `${currentQuestionIndex+1} of ${questionBank.length} questions`
}
function updateProgressBar(){
    /*track the current question in percentage. ex: if ur on question 7 out of 10. ur current progress will be 70%. Then make the progressBar's width 70%, this gives it a look that its progressing but it's just the progressBar's width increasing or reducing*/
    currentProgress = ((currentQuestionIndex+1) / questionBank.length) *100;
    progressBar.style.width = currentProgress + '%';
}
//move to next question
function nextQuestion(){
    currentQuestionIndex++;
    if(currentQuestionIndex == questionBank.length - 1){//last question, change "next" to "submit"
        nextBtn.textContent = 'Submit';
        loadQuiz();
        updateProgressBar();
    }else if(currentQuestionIndex < questionBank.length){
        loadQuiz();
        updateProgressBar();
    }else{
        displayResult()
    }
}
nextBtn.addEventListener('click', nextQuestion)

//go back to previous question
function previousQuestion(){
    currentQuestionIndex--;
    if(currentQuestionIndex >= 0){
        nextBtn.textContent = 'Next'
        loadQuiz();
        updateProgressBar();
    }
}
previousBtn.addEventListener('click', previousQuestion)

function displayResult(){
    chooseCategoryPage.style.display = 'none';
    chooseDifficultyPage.style.display = 'none';
    numOfQuestionsPage.style.display = 'none';
    homePage.style.display = 'none';
    quizPage.style.display = 'none';
    resultPage.style.display = 'block';

    //if they click review quiz btn
    reviewQuizBtn.addEventListener('click', () => {
        alert('Check Console for quiz review')

        userAnswers.forEach((ans, index) => {
            /*This is just a quiz review that will show up in my console until i do the review quiz page*/
           console.log(`Question(${index+1}): ${questionBank[index].question[language]}`);
           console.log(`Options: ${questionBank[index].options[language]}`);
           console.log(`Answer: ${questionBank[index].options[language][questionBank[index].answer]}`);
           console.log(`You Chose: ${questionBank[index].options[language][userAnswers[index]]} `);
           console.log("-----")
        })
    })
    
    userAnswers.forEach((ans, index) => {
        if(userAnswers[index] != null){
            attemptedQuestions++;
            if((userAnswers[index] == questionBank[index].answer)){//user got it
              points++;
            }
        }
        
    })
    let percentage = (points / questionBank.length) * 100;
    let passingPercentage = 80;
    let passingPoints = (0.8 * questionBank.length);

    let remarks = document.getElementById('remarks');
    if(percentage >= passingPercentage){
        remarks.textContent = `Nice Job! You Passed`;
        remarks.style.color = 'green';
    }else if(percentage >= 60 && percentage < passingPercentage){
        remarks.textContent = `You tried! Keep it up!`;
        remarks.style.color = 'orange';
    }else{
        remarks.textContent = `You Failed! Pay more attention during thai study`;
        remarks.style.color = 'red';
    }

    let percentageBox = document.querySelector('.scoreBox1');
    percentageBox.innerHTML = `
      <div>
        <p>Your Score:</p>
        <p id="userScore">${percentage.toFixed(0)}%</p>
      </div>
      <p id="passingPercentage">Passing Score: ${passingPercentage.toFixed(0)}</p>
    `
    let pointsBox = document.querySelector('.scoreBox2');
    pointsBox.innerHTML = `
      <div>
        <p>Your Points:</p>
        <p id="userPoints">${points.toFixed(0)}/${questionBank.length.toFixed(0)} </p>
      </div>
      <p id="passingPoints">Passing Points: ${passingPoints.toFixed(0)}</p>
    `

    let questionsAttempted = document.getElementById('questionsAttempted');
    questionsAttempted.innerHTML = `Total Questions: ${questionBank.length}, Questions Attempted: ${attemptedQuestions}`
}

//when user clicks play again on results page
function playAgain(){
    //reset and go back to home page
    currentQuestionIndex = 0;
    points = 0;
    attemptedQuestions = 0;
    selectedOption = null;
    numOfQuestions = 0;
    updateProgressBar();//so progress bar goes to beginning
    nextBtn.textContent = 'Next';
    userAnswers = [];
    chooseCategoryPage.style.display = 'block';
    chooseDifficultyPage.style.display = 'none';
    numOfQuestionsPage.style.display = 'none';
    quizPage.style.display = 'none';
    resultPage.style.display = 'none';
    homePage.style.display = 'none';
}
playAgainBtn.addEventListener('click', playAgain)

function startTimer(){
    //duration is based on num of questions
    duration = selectedQuestions.length * 45;//allows you to have at least 45secs on a question
    timerElement.textContent = "00:00";
    const timerInterval = setInterval(() => {
        let minutes = Math.floor(duration / 60); //e.g duration = 180s. minutes = 180/60 = 3mins
        let seconds = duration % 60;//e.g duration = 125s. seconds = 125/60 = 2mins 5 seconds. the remainder is 5, thats why i used "%"

        minutes = (minutes < 10)? "0" + minutes: minutes; //if munutes = 20. good but if minutes = 3, it will show 03 not just 3;
        seconds = (seconds < 10)? "0" + seconds: seconds; //if munutes = 20. good but if minutes = 3, it will show 03 not just 3;

        timerElement.textContent = `${minutes}:${seconds}`;
        duration--;//decrease the time left every time

        if(duration < 0){
            clearInterval(timerInterval);
            displayResult();
            timerElement.textContent = "00:00";
        }
    },1000)
}
//when user selects a category
categoryBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        category = btn.dataset.category;
        goToDifficultyPage();
    })
})
function goToDifficultyPage(){
    quizPage.style.display = 'none';
    resultPage.style.display = 'none';
    homePage.style.display = 'none';
    chooseDifficultyPage.style.display = 'block';
    numOfQuestionsPage.style.display = 'none';
    chooseCategoryPage.style.display = 'none';
}
//when user selects a difficulty
difficultyLevelBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        difficulty = btn.dataset.difficulty;
        goToNoOfQuestionsPage();
    })
})
function goToNoOfQuestionsPage(){
    quizPage.style.display = 'none';
    resultPage.style.display = 'none';
    homePage.style.display = 'none';
    chooseDifficultyPage.style.display = 'none';
    numOfQuestionsPage.style.display = 'block';
}

//when user selects a number of question
noOfQuestionsBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        let num = btn.dataset.numOfQuestions;
        numOfQuestions = parseInt(num);
        goToHomePage();
    })
})
function goToHomePage(){
    chooseDifficultyPage.style.display = 'none';
    numOfQuestionsPage.style.display = 'none';
    quizPage.style.display = 'none';
    resultPage.style.display = 'none';
    homePage.style.display = 'block';
}
startQuizBtn.addEventListener('click', () => {
    /*every time start quiz is clicked. it fetches current json abd then loads the quiz. Note: I decided to fetch everytime startQuiz is clicked rather than fetching once so that if there's an update to the json file, it loads that current version*/
    fetch("questions.json")
     .then(response => response.json())
     .then(data => {
        let fetchedQuestions = data;//fetch questions
        let filteredQuestions;
        
        //filter based on selected difficulty and category. Take only if difficulty matvhes or they choose all. same for category
        filteredQuestions = fetchedQuestions.filter((q) => {
            return ((difficulty === "all" || (q.difficulty === difficulty)) && ((category === "all")|| (q.category === category)));
        })

        shuffleQuestions(filteredQuestions);//shuffle questions
        //now get the filtered questions and based on no of questions (Notice i shuffled b4 slicing)
        selectedQuestions = filteredQuestions.slice(0, numOfQuestions);

        //if questions in a difficulty level are not up to selected num of questions. e.g you want 10 questions in easy level. but there are only 5 easy questions. so it tells a message
        if(selectedQuestions.length < numOfQuestions){
            let msg = `Note: Only ${selectedQuestions.length} available questions in this difficulty/category!`;
            let warning = document.getElementById('availableQuestionsWarningMsg');
            warning.style.display = 'block';
            warning.textContent = msg;

            setInterval(() => {
                warning.style.display = 'none';
            }, 5000)
        }

        //now store them inside your questionBank
        questionBank = selectedQuestions;

        if(selectedQuestions.length == 0){
             //if no questions, tell them then restart qui
            alert("No questions available for this category/difficulty!");
            playAgain();
        }else{
           //start timer
           startTimer();
           //only load questions if there is at least one question available after filtering
           loadQuiz();
        }
    })
    .catch(error => console.error("Error loading questions:", error));
})
