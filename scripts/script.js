console.log('----------quiz start---------')
const API_URL = "https://opentdb.com"
const numberOfQuestions = 10 ;
let questionsArray =[] 
let questionArrayCounterId = 0
let maxPoints = 0
let cumulativePoint = 0
let cumulativePointPercentage =0
let nickName;
let categoryMain;
const userDiv = document.getElementById('userDiv')
const startQuizDiv = document.getElementById('startQuizDiv')
const categoriesButtonsDiv = document.getElementById('categoriesButtonsDiv')
const questionsDiv = document.getElementById('questionsDiv')
const questionsTextDiv = document.getElementById('questionsTextDiv')
const answerButtonsDiv = document.getElementById('answerButtonsDiv')
const answerFeedbackDiv = document.getElementById('answerFeedbackDiv')
const nextQuestionButtonDiv = document.getElementById('nextQuestionButtonDiv')
const quizEndDiv = document.getElementById('quizEndDiv')
const userForm = document.getElementById('userForm')
const startQuizBtn = document.getElementById('startQuizBtn')
const submitNickName = document.getElementById('submitNickName')
const nickNameInput = document.getElementById('nickNameInput')


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

const showStatistics =()=>{
    for (i = 0; i < localStorage.length; i++) {
        const userObject= JSON.parse(localStorage.getItem(localStorage.key(i)))
        console.log('testing Local Storage ', userObject)
        addHtmlElementToDiv("div","grafficsDiv","",{id:userObject.name})
        addHtmlElementToDiv("p",userObject.name,"soy"+userObject.name)
        //mover a función más adelante
        userObject.categoryArray.forEach((categoryObject)=>{
            //grágfica nueva
            let labelsId=0;
            const labels = categoryObject.gameArr.map((score)=>{
                labelsId++
                return "S"+(labelsId)
            })
        
            const data = {
                labels: labels,
                datasets: [{
                    label: categoryObject.name,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: categoryObject.gameArr,
                }]
            };
            const config = {
                type: 'bar',
                data: data,
                options: {}
            };
            console.log('config : ', config)
            addHtmlElementToDiv("canvas",userObject.name,"",{id:userObject.name+categoryObject.name})
            const myChart = new Chart(userObject.name+categoryObject.name, config);

        })
        
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

const addScoreToUser =(cumulativePointPercentage)=>{
    const userObject= JSON.parse(localStorage.getItem(nickName))
    //userObject.categoryArray[name  == categoryMain].game.push(cumulativePointPercentage)
    let categoryArrCounter =0
    for (const categoryObject of userObject.categoryArray) {
        
        if(categoryObject.name == categoryMain){
            userObject.categoryArray[categoryArrCounter].gameArr.push(cumulativePointPercentage.toFixed(2))
            console.log('userObject.categoryArray : ',userObject.categoryArray[categoryArrCounter])
        }
        categoryArrCounter++
    }
    localStorage.setItem(nickName,JSON.stringify(userObject))
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
        addHtmlElementToDiv("p","quizEndDiv","great job, quiz is over")
        addHtmlElementToDiv("p","quizEndDiv","Score :"+cumulativePointPercentage+"%")
        addScoreToUser(cumulativePointPercentage)
        const btnPlayAgain = addHtmlElementToDiv("button","quizEndDiv","Play again",{type:"button"})
        btnPlayAgain.addEventListener('click',startQuizFunction) 
        showStatistics()
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
    const btnNext = addHtmlElementToDiv("button","nextQuestionButtonDiv","Next question",{type:"button"})
    btnNext.addEventListener('click',showNextQuestion)
    console.log('cumulativePointPercentage : ', cumulativePointPercentage)

}


const showQuestionInTheHtml =(questionObject)=>{
    const possibleAnswersArr=questionObject.incorrect_answers
    possibleAnswersArr.splice((possibleAnswersArr.length+1) * Math.random() | 0, 0,questionObject.correct_answer)
    addHtmlElementToDiv("p","questionsTextDiv",questionObject.question)
    
    
    possibleAnswersArr.map((possibleAnswer)=>{
        const rightAnswerValue = possibleAnswer == questionObject.correct_answer ? "true":"false"
        const btn = addHtmlElementToDiv("button","answerButtonsDiv",possibleAnswer,{type:"button",rightanswer:rightAnswerValue})
        btn.addEventListener('click',showAnswerResoult)
    })

}

const addCategoryPlayedByUser =(category)=>{
    const userObject= JSON.parse(localStorage.getItem(nickName))
    if(userObject.categoryArray === undefined){
        userObject.categoryArray=[{"name":category,"gameArr":[]}]
    }else if (userObject.categoryArray.filter((categoryInArr)=> category===categoryInArr.name).length === 0){   
        userObject.categoryArray.push({"name":category,"gameArr":[]})}
    console.log('userObject : ', userObject)
    localStorage.setItem(nickName,JSON.stringify(userObject))
}

const chooseCategoryByButton=(event)=>{
    //console.log('Event', event.target.getAttribute("apiid"))
    //console.log('Event', event.target.childNodes[0].textContent)
    categoryMain= event.target.childNodes[0].textContent
    addCategoryPlayedByUser(categoryMain)

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
            const btn = addHtmlElementToDiv("button","categoriesButtonsDiv",category.name,{type:"button",apiId:category.id})
            btn.addEventListener('click',chooseCategoryByButton)
            startQuizDiv.classList.add("hide")
        })
    })
    .catch((err) => console.error(err));

}
const saveUserName =(event)=>{
    event.preventDefault()
     console.log('nickNameInput : ', nickNameInput.value)
     nickName=nickNameInput.value
     const userObjec ={ name:nickName,test:"test2333"}
    if(localStorage.getItem(nickName) === null){
        localStorage.setItem(nickName,JSON.stringify(userObjec))
    }
     startQuizDiv.classList.remove("hide")
     userDiv.classList.add("hide")

}













startQuizBtn.addEventListener('click',startQuizFunction)
userForm.addEventListener("submit", saveUserName);
showStatistics();

// const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];

//   const data = {
//     labels: labels,
//     datasets: [{
//       label: 'Mi primera gráfica',
//       backgroundColor: 'rgb(255, 99, 132)',
//       borderColor: 'rgb(255, 99, 132)',
//       data: [0, 10, 5, 2, 20, 30, 45],
//     }]
//   };

//   const config = {
//     type: 'bar',
//     data: data,
//     options: {}
//   };
// addHtmlElementToDiv("div","grafficsDiv","",{id:"user1"})
// addHtmlElementToDiv("p","user1","soy user1")
// addHtmlElementToDiv("canvas","user1","",{id:"myChart"})
// addHtmlElementToDiv("canvas","user1","",{id:"myChart1"})
// addHtmlElementToDiv("div","grafficsDiv","",{id:"user2"})
// addHtmlElementToDiv("p","user2","soy user2")
// addHtmlElementToDiv("canvas","user2","",{id:"myChart2"})
// const myChart = new Chart('myChart', config);
// const myChart1 = new Chart('myChart1', config);
// const myChart2 = new Chart('myChart2', config);
