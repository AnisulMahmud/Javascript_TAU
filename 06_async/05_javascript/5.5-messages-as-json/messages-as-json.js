document.addEventListener('DOMContentLoaded', () => {
    

    document.addEventListener('userDataReady', (event) => {
      const userData = JSON.parse(event.detail.jsonText);
      const contactsDiv = document.getElementById('contacts');
      const userCardTemplate = document.getElementById('user-card-template');
  
      
      userData.forEach((user) => {
        
        const userCard = userCardTemplate.content.cloneNode(true);
  
       
        userCard.querySelector('img').src = user.avatar;
        userCard.querySelector('img').alt = user.firstName + ' ' + user.lastName;
        userCard.querySelector('h1').textContent = user.firstName + ' ' + user.lastName;
        userCard.querySelector('.email').textContent = user.email;
        userCard.querySelector('.phone span').textContent = user.phoneNumber;
        userCard.querySelector('.address').children[0].textContent = user.address.streetAddress;
        userCard.querySelector('.address').children[1].textContent = user.address.zipCode + ' ' + user.address.city;
        userCard.querySelector('.address').children[2].textContent = user.address.country;
        userCard.querySelector('.homepage a').href = user.homepage;
        userCard.querySelector('.homepage a').textContent = user.homepage;
  
        
        contactsDiv.appendChild(userCard);
      });
    });
  
   
    fetchUserData();
  });