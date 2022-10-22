let resp;
let courses;
let courseData;
let holeData;
let teeBoxData;
let table = document.getElementById("table");
let tHead = document.getElementById("tableHead");
let tBodyD = document.getElementById("tableBodyDefaults");
let tBodyP = document.getElementById("tableBodyPlayers");

let tHeadL = document.getElementById("tableHeadLower");
let tBodyDL = document.getElementById("tableBodyDefaultsLower");
let tBodyPL = document.getElementById("tableBodyPlayersLower");

const link = 'https://golf-courses-api.herokuapp.com/courses/';
async function asyncCall(url){
    const basicFetch = await fetch(url);
    let response = await basicFetch.json();
    return response;}

tBodyP.innerHTML = "<div style='color: red; text-align: center;'>Something went wrong :(</div>";
asyncEvent();

async function asyncEvent(){
  tBodyP.innerHTML = "<div style='text-align: center;'>LOADING...</div>";
  let caughtErrorQ = true;
  resp = await asyncCall(link).catch((res) => caughtErrorQ = false);
  if(caughtErrorQ){
    courses = resp.courses;
    courseData = [];
    for(let i = 0; i < courses.length; i++){
      courseData[i] = 
      (await asyncCall(link + courses[i].id)).data;
    }
    console.log(resp);
    console.log(courses);
    console.log(courseData[0].holes);
    }
    else{ // I used this while at school because they block http requests
        console.error("Caught Error");
        await import("./mod.mjs").then((module) => {
            console.log(module.constHoles);
            courseData = [module.constHoles];
    } );    }
    firstLoad();
}
// <!-- Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia doloribus laudantium voluptate! -->
// <!-- Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia doloribus laudantium voluptate! -->

let dataCount = 18;
let firstHalf = Math.round(dataCount/2)
let secondHalf = dataCount -firstHalf;
let curCourse = 0;
let curData = "";
let curColor = "";
let curTeeBox = 0;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const summation = (accumulator, curr) => accumulator + curr;

let players = {
    0:{
        name: "Gene",
        data: [],
    }
}


function firstLoad(){
    /*------ Clear Table Data ------*/
    tBodyP.innerHTML = ""; tBodyD.innerHTML = ""; tHead.innerHTML = "";
    tBodyPL.innerHTML = ""; tBodyDL.innerHTML = ""; tHeadL.innerHTML = "";

    holeData = courseData[curCourse].holes;
    let tempTee = holeData[1].teeBoxes[curTeeBox];
    let tempData;
    /*------ Clear Table Data ------*/
    

    tempData = [];
    addData("th", ["Yards"], "", false); // Add Yards
    for(let i = 0; i < firstHalf; i++){
        tempData[i] = holeData[i].teeBoxes[curTeeBox].yards;
    }
    addData("td", tempData, "", false);
    addData("th", [""], "", false);
    pushRow("bodyD");

    tempData = [];
    for(let i = firstHalf; i < dataCount; i++)
        tempData.push(holeData[i].teeBoxes[curTeeBox].yards);

    addData("th", ["Yards"], "", false);
    addData("td", tempData, "", false);
    pushRow("bodyDL"); // Push Yards



    tempData = [];
    addData("th", ["Hcp"], "", false); // Add Handicap
    for(let i = 0; i < firstHalf; i++){
        tempData[i] = holeData[i].teeBoxes[curTeeBox].hcp;
    }
    addData("td", tempData, "", false);
    addData("th", [""], "", false);
    pushRow("bodyD");

    tempData = [];
    for(let i = firstHalf; i < dataCount; i++){
        tempData.push(holeData[i].teeBoxes[curTeeBox].hcp);
    }
    addData("th", ["Hcp"], "", false);
    addData("td", tempData, "", false);
    pushRow("bodyDL"); // Push Handicap


    tempData = [];
    addData("th", ["Par"], "", false); // Add par
    for(let i = 0; i < firstHalf; i++){
        tempData[i] = holeData[i].teeBoxes[curTeeBox].par;
    }
    addData("td", tempData, "", false);
    addData("th", [tempData.reduce(summation)+'<svg width="20" height="20"></svg>'], "", false);
    pushRow("bodyD")

    tempData = [];
    for(let i = firstHalf; i < dataCount; i++)
        tempData.push(holeData[i].teeBoxes[curTeeBox].par);
    addData("th", ["Par"], "", false);
    addData("td", tempData, '', false);
    addData("th", [tempData.reduce(summation)+'<svg width="20" height="20"></svg>'], '', false);
    pushRow("bodyDL"); // Push par


    curColor = tempTee.teeColorType;
    let temp = [...Array(firstHalf).keys()].map((n, f) => ++n);
    temp.unshift("Player");
    temp.push("Out");
    addData("th", temp, "", false);
    pushRow("head");
    temp = [...Array(secondHalf).keys()].map((n, f) => ++n + firstHalf);
    temp.unshift("Player");
    temp.push("In");

    addData("th", temp, "", false)
    pushRow("headL");

    loadPlayers();
}

function loadPlayers(){
    let tempData = [];
    tBodyP.innerHTML = "";
    tBodyPL.innerHTML = "";
    for (const i in players) {
        addData("th", [players[i].name], ' class="playerName'+i+'" oninput="ensureName(this)" onblur="changeName(this,'+i+')"', true)
        for(let ii = 0; ii < dataCount; ii++){
            if(ii == Math.round((dataCount-1)/2)){
                addData("th", [""], ' class="outSum', false)
                pushRow("bodyP")
                addData("th", [players[i].name], ' class="playerName'+i+'" oninput="ensureName(this)" onblur="changeName(this,'+i+')"', true)
            }
            if(players[i].data[ii] == undefined)
                tempData.push("");
            else
                tempData.push(players[i].data[ii]);
            addData("td", [tempData[ii]], ' oninput="changeData(this,'+ i + ","+ ii +')"', true);
        }
        addData("th", [""], ' class="inSum"', false)
        pushRow("bodyPL");
    }
    scale();
    updateAllSums();
}

function changeData(that, playerNum, idx){
    let curInput = that.innerHTML;
    if(!isNumber(curInput))
        that.innerHTML = curInput.replace(/[^\d-]/g, ''); // The regex removes all letters & symbols, leaving only digits
      else
        if(curInput > 999 || curInput < 0)
            that.innerHTML = clamp(curInput,0,999);
    
    players[playerNum].data[idx] = that.innerHTML;


    if(idx < firstHalf)
        updateSum("outSum", playerNum);
    else
        updateSum("inSum", playerNum);

    scale();
}

function updateSum(sumType, playerNum){
    let ibot, itop;
    let sum = 0, parSum = 0;
    switch (sumType) {
        case "outSum":
            ibot = 0;
            itop = firstHalf;
            break;
        case "inSum":
            ibot = firstHalf;
            itop = dataCount;
            break;
        case "totalSum":
            ibot = 0;
            itop = dataCount;
            break;
    }
    sumType = document.getElementsByClassName(sumType)[playerNum];

    for(let i = ibot; i < itop; i++){
        if(isNumber(players[playerNum].data[i])){
            sum += Number(players[playerNum].data[i]);
            parSum += holeData[i].teeBoxes[curTeeBox].par;
        }
    }
    let path = [
        'd="M 69.79,227.06 C 69.79,227.06 150.00,63.98 150.00,63.98 150.00,63.98 230.21,227.06 230.21,227.06 230.21,227.06 69.79,227.06 69.79,227.06" />',
        'd="M 230.21,125.58 C 230.21,125.58 230.21,174.42 230.21,174.42 230.21,174.42 68.37,174.42 68.37,174.42 68.37,174.42 68.37,125.58 68.37,125.58 68.37,125.58 230.21,125.58 230.21,125.58 Z" />',
        'd="M 69.79,72.94 C 69.79,72.94 150.00,236.02 150.00,236.02 150.00,236.02 230.21,72.94 230.21,72.94 230.21,72.94 69.79,72.94 69.79,72.94" />'
    
    ]
    let pColors = ["red", "#888", "lime"]
    let arrowType = clamp(parSum - sum, -1, 1) + 1;
    let iconBlock = 
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 300 300">'+
    '<path fill="'+pColors[arrowType]+'" stroke="black" stroke-width="1"'+
    path[arrowType]+'</svg>';

    if(sum == 0)
        sumType.innerHTML = "";
    else
        sumType.innerHTML = '<div class="center">' + sum + iconBlock + '</div>';
    scale();
}

function updateAllSums(){
    for(let i = 0; i < players.length; i++){
        updateSum("outSum", i);
        updateSum("inSum", i);
    }
}

function changeTee(that){
    curTeeBox = that.value;
    firstLoad();
}

function ensureName(that){
    if(that.innerHTML == "")
        that.innerHTML = "&#8203"; // Replace empty space with Zero width character

    let othersLikeMe = document.getElementsByClassName(that.classList.value); // Change other Player name box
    if(othersLikeMe[1] == that)
        othersLikeMe[0].innerHTML = that.innerHTML;
    else
        othersLikeMe[1].innerHTML = that.innerHTML;
    scale();
}

function changeName(that, playerNum){
    players[playerNum].name = that.innerHTML;
}

function newPlayer(){
    let temp = Object.keys(players).length;
    players[temp] = 
    {
        name: ("Player" + temp),
        data: [],
    }
    loadPlayers();
}

function addData(type, data, inserts, editableQ){
    let temp = '<' + type + ' '+ inserts +' contenteditable="'+editableQ+'">'

    for(let i = 0; i < data.length; i++){
        curData += (temp + data[i] + "</"+type+">");
    }
}

function pushRow(key){
    let temp = "<tr";
    if(curColor != ""){
        temp += ' style="background-color: '+ curColor + ';';
        if(curColor == "white")
            temp += ' color: black;'
        temp += '"';
    }
    temp += ">" + curData + "</tr>";
    switch (key) {
        case "bodyP":
            tBodyP.innerHTML += temp;
            break;
        case "bodyD":
            tBodyD.innerHTML += temp;
            break;
        case "head":
            tHead.innerHTML += temp;
            break;

        case "bodyPL":
            tBodyPL.innerHTML += temp;
            break;
        case "bodyDL":
            tBodyDL.innerHTML += temp;
            break;
        case "headL":
            tHeadL.innerHTML += temp;
            break;

        case "table":
            table.innerHTML += temp;
            break;
        default:
            tBodyP.innerHTML += temp;
            break;
    }
    if(!key.includes("L"))
    curColor = "";
    curData = "";
}

function scale(){
    let tback = document.getElementsByClassName("tableTainer");
    let tomp = document.getElementsByClassName("golfTable");
    let twidth,tompH,tompW,curH;    

    for(let i = 0; i < tomp.length; i++){
        twidth = tback[i].getBoundingClientRect().width;

        tomp[i].style.position = "absolute";
        tomp[i].style.transform = "scale(1)";
        tompW = tomp[i].getBoundingClientRect().width;
        tompH = tomp[i].getBoundingClientRect().height;
        
        tomp[i].style.transform = "scale("+ ((twidth)/tompW) +")";
        curH = tomp[i].getBoundingClientRect().height;

        tomp[i].style.left = (((twidth)/2) - (tompW/2))+ "px";
        tomp[i].style.top = (((curH)/2) - (tompH/2)) + "px";

        tback[i].style.height =  curH + "px";
    }
}

function debug(DebugValue){
    console.log(DebugValue);
}

function collapseArray(collapseInputArray){
    let collapseTempArray = [];
    for(let i = 0; i < Object.keys(collapseInputArray).length; i++)
        if(collapseInputArray[i] != undefined)
            collapseTempArray.push(collapseInputArray[i]);
    return collapseTempArray;
}

function isNumber(val){
    if (typeof val !== 'string') 
        return false;
      if (val.trim() === '') 
        return false;
    return !isNaN(val);
}