console.log('----------quiz start---------')
const API_URL = "https://opentdb.com"
const numberOfQuestions = 10 ;
let questionsArray =[] 
let questionArrayCounterId = 0
const startQuiz = document.getElementById('startQuiz')
const categoriesButtonsDiv = document.getElementById('categoriesButtonsDiv')
const questionsDiv = document.getElementById('questionsDiv')
const questionsTextDiv = document.getElementById('questionsTextDiv')
const answerButtonsDiv = document.getElementById('answerButtonsDiv')
const answerFeedbackDiv = document.getElementById('answerFeedbackDiv')
const nextQuestionButtonDiv = document.getElementById('nextQuestionButtonDiv')
const quizEndDiv = document.getElementById('quizEndDiv')
const startQuizBtn = document.getElementById('startQuizBtn')


function generateLMGTFYLink(query) {
    // Encode the search query to include it in the URL
    const encodedQuery = encodeURIComponent(query);
    // Construct the URL for Let Me Google That
    const url = `https://letmegooglethat.com/?q=${encodedQuery}`;
    // Return the generated URL
    return url;
}

const showNextQuestion = (event)=>{
    questionArrayCounterId++
    questionsTextDiv.innerHTML=""
    answerButtonsDiv.innerHTML=""
    answerFeedbackDiv.innerHTML=""
    nextQuestionButtonDiv.innerHTML=""
    if(questionArrayCounterId < numberOfQuestions ){
        showQuestionInTheHtml(questionsArray[questionArrayCounterId])
    }else{
        //finish quiz
        const quizEndParagraph = document.createElement("p");
        const quizEndParagraphText = document.createTextNode("great job quiz is over");
        quizEndParagraph.appendChild(quizEndParagraphText);
        quizEndDiv.appendChild(quizEndParagraph)
        //quizEndDiv
    }
    

}

const showAnswerRwsoult=(event)=>{
     if(event.target.getAttribute("rightanswer") =="true"){
         const AnswerFeedbackParagraph = document.createElement("p");
         const AnswerFeedbackParagraphText = document.createTextNode("Rigt, good job");
         AnswerFeedbackParagraph.appendChild(AnswerFeedbackParagraphText);
         answerFeedbackDiv.appendChild(AnswerFeedbackParagraph)
     }else{
         const originalQuestion =  questionsTextDiv.children[0].childNodes[0].nodeValue ;
         const link = generateLMGTFYLink(originalQuestion);
         console.log('Let me google that for you', link);
          const AnswerFeedbackParagraph = document.createElement("p");
         const AnswerFeedbackParagraphText = document.createTextNode("wrong, maybe you'd need some help. Please check the following link");
          AnswerFeedbackParagraph.appendChild(AnswerFeedbackParagraphText);
          answerFeedbackDiv.appendChild(AnswerFeedbackParagraph)
          const AnswerFeedbackLink = document.createElement("a");
          const AnswerFeedbackLinkText = document.createTextNode("Click here if you're ready to find out the hidden humanity knowledge secret");
          AnswerFeedbackLink.setAttribute("href",link)
          AnswerFeedbackLink.setAttribute("target","_blank")
          AnswerFeedbackLink.appendChild(AnswerFeedbackLinkText)
          answerFeedbackDiv.appendChild(AnswerFeedbackLink)

     }
    // changing all buttons collors if  answer is right or wrong
    Object.values(event.target.parentElement.children).map((btn)=>{
        btn.getAttribute("rightanswer") =="true" ? btn.classList.add("correct"):btn.classList.add("wrong")
        btn.setAttribute("disabled","")
    })
    // TODO : función para botón
    const btnNext = document.createElement("button");
     const btnNextText = document.createTextNode("Next question");
     btnNext.setAttribute("type","button")
     btnNext.appendChild(btnNextText);
     btnNext.addEventListener('click',showNextQuestion)
     nextQuestionButtonDiv.appendChild(btnNext) 

}


const showQuestionInTheHtml =(questionObject)=>{
    const possibleAnswersArr=questionObject.incorrect_answers
    possibleAnswersArr.splice((possibleAnswersArr.length+1) * Math.random() | 0, 0,questionObject.correct_answer)

    const questionParagraph = document.createElement("p");
    const questionParagraphText = document.createTextNode(questionObject.question);
    questionParagraph.appendChild(questionParagraphText);
    questionsTextDiv.appendChild(questionParagraph)
    
    possibleAnswersArr.map((possibleAnswer)=>{
        //función para hacer botones
        const btn = document.createElement("button");
        const btnText = document.createTextNode(possibleAnswer);
        btn.setAttribute("type","button")
        possibleAnswer == questionObject.correct_answer ?btn.setAttribute("rightanswer","true"):btn.setAttribute("rightanswer","false")
        //btn.setAttribute("class","col col-2 btn btn-sm btn-primary m-1")
        btn.appendChild(btnText);
        btn.addEventListener('click',showAnswerRwsoult)
       // console.log('category  boton : ',btn)
        answerButtonsDiv.appendChild(btn) 
    })

}


const chooseCategoryByButton=(event)=>{
    //console.log('Event', event.target.getAttribute("apiid"))
    //console.log('Event', event.target.childNodes[0].data)
    const apiId=event.target.getAttribute("apiid")
    const API_URL_NEW= API_URL+"/api.php?amount="+numberOfQuestions+"&category="+apiId+"&type=multiple" 
    console.log('Event', API_URL_NEW)
    axios.get(API_URL_NEW)
    .then((res) =>{
        console.log('questions : ', res.data.results)
        categoriesButtonsDiv.classList.add("hide")
        questionsArray = res.data.results
        showQuestionInTheHtml(questionsArray[0])
    })
    .catch((err) => console.error(err));

}

const startQuizFunction = () =>{
    console.log('Start the game : ',' :) ')
    axios.get(API_URL+"/api_category.php")
    .then((res) =>{ 
        //console.log(res.data.trivia_categories)
        res.data.trivia_categories.map((category)=>{
            const btn = document.createElement("button");
            const btnText = document.createTextNode(category.name);
            btn.setAttribute("type","button")
            btn.setAttribute("apiId",category.id)
            //btn.setAttribute("class","col col-2 btn btn-sm btn-primary m-1")
            btn.appendChild(btnText);
            btn.addEventListener('click',chooseCategoryByButton)
            //console.log('category  botones : ',btn)
            categoriesButtonsDiv.appendChild(btn)
            startQuiz.classList.add("hide")
            

        })
    
    })
    .catch((err) => console.error(err));

}
















startQuizBtn.addEventListener('click',startQuizFunction)