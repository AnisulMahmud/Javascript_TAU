

const navli= document.querySelector('nav ul');
navli.classList.add('list');


//creating new link
const newLink= document.createElement('li');
newLink.innerHTML = '<a href ="http://localhost:3000/">Localhost</a>';
navli.appendChild(newLink);


//insering
const orList = document.querySelector('#ordered');
const newItem = document.createElement('li');
newItem.textContent = 'Item 0';
orList.insertBefore(newItem, orList.firstChild);

//removing  navi

const toList = document.querySelector('#todo');
toList.classList.remove('navi');

const toItems = toList.querySelectorAll('li');
if(toItems.length >=4) {
    toItems[1].remove();
    toItems[2].textContent = 'Item 3';
    toItems[3].textContent = 'Item 4';

}