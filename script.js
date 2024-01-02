const container = document.querySelector('.container');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');

loginBtn.addEventListener('click', () => {
    container.classList.add('active');
});

registerBtn.addEventListener('click', () => {
    container.classList.remove('active');
});


document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const username = document.getElementById("name").value;
    const userid = document.getElementById("ID").value;
    const userpw = document.getElementById("pw").value;
    // 서버로 데이터 전송
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, userid: userid, userpw: userpw }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('서버 응답:', data);
            if (data.success) {
                alert('성공: ' + data.message);
            } else {
                alert('오류: ' + data.message);
            }
        })
        .catch(error => {
            console.error('에러:', error);
        });
});
document.getElementById("signinForm").addEventListener("submit", function (event) {
    event.preventDefault(); // 기본 제출 동작 방지

    const userid = document.getElementById("savedID").value;
    const userpw = document.getElementById("savedpw").value;

    // 서버로 데이터 전송
    fetch('/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userid: userid, userpw: userpw }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('서버 응답:', data);
        })
        .catch(error => {
            console.error('에러:', error);
        });
});