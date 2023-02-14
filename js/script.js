// Selection of HTML objects
const prenomKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";

const burger = document.querySelector('.burger i');
const nav = document.querySelector('.nav');
const url = "https://localhost:7027/api";

// Defining a function
function toggleNav() {
    burger.classList.toggle('fa-bars');
    burger.classList.toggle('fa-times');
    nav.classList.toggle('nav-active');
}

// Calling the function after click event occurs
burger.addEventListener('click', function() {
    toggleNav();
});

function toggleLoader(){
    document.getElementById("Loader").classList.toggle("hide");
}

document.getElementById("valid-form-login").addEventListener("click", (e) => {
    let cible = e.currentTarget.dataset.cible;
    let form = document.querySelector(cible);
    let data = new FormData(form);
    let value = Object.fromEntries(data.entries());
    let valueJSON = JSON.stringify(value);

    login(valueJSON, form);
});

function login(dataJSON, form){
    //faire le fetch pour envoyer le POST
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: dataJSON,
        redirect: 'follow'
    };
    toggleLoader();
    fetch(url+"/login", requestOptions)
        .then(response => response.text())
        .then(result => 
            {
                toggleLoader();
                document.querySelectorAll(".background-modal").forEach(modal => {
                    modal.classList.add("hide");
                });
                form.reset();
                let token = result;
                setToken(token);
                showAndHideElementsOnConnexion();
            })
        .catch(error => {
            toggleLoader();
            console.log('error', error);
            alert("Impossible de se connecter");
        });
}


function setToken(token){
    //TODO : Vérifier date de péremption cookie
    setCookie("accesstoken", token, 7);
}

function getToken(){
    return getCookie("accesstoken");
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function logout(){
    eraseCookie("accesstoken");
    showAndHideElementsOnConnexion();
}

function isConnected(){
    if(getToken() == null || getToken() == undefined)
    {
        return false;
    }
    else{
        return true;
    }
}

function showAndHideElementsOnConnexion(){
    let userConnected = isConnected();
    let allShowDisconected = document.querySelectorAll(".show-disconnected");
    let allShowConected = document.querySelectorAll(".show-connected");

    if(userConnected){
        allShowDisconected.forEach(node => {
            node.classList.add("hide");
        });
        allShowConected.forEach(node => {
            node.classList.remove("hide");
        });

        const token = getToken();
        let tokenPayloadJson = parseJwt(token);
        let prenom = tokenPayloadJson[prenomKey];
        document.getElementById("HelloLink").innerHTML = " Bonjour "+prenom;
    }
    else{
        allShowDisconected.forEach(node => {
            node.classList.remove("hide");
        });
        allShowConected.forEach(node => {
            node.classList.add("hide");
        });
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}