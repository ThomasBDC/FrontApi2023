const route = (event) => {
    event = event || window.event;
    event.preventDefault();
    window.history.pushState({}, "", event.target.href);
    handleLocation();
};

const routes = {
    404: "/pages/404.html",
    "/": "/pages/home.html",
    "/testApi": "/pages/testApi.html"
};

const routesJS = {
    "/testApi": "js/testApi.js"
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
};

window.onpopstate = handleLocation;
window.route = route;

handleLocation();
