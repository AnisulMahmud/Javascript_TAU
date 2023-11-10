
const incButton = document.getElementById('increment');
const decButton = document.getElementById('decrement');
const resButton = document.getElementById('reset');
const countPara = document.getElementById('counter');


let countVal= 0;

function update(){
    countPara.textContent = countVal;
}

//increment

incButton.addEventListener('click', () =>{
    countVal+=1;
    if(countVal > 5)
       countVal = -5;
    
       update();
});

decButton.addEventListener('click', () =>{
    countVal-=1;
    if(countVal < -5)
       countVal = 5;
    
       update();
});

resButton.addEventListener('click',() =>{
    countVal = 0;
    
    update();
});