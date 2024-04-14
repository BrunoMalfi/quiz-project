console.log('----------quiz start---------')
const API_URL = "https://opentdb.com"
const numberOfQuestions = 10 ;
let questionsArray =[] 
let questionArrayCounterId = 0
let maxPoints = 0
let cumulativePoint = 0
let cumulativePointPercentage =0
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

const addHtmlElementToDiv =(elementToAdd,fatherDivId,elementText="",elementAtributesObjectList=null,classListArr=null)=>{
    //elementToAdd : html element to add like <p>, <a> or <button>
    // example how to use function : addHtmlElementToDiv("p","testDiv","I'm a test paragraph",{attribute1:"test",attribute2:"test2"},["wrong"])
    if(elementToAdd.length != 0 && fatherDivId.length != 0){
        const fatherDiv = document.getElementById(fatherDivId)
        const elementToAddHtml = document.createElement(elementToAdd);
        const elementToAddHtmlText = document.createTextNode(elementText);
        elementToAddHtml.appendChild(elementToAddHtmlText);
        if(elementAtributesObjectList !== null & elementAtributesObjectList === Object(elementAtributesObjectList)){ Object.keys(elementAtributesObjectList).map((attribute)=>{elementToAddHtml.setAttribute(attribute,elementAtributesObjectList[attribute])})}
        if(classListArr !== null & Array.isArray(classListArr) ){classListArr.map((classToAdd) => elementToAddHtml.classList.add(classToAdd))}
        fatherDiv.appendChild(elementToAddHtml);
        return elementToAddHtml
    }else{
        console.error("addHtmlElementToDiv can't work without first and second parameters")
    }

}

const howMuchPointsAddsThisQuestion = (questionDifficulty)=>{
    switch(questionDifficulty){
        case "easy":
            return 1 ; 
        case "medium":
            return 2
        case "hard":
            return 3
        default:
        console.error('Something went wrong when calculation of howMuchPointsAddsThisQuestion depending of the difficulty happened')
        return "Nan"
    }
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
        const quizEndParagraphPoints = document.createElement("p");
        const quizEndParagraphPointsText = document.createTextNode("Score :"+cumulativePointPercentage+"%");
        quizEndParagraphPoints.appendChild(quizEndParagraphPointsText);
        quizEndDiv.appendChild(quizEndParagraphPoints)
        const btnPlayAgain = document.createElement("button");
        const btnPlayAgainText = document.createTextNode("PlayAgain");
        btnPlayAgain.setAttribute("type","button")
        btnPlayAgain.appendChild(btnPlayAgainText);
        btnPlayAgain.addEventListener('click',startQuizFunction)
        quizEndDiv.appendChild(btnPlayAgain)
        //quizEndDiv
    }
    

}

const showAnswerResoult=(event)=>{
     if(event.target.getAttribute("rightanswer") =="true"){
         addHtmlElementToDiv("p","answerFeedbackDiv","Rigt, good job")
         cumulativePoint=cumulativePoint + howMuchPointsAddsThisQuestion(questionsArray[questionArrayCounterId].difficulty)
         cumulativePointPercentage=(cumulativePoint/maxPoints)*100
     }else{
        const originalQuestion =  questionsTextDiv.children[0].childNodes[0].nodeValue ;
        const link = generateLMGTFYLink(originalQuestion);
        console.log('Let me google that for you', link);
        addHtmlElementToDiv("p","answerFeedbackDiv","wrong, maybe you'd need some help. Please check the following link :")
        addHtmlElementToDiv("a","answerFeedbackDiv","Help",{href:link,target:"_blank"})

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
     console.log('cumulativePointPercentage : ', cumulativePointPercentage)

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
        btn.addEventListener('click',showAnswerResoult)
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
        questionsArray.map((question)=>{
            //console.log('question difficulty : ', question.difficulty)
            maxPoints= maxPoints + howMuchPointsAddsThisQuestion(question.difficulty)
        })
        showQuestionInTheHtml(questionsArray[0])
    })
    .catch((err) => console.error(err));

}

const startQuizFunction = () =>{
    quizEndDiv.innerHTML=""
    //startQuiz.classList.remove("hide")
    console.log('Start the game : ',' :) ')
    axios.get(API_URL+"/api_category.php")
    .then((res) =>{ 
        //console.log(res.data.trivia_categories)
        categoriesButtonsDiv.classList.remove("hide")
        questionsArray =[] 
        questionArrayCounterId = 0
        maxPoints = 0
        cumulativePoint = 0
        cumulativePointPercentage =0

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