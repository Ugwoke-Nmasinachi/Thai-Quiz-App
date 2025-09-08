const startQuizBtn = document.getElementById('startQuizBtn');
const homePage = document.querySelector('.homePage');
const quizPage = document.querySelector('.quizPage');
const question = document.getElementById('question');
const optionsBox = document.querySelector('.optionsBox')
const nextBtn = document.getElementById('nextBtn');
const previousBtn = document.getElementById('previousBtn');
const questionBank = [
    {
        question: '1+1',
        options: [2,3,4,5],
        answer: 2
    },
    {
        question: '3+3',
        options: [2,3,6,5],
        answer: 6
    },
    {
        question: '8+1',
        options: [9,3,4,5],
        answer: 9
    },
    {
        question: '5-1',
        options: [2,4,3,5],
        answer: 4
    }
]

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
const userAnswers = [];
function loadQuiz(){
    homePage.style.display = 'none';
    quizPage.style.display = 'block';

    //load question
    let currentQuestion = questionBank[currentQuestionIndex];
    question.textContent = `${currentQuestionIndex+1}. ${currentQuestion.question}`;
    optionsBox.innerHTML = ''; //clear previous options
    //load options
    currentQuestion.options.forEach((option) => {
        let btn = document.createElement('button');
        btn.className = 'options';
        btn.textContent = option;

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
                selectedOption = option
            }
            userAnswers[currentQuestionIndex] = selectedOption;
        })

        optionsBox.append(btn);
    })
}

//move to next question
function nextQuestion(){
    currentQuestionIndex++;
    if(currentQuestionIndex == questionBank.length - 1){//last question, change "next" to "submit"
        nextBtn.textContent = 'Submit';
        loadQuiz();
    }else if(currentQuestionIndex < questionBank.length){
        loadQuiz();
    }else{
        console.log('end');
    }
}
nextBtn.addEventListener('click', nextQuestion)

//go back to previous question
function previousQuestion(){
    currentQuestionIndex--;
    if(currentQuestionIndex >= 0){
        nextBtn.textContent = 'Next'
        loadQuiz();
    }
}
previousBtn.addEventListener('click', previousQuestion)

startQuizBtn.addEventListener('click', loadQuiz)
