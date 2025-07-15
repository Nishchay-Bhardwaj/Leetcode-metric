document.addEventListener("DOMContentLoaded",function(){
    const searchButton = document.getElementById("username-button");
    const usernameInput = document.getElementById("username-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-level");
    const mediumProgressCircle = document.querySelector(".medium-level");
    const hardProgressCircle = document.querySelector(".hard-level");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");
    const easybi = document.getElementById("bi1");
    const mediumbi = document.getElementById("bi2");
    const hardbi = document.getElementById("bi3");

    async function fetchuserdetails(username){
        try{
            searchButton.innerHTML="Searching...";
            searchButton.disabled=true;
            const proxyurl = 'https://cors-anywhere.herokuapp.com/';
            targeturl= 'https://leetcode.com/graphql/';
            const myheader=new Headers();
            myheader.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestoptions={
                method:"POST",
                headers:myheader,
                body:graphql
            };
            const response=await fetch(proxyurl+targeturl,requestoptions);
            if(!response.ok){
                throw new Error("Unable to fetch user details");
            }
            const parsedData=await response.json();
            gatherdata(parsedData);
        }
        catch(error){
            statsContainer.innerHTML=`<p>${error.message}`;
        }
        finally{
            searchButton.innerHTML="Search";
            searchButton.disabled=false;
        }
    }

    function updateprogress(total,solved,progress,progress1){
        const per=(solved/total)*100;
        progress.style.setProperty("--progress-degree",`${per}%`);
        progress1.textContent=`${solved}/${total}`;
    }

    function gatherdata(parsedData){
        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateprogress(totalEasyQues,solvedTotalEasyQues,easyProgressCircle,easybi);
        updateprogress(totalMediumQues,solvedTotalMediumQues,mediumProgressCircle,mediumbi);
        updateprogress(totalHardQues,solvedTotalHardQues,hardProgressCircle,hardbi);

        const cardData=[
            {label:"Overall Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label:"Overall Easy Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label:"Overall Medium Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label:"Overall Hard Submissions",value:parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions}
        ];
        cardStatsContainer.innerHTML = cardData.map(
            data =>
                `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                </div>`
        ).join("");
    }

    function validateusername(username){
        if(username.trim() === ""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const ismatching = regex.test(username);
        if(!ismatching){
            alert("Invalid username");
        }
        return ismatching;
    }

    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        if(validateusername(username)){
            fetchuserdetails(username);
        }
    })
})