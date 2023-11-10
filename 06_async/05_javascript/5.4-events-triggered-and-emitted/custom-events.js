let rollBtn = document.getElementById('roll-button');
rollBtn.addEventListener('click', () => {
    rollBtn.innerHTML = '';
    rollDice();
})

var count = 0;
var ones = 0;
var twos = 0;
var threes = 0;
var fours = 0;
var fives = 0;
var sixes = 0;
const handleRollDice = (event) => {
    document.querySelector('#totals span').textContent = ++count;
    

    switch (event.detail.value) {
        case 1:
            document.querySelector('#ones p').textContent = ++ones;
            break;
        case 2:
            document.querySelector('#twos p').textContent = ++twos;
            break;
        case 3:
            document.querySelector('#threes p').textContent = ++threes;
            break;
        case 4:
            document.querySelector('#fours p').textContent = ++fours;
            break;
        case 5:
            document.querySelector('#fives p').textContent = ++fives;
            break;
        case 6:
            document.querySelector('#sixes p').textContent = ++sixes;
            break;
    }
    const template = document.getElementById("template" + event.detail.value);
    const clonedTemplate = template.content.cloneNode(true);
    const button = document.getElementById("roll-button");
    button.innerHTML = "";
    button.appendChild(clonedTemplate);

};

document.addEventListener('rollDice', handleRollDice);