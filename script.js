const container = document.querySelector('.container');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');
loginBtn.addEventListener('click', () => {
    container.classList.add('active');
});

registerBtn.addEventListener('click', () => {
    container.classList.remove('active');
});