
 // Display success message and hide after 5 seconds
 const successMessage = document.getElementById('successMessage');
 if (successMessage) {
   successMessage.classList.remove('hidden');
   setTimeout(() => {
     successMessage.classList.add('hidden');
   }, 5000);
 }

 // Display error message and hide after 5 seconds
 const errorMessage = document.getElementById('errorMessage');
 if (errorMessage) {
   errorMessage.classList.remove('hidden');
   setTimeout(() => {
     errorMessage.classList.add('hidden');
   }, 5000);
 }


//  check if email registered or Not
const emailInput = document.getElementById('email');
const emailMessage = document.getElementById('emailMessage');

emailInput.addEventListener('blur', () => {
  const email = emailInput.value;

  if(email.trim() === '') return; // Skip check if email is empty

  fetch(`/user/check-email?email=${encodeURIComponent(email)}`)
    .then(response => response.json())
    .then(data => {
      if(data.exists){
        emailMessage.textContent = 'Email is already registered.';
        console.log(data.exists);
        emailInput.value = '';
        if (emailMessage) {
          emailMessage.classList.remove('hidden');
          setTimeout(() => {
            emailMessage.classList.add('hidden');
          }, 5000);
        }
      }
    })
    .catch(error => {
      console.error('Error checking email:', error);
    });
});

//  check if email registered or Not
const userInput = document.getElementById('userName');
const userMessage = document.getElementById('userMessage');

userInput.addEventListener('blur', () => {
  const userName = userInput.value;

  if(userName.trim() === '') return; // Skip check if email is empty


  fetch(`/user/check-user?userName=${encodeURIComponent(userName)}`)
    .then(response => response.json())
    .then(data => {
      if(data.exists){
        userMessage.textContent = 'User Name already taken, try different one';
        console.log(data.exists);
        userInput.value = '';
        if (userMessage) {
          userMessage.classList.remove('hidden');
          setTimeout(() => {
            userMessage.classList.add('hidden');
          }, 5000);
        }
      }
    })
    .catch(error => {
      console.error('Error checking UserName:', error);
    });
});