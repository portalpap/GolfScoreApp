let totals = document.getElementsByClassName("tdTotal");
let datas = document.getElementsByClassName("inputData");
const summation = (accumulator, curr) => accumulator + curr;
let tast = [5,3,2,1,6,7,8,9];

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
    3:{ name: "Player",
        data: [28,29,30,31,32,33,34,35,36],
        total: 0000
    }    
}

function fillObject(){
    
}

updateTotals();
firstLoad();

function firstLoad(){
    for(let i = 0; i < Object.keys(cardObj).length; i++){
        for(let ii = 0; ii < cardObj[i].data.length; ii++){
            datas[(i * 9) + ii].value = cardObj[i].data[ii];
            datas[(i * 9) + ii].id = i + ":" + ii;
            datas[(i * 9) + ii].addEventListener("input", changeValue)
        }
        totals[i].innerHTML = cardObj[i].total;
    }
}

function newRow(){
    let tomp =  { name: "NewPlayer",
                data: [0,0,0,0,0,0,0,0,0],
                total: 0000
            }   
    console.log(cardObj);
    
    cardObj[Object.keys(cardObj).length] = tomp;
    load();
}

function changeValue(){
    temp = this.id.split('');
    i = temp.splice(0,temp.indexOf(':')).join('');
    ii =  temp.splice(temp.indexOf(':') + 1).join('');
    cardObj[i].data[ii] = Number(this.value);

    updateTotals();
    load();
}

function updateTotals(){
    for (let i = 0; i < totals.length; i++)
        cardObj[i].total = cardObj[i].data.reduce(summation);
}
function load(){
    totals = document.getElementsByClassName("tdTotal");
    datas  = document.getElementsByClassName("inputData");
    cardObj = collapseArray(cardObj); // ensure no holes
    for(let i = 0; i < Object.keys(cardObj).length; i++){
        for(let ii = 0; ii < cardObj[i].data.length; ii++) // Load data values 
            datas[(i * 9) + ii].value = cardObj[i].data[ii]; // Load data values
        totals[i].innerHTML = cardObj[i].total; // load totals
    }
}

function collapseArray(collapseInputArray){
    let collapseTempArray = [];
    for(let i = 0; i < Object.keys(collapseInputArray).length; i++)
        if(collapseInputArray[i] != undefined)
            collapseTempArray.push(collapseInputArray[i]);
    return collapseTempArray;
}
