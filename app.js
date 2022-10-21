let totals = document.getElementsByClassName("tdTotal");
let datas = document.getElementsByClassName("inputData");
let playerDatas = document.getElementsByClassName("inputDataP");
let playersBlock = document.getElementsByClassName("players");
let popups = document.getElementsByClassName("popup");
let playerTemplate = '<tr><th scope="row" id="player0">PlayerXMPL</th>'      +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td><input class="inputDataP" type="number" placeholder="..."></td>' +
'<td class="tdTotal"></td></tr>'
const summation = (accumulator, curr) => accumulator + curr;
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

let tast = [5,3,2,1,6,7,8,9];
let selectedLiItem = undefined;
let scopeQ = false;

function returnPlayerTemplate(name, ary, idx){
    let temp = '<tr><th scope="row" contenteditable="true" id="player'+ idx +'" oninput="changeName(this)" onfocus="popupAt(this, 0)" onblur="removePopups(this.parentElement)">' + name + '</th>';
    for(let i = 0; i < ary.length; i++){
        temp += '<td><input class="inputDataP" type="number" placeholder="..."></td>'
    }
    temp += '<td colspan="2"class="tdTotal"></td></tr>';
    return temp;
}

let cardObj = {
    0:{ name: "Par",
        data: [01,02,03,04,05,06,07,08,09],
        total: 0000
    },
    1:{ name: "Yardage",
        data: [10,11,12,13,14,15,16,17,18],
        total: 0000
    },
    2:{ name: "Handicap",
        data: [19,20,21,22,23,24,25,26,27],
        total: 0000
    },
    3:{
        players: [
            { name: "Gene",
                data: ["","","","","","","","","",],
                total: 0000
            },
            { name: "Stevie",
            data: ["","","","","","","","",""],
            total: 0000
        }    
        ]
    }
}
updateTotals();
firstLoad();


function firstLoad(){
    for(let i = 0; i < 3; i++){ //Load Default bars
        for(let ii = 0; ii < cardObj[i].data.length; ii++){
            datas[(i * 9) + ii].value = cardObj[i].data[ii];
            datas[(i * 9) + ii].id = i + ":" + ii;
            datas[(i * 9) + ii].addEventListener("input", changeValue)
        }
        totals[i].innerHTML = cardObj[i].total;
    }
    loadPlayers();
    scale();
}

function newRow(){
    let tomp =  { name: "NewPlayer",
                data: ["","","","","","","","",""],
                total: 0000
            }   
    console.log(cardObj);
    
    cardObj[3].players.push(tomp);
    load();
}

function changeValue(){
    temp = this.id.split('');
    if(!temp.includes('P')){
        i = temp.splice(0,temp.indexOf(':')).join('');
        ii =  temp.splice(temp.indexOf(':') + 1).join('');
        cardObj[i].data[ii] = Number(this.value);
        updateTotals();
        load();
    }
    else{
        i = temp.splice(0,temp.indexOf('P')).join('');
        ii =  temp.splice(temp.indexOf('P') + 1).join('');
        if(this.value != "")
            this.value = clamp(Number(this.value), 0, 99)
        cardObj[3].players[i].data[ii] = Number(this.value);
        updateTotals();
        for(let i = 0; i < cardObj[3].players.length; i++){ //Load Default bars
            totals[i + 3].innerHTML = cardObj[3].players[i].total;
        }
    }
}

function updateTotals(){
    // console.log(totals);
    for (let i = 0; i < 3; i++){
        cardObj[i].total = cardObj[i].data.reduce(summation);
    }
    for (let i = 0; i < cardObj[3].players.length; i++)
        cardObj[3].players[i].total = cardObj[3].players[i].data.reduce(summation);
}
function load(){
    totals = document.getElementsByClassName("tdTotal");
    datas  = document.getElementsByClassName("inputData");
    cardObj = collapseArray(cardObj); // ensure no holes
    // console.log(cardObj[3].players.length);
    for(let i = 0; i < 3; i++){
        for(let ii = 0; ii < cardObj[i].data.length; ii++) // Load data values 
            datas[(i * 9) + ii].value = clamp(cardObj[i].data[ii], 0, 99); // Load data values
        totals[i].innerHTML = cardObj[i].total; // load totals
    }

    loadPlayers();
    scale();
}

function loadPlayers(){
    let temp = "";
    totals = document.getElementsByClassName("tdTotal");
    for(let i = 0; i < cardObj[3].players.length; i++){
        temp += returnPlayerTemplate(cardObj[3].players[i].name, cardObj[3].players[i].data, i);
    }
    playersBlock[0].innerHTML = temp;
    playerDatas = document.getElementsByClassName("inputDataP");
    for(let i = 0; i < cardObj[3].players.length; i++){ //Load Default bars
        for(let ii = 0; ii < cardObj[3].players[i].data.length; ii++){
            playerDatas[(i * 9) + ii].value = cardObj[3].players[i].data[ii];
            playerDatas[(i * 9) + ii].id = i + "P" + ii;
            playerDatas[(i * 9) + ii].addEventListener("input", changeValue);
        }
        totals[i + 3].innerHTML = cardObj[3].players[i].total;
    }
}

function collapseArray(collapseInputArray){
    let collapseTempArray = [];
    for(let i = 0; i < Object.keys(collapseInputArray).length; i++)
        if(collapseInputArray[i] != undefined)
            collapseTempArray.push(collapseInputArray[i]);
    return collapseTempArray;
}

function changeName(that){
    cardObj[3].players[extractID(that.id, "player")].name = that.innerHTML;
}

function popupAt(that, popType){
    let thatRect = that.getBoundingClientRect();
    let teight = thatRect.height;

    selectedLiItem = extractID(that.id, "player");

    // popups[0].style.display = "block";


    popups[popType].style.height = teight + "px";
    popups[popType].style.width = teight + "px";
    popups[popType].style.left = (thatRect.x + thatRect.width) + "px";
    popups[popType].style.top = (thatRect.y) + "px";

    showItem(popups[0]);
}

function removePopups(that){
    if(scopeQ)
        deleteItem(that);
    for (let i = 0; i < popups.length; i++) {
            popups[i].style.display = "none";
    }
}

function extractID(tid, word){
    let temp = (tid).split('');
    temp = temp.splice(temp.indexOf(word.charAt(word.length - 1)) + 1);
    return temp[0];
}

function showItem(that){
        that.style.display = "flex";
        // that.style.transform = "rotateX(0deg)";
        // that.style.height = "0px"
        that.classList.add('showUpX');
}

function removeItem(that, loadQ){
    if(loadQ == undefined){
        that.classList.add('vanishY');
        setTimeout(removeItem, 150, that, true);
    }
    else{
        that.style.display = "none";
        load();
    }
}

function deleteItem(that){
    cardObj[3].players[selectedLiItem] = null;
    cardObj[3].players = collapseArray(cardObj[3].players);
    // load();
    removeItem(that);
}

function setScope(tomp){
    scopeQ = tomp;
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