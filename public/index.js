const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('l-form');

signupForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const fullName = document.getElementById('f-name').value;
    const password = document.getElementById('s-password').value;
    const mobile = document.getElementById('mobile-number').value;
    const email = document.getElementById('email-address').value;
    const reqType = "sign-up";
    const result = await fetch('/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullName, password, mobile, email, reqType  //posting values to the server
        })
    }).then((res) => res.json())

    if(result.status === 'ok'){
        alert("Account created");
        signupForm.reset();
    }else{
        alert(result.error);
    }
})

loginForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const loginEmail = document.getElementById('login-id').value;
    const loginPassword = document.getElementById('login-password').value;
    const reqType = 'login'
    const result = await fetch('/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            loginEmail, loginPassword, reqType
        })
    })
    .then((res) => res.json());
    if(result.status === 'ok'){
        location.assign('/home');
    }else{
        alert("Invalid Credentials")
    }
});

const signupBtn = document.getElementById('sign-up');
const loginBtn = document.getElementById('login');
const signUpDiv = document.getElementsByClassName('sign-up-form')[0];
const loginDiv = document.getElementsByClassName('login-form')[0];
signupBtn.addEventListener('click', ()=>{
    signUpDiv.style.display = "block";
    loginDiv.style.display ="none";
})

loginBtn.addEventListener('click', ()=>{
    signUpDiv.style.display = "none";
    loginDiv.style.display ="block";
})

const aboutUsBtn = document.getElementById('about-btn');
const aboutUsDiv = document.getElementById('about-us-modal')
const aboutUs = document.getElementById('about-us')
const closeAboutBtn = document.getElementById('close-about')
aboutUsBtn.addEventListener('click', ()=>{
    aboutUsDiv.style.display= "block"
    fadeIn(aboutUs)
})

closeAboutBtn.addEventListener('click',()=>{
    resetOpacity(aboutUsDiv,aboutUs)
})

function resetOpacity(modal,element){
    modal.style.display ="none"
    element.style.opacity = "0"
  }

function fadeIn(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 20);
}