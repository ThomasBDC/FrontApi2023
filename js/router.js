const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/testApi": "/pages/testApi.html",
    "/replays": "/pages/replays.html",
    "/categories": "/pages/categories.html"
};

const routesJS = {
    "/testApi": "js/testApi.js",
    "/replays": "js/replays.js",
    "/categories": "js/categories.js"
};

const handleLocation = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes[404];
    //Ajout de l'html
    const html = await fetch(route).then((data) => data.text());
    document.getElementById("main-page").innerHTML = html;

    //Ajout du js
    if(routesJS[path] != undefined){
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute("type","text/javascript");
        scriptTag.setAttribute("src", routesJS[path]);

        document.querySelector("body").appendChild(scriptTag);
    }

    
    //Gestion de la fermeture des modal
    document.querySelectorAll(".background-modal").forEach(element => {
        element.addEventListener("click", (e) =>{
            e.currentTarget.classList.toggle("hide");
        })
    });

    //Gestion du click sur la modal (ne pas fermer)
    document.querySelectorAll(".modal").forEach(element => {
        element.addEventListener("click", (e) =>{
            e.stopPropagation();
        })
    });
    
    //Gestion de l'ouverture d'une modal
    document.querySelectorAll(".open-modal").forEach(element => {
        element.addEventListener("click", (e) =>{
            let cible = e.currentTarget.dataset.cible;
            document.querySelector(cible).classList.toggle("hide");
        })
    });

    showAndHideElementsOnConnexion();
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
