let resp;
let courses;
let courseData;
let holeData;
let teeBoxData;
let colorLib;
let table = document.getElementById("table");
let tHead = document.getElementById("tableHead");
let tBodyD = document.getElementById("tableBodyDefaults");
let tBodyP = document.getElementById("tableBodyPlayers");
let navT   = document.getElementById("navTainer");
let stickyT = document.getElementById("sticky");

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
    console.log(courseData);
    console.log(courseData[0].holes);
    }
    else{ // I used this while at school because they block http requests
        console.error("Caught Error");
        await import("./mod.mjs").then((module) => {
            console.log(module.constHoles);
            courseData = [module.constHoles];
            courses = module.constCourses;
    } );    }
    await import("./colorLibary.mjs").then((module)=>colorLib = module.libraryColors);
    document.getElementById("navTainer").innerHTML = '<button id="dropdown" onclick="toggle(this, '+"'onQ'"+'); toggleDropmenu()"><div class="spanBar"></div><div class="spanBar"></div><div class="spanBar"><div class="smallSpan"></div></div></div>';
    for(let i = 0; i < courses.length; i++)
        addCourseCard(courses[i] ,courseData[i], i);
    firstLoad();
}
// <!-- Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia doloribus laudantium voluptate! -->
// <!-- Lorem ipsum dolor sit, amet consectetur adipisicing elit. Mollitia doloribus laudantium voluptate! -->

let pubScope = false;
let dataCount = 18;
let firstHalf = Math.round(dataCount/2)
let secondHalf = dataCount - firstHalf;
let curCourse = 0;
let curData = "";
let curColor = "";
let curTeeBox = 0;
let cInfos, cNails, cItems, itemTot, infoTot, largestInfo, navType, haburgerMenu, courseCards = [];

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const summation = (accumulator, curr) => accumulator + curr;
const capFirst = (word) => word.charAt(0).toUpperCase() + word.slice(1);

let players = {
    0:{
        name: "Player1",
        data: [],
    }
}

function firstLoad(){
    holeData = courseData[curCourse].holes;
    changeTeeColor();
    loadTable();
    loadTeeboxs();
    initNav();
    formatNav();
}

function loadTable(){
    /*------ Clear Table Data ------*/
    tBodyP.innerHTML = ""; tBodyD.innerHTML = ""; tHead.innerHTML = "";
    tBodyPL.innerHTML = ""; tBodyDL.innerHTML = ""; tHeadL.innerHTML = "";
    /*------ Clear Table Data ------*/

    let tempData;

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
    addData("th", [""], "", false);
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
    addData("th", [""], "", false);
    pushRow("bodyDL"); // Push Handicap


    tempData = [];
    addData("th", ["Par"], "", false); // Add par
    for(let i = 0; i < firstHalf; i++){
        tempData[i] = holeData[i].teeBoxes[curTeeBox].par;
    }
    addData("td", tempData, "", false);
    addData("th", [tempData.reduce(summation)], "", false);
    pushRow("bodyD")

    tempData = [];
    for(let i = firstHalf; i < dataCount; i++)
        tempData.push(holeData[i].teeBoxes[curTeeBox].par);
    addData("th", ["Par"], "", false);
    addData("td", tempData, '', false);
    addData("th", [tempData.reduce(summation)], '', false);
    pushRow("bodyDL"); // Push par


    /*----- Load Header(s) -----*/

    let temp = [...Array(firstHalf).keys()].map((n, f) => ++n);
    temp.unshift("Player");
    temp.push("Out");
    temp.push("Total");
    addData("th", temp, "", false);
    pushRow("head");
    temp = [...Array(secondHalf).keys()].map((n, f) => ++n + firstHalf);
    temp.unshift("Player");
    temp.push("In");
    temp.push("");

    addData("th", temp, "", false)
    pushRow("headL");

    loadPlayers();  
}

function changeTeeColor(){
    tempColor = courseData[curCourse].holes[1].teeBoxes[curTeeBox].teeColorType;
    document.documentElement.style
    .setProperty('--backColor', tempColor);
    document.documentElement.style
    .setProperty('--txtColor', returnInvertRGB(colorLib[tempColor].rgb, true));
    let i = 0;
    for(let iter of document.getElementsByClassName('teeBox')){
        if(i == curTeeBox)
            iter.classList.add('on');
        else
            iter.classList.remove('on');
        i++;
    }
}

function initNav(){
    
    cInfos       = document.getElementsByClassName("cInfo");
    cNails       = document.getElementsByClassName("tNail");
    haburgerMenu = document.getElementById("dropdown");
    cItems       = document.getElementsByClassName("courseItem");
    infoTot = 0, itemTot = 0;

    for (const i of cInfos){
        infoTot += (i.getBoundingClientRect().width);
    }
    for ( let i of cItems){
        itemTot += (i.getBoundingClientRect().width + 16);
    }
    largestInfo = 0;
    for(i of cInfos)
        if(i.getBoundingClientRect().width > largestInfo)
            largestInfo = i.getBoundingClientRect().width;
}

function formatNav(){
    applySelect();
if(cInfos != undefined){
    navBox = navT.getBoundingClientRect().width;
    if((itemTot - (infoTot - largestInfo)) > (navBox)){ // Hamburger test
        if(navType != 3){
            for(let oi of cItems)
                oi.style.display = "none"
            haburgerMenu.style.display ="flex";
            navType = 3;
        }
    }
    else if(itemTot > navBox){ // Only selected test
        if(navType != 2){
            makeVisible();
            for(let i = 0; i < cInfos.length; i++)
                if(!cItems[i].classList.contains("selected"))
                    cInfos[i].style.display = "none";
            navType = 2;
        }
    }
    else{
        if(navType != 1){
            makeVisible();
            navType = 1;
        }
    }
    if(navType == 3)
        scaleNav();
}
}

function toggleDropmenu(removeQ){
    let that = document.getElementById('dropdown');
    if(removeQ != undefined)
        that.classList.remove('onQ');
    let dropMenu = document.getElementById('dropMenu');
    dropMenu.classList.remove('keyclassDisappear');
    if(that.classList.contains('onQ')){
        dropMenu.focus();
        for(let i = 0; i < 3; i++){
            dropMenu.innerHTML += createLine('div', courseCards[i], 'class="dropItem"');
            dropMenu.children[i].style.margin = "1%";
            dropMenu.children[i].children[0].classList.remove('courseItem');
        }
        scaleNav();
    }
    else
        dropMenu.innerHTML = '';
}

function loadTeeboxs(){
    let teeTain = document.getElementById('teeSelect');
    let thmp = document.createElement("div");
    teeTain.innerHTML = '';
    let tempBoxes = holeData[1].teeBoxes;
    curTeeBox = clamp(curTeeBox, 0, (tempBoxes.length - 1));
    console.log(tempBoxes);

    let i = 0;
    for(let iter of tempBoxes){
        if(iter.teeColorType != null){
        iter.value = i;
        iter.id = i;
        thmp.classList.add('teeBox');
        thmp.addEventListener("click", function(){changeTee(iter.value);});
        thmp.style.backgroundColor = iter.teeColorType;
        thmp.style.color = returnInvertRGB(colorLib[iter.teeColorType].rgb, true);
        thmp.innerText = (iter.teeType).toUpperCase();
        if(i == curTeeBox){
            thmp.classList.add("on");
        }

        teeTain.appendChild(thmp);
        thmp = document.createElement("div");
        i++;
    }
    }
}

function returnInvertRGB(rgb,blackQ, percentage){
    if(blackQ == undefined)
        blackQ = false;
    if(percentage == undefined)
        percentage = 1;
    rgb = rgb.slice(4,-1);
    rgb = rgb.split(',');
    let temp = 0;
    for(let i = 0; i < 3; i++){
        rgb[i] -= (255*percentage);
        rgb[i] = Math.abs(rgb[i]);
        temp += rgb[i];
    }
    if(blackQ)
        for(let i = 0; i < 3; i++)
            rgb[i] = Math.round((temp/3)/255)*255
    return 'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')';
}

function scaleNav(){
    let tWhole = document.getElementsByClassName('droptainer')[0];
    let tback = tWhole.getElementsByClassName("dropItem");
    let tomp = tWhole.getElementsByClassName("cItem");
    let twidth,tompH,tompW,curScale;  

if(tback.length > 0){
    for(let i = 0; i < 3; i++){
        tomp[i].style.transform = 'scale(1)';

        twidth = tback[i].getBoundingClientRect().width;

        tompW = 0;
        for(let iter of tomp[i].children)
            tompW += iter.getBoundingClientRect().width + 16;
        
        tomp[i].style.margin = '0';

        tompH = 0;
        for(let iter of tomp[i].children){
           tompH = Math.max(tompH, iter.getBoundingClientRect().height);
        }
        tomp[i].style.width = (tompW - 16) + "px"
        tomp[i].style.height = (tompH - 16) + "px"

        curScale = clamp(twidth/tompW, 0, 1);

        tback[i].style.height = (tompH * curScale) + 'px';

        tomp[i].style.transform = 
        'scale('+curScale+')';
        if(curScale == 1)
            tomp[i].style.width = '100%';
    }
}
applySelect();
}

function makeVisible(){
    haburgerMenu.style.display = "none";
    document.getElementById('dropMenu').innerHTML = '';
    for(let i of cItems)
        i.style.display = "flex";
    for(let i of cInfos)
        i.style.display = "block";
}

function reorder(that){
    let parent = document.getElementById('dr1');
    let frag = document.createDocumentFragment();
    parent.firstChild = parent.children[0];

    frag.appendChild(that);
    for(let i of parent.children)
        if(i != that)
            frag.appendChild(i.cloneNode(true));
    parent.innerHTML = null;
    parent.appendChild(frag);
}

function toggle(that, chosenClass){
    if(that.classList.contains(chosenClass))
        that.classList.remove(chosenClass);
    else
        that.classList.add(chosenClass);
}

function toggleNav(that){
    if(that.classList.contains('onQ')){
        navT.style.transform = 'scaleY(100%)';
        navT.style.zIndex = '-1';
        navT.style.height = '0';
        navT.style.padding = '0 1em';
        navT.classList.add('hide');
    }
    else{
        navT.style.transform = 'translateY(0)';
        navT.style.zIndex = '0 !important';
        navT.style.height = '8em';
        navT.style.padding = '1em';
        navT.classList.remove('hide');
    }
}

function loadPlayers(){
    let tempData = [];
    tBodyP.innerHTML = "";
    tBodyPL.innerHTML = "";
    for (let i in players) {
        addData("th", [players[i].name], ' class="playerName'+i+'" onblur="hideElement()" onfocus="popupElement(0, this)" oninput="ensureName(this)" onblur="changeName(this,'+i+')"', true);
        for(let ii = 0; ii < dataCount; ii++){
            if(ii == Math.round((dataCount)/2)){
                addData("th", [""], ' class="outSum', false);
                addData("th", [""], ' class="outTot"', false);
                pushRow("bodyP");
                addData("th", [players[i].name], ' class="playerName'+i+'" onblur="hideElement()" onfocus="popupElement(0, this)" oninput="ensureName(this)" onblur="changeName(this,'+i+')"', true);
            }
            if(players[i].data[ii] == undefined)
                tempData.push("");
            else 
                tempData.push(players[i].data[ii]);
            addData("td", [tempData[tempData.length - 1]], ' oninput="changeData(this,'+ i + ","+ ii +')"', true);
        }
        addData("th", [""], ' class="inSum"', false);
        addData("th", [""], ' class="inTot"', false);
        pushRow("bodyPL");
    }
    scale();
    updateAllSums();
}

function scope(val){
    pubScope = val;
}

function changeData(that, playerNum, idx){
    let curInput = that.innerHTML;
    if(!isNumber(curInput))
        that.innerHTML = curInput.replace(/[^\d-]/g, ''); // This regex removes all letters & symbols, leaving only digits
      else
        if(curInput > 999 || curInput < 0)
            that.innerHTML = clamp(curInput,0,999);
    
    players[playerNum].data[idx] = that.innerHTML;

    
    if(idx < firstHalf)
        updateSum("outSum", playerNum);
    else
        updateSum("inSum", playerNum);
    updateSum("outTot", playerNum)
    updateSum("inTot", playerNum)

    scale();
}

function newPlayer(){
    let temp = Object.keys(players).length;
    players[temp] = 
    {
        name: ("Player" + (temp + 1)),
        data: [],
    }
    loadPlayers();
}

function getDomain(url) {
    var anchor = document.createElement('a');
    anchor.setAttribute('href', url);
    return anchor.hostname;
}

function addCourseCard(cNail, cInfo, cId){
    let currentHtml = "", temp;
    let testNames = ["status", "hours", "courseType", "city", "addr1", "addr2", "phone", "website"];
    for(let i = 0; i < testNames.length; i++){
        temp = testNames[i];
        if(cInfo[temp] != null && cInfo[temp] != undefined){
            if(temp == "website"){
                temp = capFirst(testNames[i]) + ':<a target="_blank" href="'+cInfo[temp]+'">'+getDomain(cInfo[temp]).slice(4)+'</a>';
                currentHtml += createLine("li", temp, "");
            }
            else{
                temp = capFirst(testNames[i]) + ": "+ cInfo[temp];
                currentHtml += createLine("li", temp, "");
            }
        }
    }
    currentHtml = createLine('ul', currentHtml, 'class="cInfo"');
    temp = createLine("img", cNail.image, '', cNail.name);
    temp += createLine("p", cNail.name, "");
    temp = createLine("div", temp, 'class="tNail"');
    currentHtml = createLine('div', temp + currentHtml, 'class="courseItem cItem" onclick="changeCourse('+cId+')"');

    
    navT.innerHTML += currentHtml;
    courseCards.push(currentHtml);
}

function changeCourse(val){
    curCourse = val;
    holeData = courseData[curCourse].holes;
    applySelect();
    loadTeeboxs();
    navType = 0;
    formatNav();
    loadTable();
    changeTeeColor();
}

function applySelect(){
    let tomp = navT.getElementsByClassName('cItem');
    let i = 0;
    for(let iter of tomp){
        if(i == curCourse)
            iter.classList.add('selected');
        else
            iter.classList.remove('selected');
        i++;
    }
    tomp = document.getElementsByClassName('dropItem');
    i = 0;
    for(let iter of tomp){
        if(i == curCourse)
            iter.classList.add('selected');
        else
            iter.classList.remove('selected');
        i++;
    }
}

function createLine(tag, guts, inserts, other){
    if(tag == "img"){
        return '<img src="'+guts+'" alt="'+other+'" ' + inserts + '>' 
    }
    return '<'+tag+' '+ inserts+'>'+ guts +'</'+tag+'>'; 
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
        case "outTot":
            ibot = 0;
            itop = dataCount;
            break;
        case "inTot":
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
    let pColors = ["red", "#888", "green"]
    let arrowType = clamp(parSum - sum, -1, 1) + 1;
    /*let iconBlock = 
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 300 300">'+
    '<path fill="'+pColors[arrowType]+'" stroke="black" stroke-width="1"'+
    path[arrowType]+'</svg>';*/
    
    let iconBlock = '<div class="center" style="font-size:9px;color:'+
    pColors[arrowType]+';">('+((arrowType < 1) ? "+" : "") + 
    (sum-parSum) +
    ')</div>';

    if(sum == 0)
        sumType.innerHTML = "";
    else
        sumType.innerHTML = '<div class="center">' + sum + iconBlock + '</div>';
    scale();
}

function updateAllSums(){
    for(let i in players){
        updateSum("outSum", i);
        updateSum("inSum", i);
    }
}

function changeTee(val){
    curTeeBox = val;
    changeTeeColor();
    loadTable();
    loadPlayers();
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

function addData(type, data, inserts, editableQ){
    let temp = '<' + type + ' '+ inserts +' contenteditable="'+editableQ+'">'

    for(let i = 0; i < data.length; i++){
        curData += (temp + data[i] + "</"+type+">");
    }
}

function popupElement(type, that){
    let popElem;
        popElem = document.getElementById('popup-trash');
        console.log(popElem);
    let tain = document.createElement('div');
    tain.appendChild(popElem);
    
    that.appendChild(popElem);
    that.children[0].value = that.classList[0].slice(10);
    // that.children[0].id = "";
    that.children[0].style.display = "flex";
    // that.children[0].focus();
    // that.focus();
}

function hideElement(){
    let temp = document.getElementById('popup-trash');
    document.querySelector("body").appendChild(temp);
    if(pubScope){
        deleteRow(temp.value);
    }
    temp.style.display = 'none';
}

function deleteRow(val){
    players[val] = undefined;
    players = collapseArray(players);
    loadPlayers();
}

function pushRow(key){
    let temp = "<tr";
    if(curColor != ""){
        temp += ' style="background-color: '+ curColor + ';';
        if(curColor == "white")
            temp += ' color: black;'
        else if(curColor == "black")
            temp += ' color: aliceblue;'
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