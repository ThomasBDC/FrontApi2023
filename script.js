//faire un fetch vers 
//URL : https://reqres.in/api/users
//METHOD : GET
// const allEntriesDiv = document.getElementById("allentries");
// const basURl = 'https://reqres.in/';
// const BaseUrlUser = basURl+"api/users";
// document.getElementById("getUsers").addEventListener("click", function(){
//     getAllUser();    
// })

// function getAllUser(){
//     let numPage = document.getElementById("pageNum").value;
//     fetch(BaseUrlUser+'?' + new URLSearchParams({
//                 per_page: 2,
//                 page:+numPage
//             }).toString()
//             , { method:'GET' })
//     .then(function(response){
//         return response.json();
//     })
//     .then(function (responseJson){
//         allEntriesDiv.innerHTML='';
//         let allUserArray = responseJson.data;
    
//         allUserArray.forEach(user => {
//             allEntriesDiv.innerHTML += user.email +"<br>";
//         });
//     });
// }


// function createUser(){
//     let name = document.getElementById("nomInput").value;
//     let job = document.getElementById("jobInput").value;
//     fetch(BaseUrlUser, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body:JSON.stringify({
//             "name": name,
//             "job": job
//         })
//     })
//     .then(function(response){
//         return response.json()
//     })
//     .then(function(responseJson){
//         let dateCreation = new Date(responseJson.createdAt);
//         alert("Félicitations, l'utilisateur n°"+responseJson.id+" a bien été créé/ "+
//         " à "+dateCreation.toLocaleTimeString()+" Nom :"+responseJson.name+" Job:"+responseJson.job);
//     })
// }


// Selection of HTML objects
const burger = document.querySelector('.burger i');
const nav = document.querySelector('.nav');

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