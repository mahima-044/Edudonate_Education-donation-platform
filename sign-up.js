// document.addEventListener('DOMContentLoaded', () => {
//     const authForm = document.getElementById('auth-form');
//     const formTitle = document.getElementById('form-title');
//     const nameField = document.getElementById('name-field');
//     const submitBtn = document.getElementById('submit-btn');
//     const switchLink = document.getElementById('switch-link');
//     const switchText = document.getElementById('switch-text');

//     let isSignUp = true;

//     // This function handles the form submission
//     const handleFormSubmit = (event) => {
//         event.preventDefault(); // This stops the page from reloading

//         // You can add your actual form validation here
//         const email = document.getElementById('email').value;
//         const password = document.getElementById('password').value;

//         if (isSignUp) {
//             // Sign-up logic
//             console.log('Sign Up successful!');
//         } else {
//             // Login logic
//             console.log('Login successful!');
//         }

//         // Redirect the user to the home page after a successful action
//         window.location.href = 'index.html';
//     };

//     // This function switches between the forms
//     const toggleForm = (event) => {
//         event.preventDefault();
//         isSignUp = !isSignUp;
//         authForm.reset();
        
//         if (isSignUp) {
//             formTitle.textContent = 'Sign Up';
//             submitBtn.textContent = 'Sign Up';
//             nameField.style.display = 'block';
//             switchText.innerHTML = 'Already have an account? <a href="#" id="switch-link">Log In</a>';
//         } else {
//             formTitle.textContent = 'Log In';
//             submitBtn.textContent = 'Log In';
//             nameField.style.display = 'none';
//             switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switch-link">Sign Up</a>';
//         }
//         document.getElementById('switch-link').addEventListener('click', toggleForm);
//     };

//     // Attach event listeners to the form and the switch link
//     authForm.addEventListener('submit', handleFormSubmit);
//     if (switchLink) {
//         switchLink.addEventListener('click', toggleForm);
//     }
// });

// ** Redirect to Home Page **
window.location.href = 'index.html';