document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirmation = document.getElementById('passwordConfirmation').value;

    if (password !== passwordConfirmation) {
      // Passwords do not match
      createNotification('Password and password confirmation do not match.', 'notifications-container', false);
      return;
    }

    const user = {
      name,
      email,
      password,
    };

    try {
      const response = await postOrPutJSON('/api/register', 'POST', user);

      if (response.message === 'User registered successfully') {
        // Registration successful
        createNotification('User registered successfully', 'notifications-container', true);
        // Clear the form
        registerForm.reset();
      } else {
        // Registration failed
        createNotification('User registration failed', 'notifications-container', false);
      }
    } catch (error) {
      console.error(error);
      createNotification('An error occurred during registration', 'notifications-container', false);
    }
  });
});
