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