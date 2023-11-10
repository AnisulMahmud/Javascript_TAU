
const form = document.getElementById('form');
const contacts = document.getElementById('contacts');
const conTemp = document.getElementById('contact-template');

//adding

form.addEventListener('submit', function (ex){
    ex.preventDefault();

    

    //cloning
    const newCon = conTemp.content.cloneNode(true);


    //update
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const homepage = formData.get('homepage');

    newCon.querySelector('h2').textContent = name;
    newCon.querySelector('.email').textContent = email;


    const homepageLink = newCon.querySelector('.homepage a');
    homepageLink.textContent = homepage;
    homepageLink.href = homepage;

    //appending
    contacts.appendChild(newCon);

    form.reset();


});