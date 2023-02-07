//Code qui s'exécute en ouvrant la page
const urlApi = "https://localhost:7027/api";
const ctrlcategorie = "categories";
const urlcategorie = urlApi + "/" + ctrlcategorie;
getAllcategories();

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

//Valider le formulaire de création
document.querySelectorAll(".valid-form-create").forEach(element => {
    element.addEventListener("click", (e) =>{
        let cible = e.currentTarget.dataset.cible;
        let form = document.querySelector(cible);
        let data = new FormData(form);
        let value = Object.fromEntries(data.entries());
        let valueJSON = JSON.stringify(value);

        createcategorie(valueJSON, form);
        });
});

//Valider le formulaire de modification
document.querySelectorAll(".valid-form-edit").forEach(element => {
    element.addEventListener("click", (e) => {
        //Récupérer les données du formulaire
        let cible = e.currentTarget.dataset.cible;
        let form = document.querySelector(cible);
        let data = new FormData(form);
        let value = Object.fromEntries(data.entries());
        let valueJSON = JSON.stringify(value);
        //Faire l'appel AJAX (PUT)
        Editcategorie(value.id, valueJSON);

    });
});

//Méthodes
//Récupérer et afficher tous les replaus
function getAllcategories(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    toggleLoader();
    fetch(urlcategorie, requestOptions)
    .then(response => response.json())
    .then(result => {
        let myDiv = document.getElementById("allcategories");
        myDiv.innerHTML = "";
        result.forEach(element => {
            let categorieHtml = `
                                <div class="linkcategorie">
                                    <div class="link-header">
                                        <h2>${element.title}</h2>
                                        <div>
                                            <button class="edit-categorie" data-id="${element.id}">Modifier</button>
                                            <button class="delete-categorie" data-id="${element.id}">Supprimer</button>
                                        </div>
                                    </div>
                                    <div class="linkcategorieContent">
                                        <p>${element.description}</p>
                                    </div>
                                </div>
                            `;
            myDiv.innerHTML += categorieHtml;
        });
        document.querySelectorAll(".delete-categorie").forEach(buttonDelete => {
            buttonDelete.addEventListener("click", (e)=> {
                if(confirm("Voulez-vous supprimer cet élément ?")){
                    let id = buttonDelete.dataset.id;
                    Deletecategorie(id);
                }
            });
        });
        document.querySelectorAll(".edit-categorie").forEach(buttonEdit => {
            buttonEdit.addEventListener("click", (e) =>{
                let id = buttonEdit.dataset.id;

                //Récupérer les informations du categorie via son id
                getcategorie(id).then(categorie =>{
                    console.log(categorie);
                    //Ouvrir une modal de modification
                    let modalEdit = document.getElementById("modal-edit-categorie");
                    modalEdit.classList.remove("hide");

                    //Remplir cette modal avec les informations du categorie
                    let formEdit = modalEdit.querySelector("#edit-categorie-form");
                    formEdit.elements['id'].value = categorie.id;
                    formEdit.elements['title'].value = categorie.title;
                    formEdit.elements['description'].value = categorie.description;

                    //Au click envoyer un PUT vers l'API
                });

            });
        });
        toggleLoader();
    })
    .catch(error => {
        toggleLoader();
        console.log('error', error);
        alert("Impossible de joindre l'API.");
    });
}

//Appel AJAX pour créer un categorie
function createcategorie(dataJSON, form){
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
        fetch(urlcategorie, requestOptions)
            .then(response => response.text())
            .then(result => 
                {
                    toggleLoader();
                    getAllcategories();
                    document.querySelectorAll(".background-modal").forEach(modal => {
                        modal.classList.add("hide");
                    });
                    form.reset();
                })
            .catch(error => {
                toggleLoader();
                console.log('error', error);
                alert("Création impossible");
            });
}

//Appel AJAX pour modifier un categorie
function Editcategorie(idcategorie, dataJSON){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: dataJSON,
        redirect: 'follow'
    };
    toggleLoader();
    fetch(urlcategorie+"/"+idcategorie, requestOptions)
        .then(response => response.text())
        .then(result => 
            {
                //Je ferme le loader
                toggleLoader();
                //Je refresh la liste des categories
                getAllcategories();
                //JE ferme ma modal
                document.querySelectorAll(".background-modal").forEach(modal => {
                    modal.classList.add("hide");
                })
            })
        .catch(error => {
            toggleLoader();
            console.log('error', error);
            alert("Modification impossible");
        });
    
}

//Appel AJAX pour supprimer un categorie
function Deletecategorie(idcategorie){
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
    toggleLoader();
    fetch(urlcategorie+"/"+idcategorie, requestOptions)
    .then(response => response.text())
    .then(result => {
        toggleLoader();
        getAllcategories();//Cette méthode refresh la liste de categorie
    })
    .catch(error => {
        toggleLoader();
        alert("Une erreur est survenue");
        console.log('error', error)
    });
}

//Appel AJAX pour récupérer un categorie précis
async function getcategorie(idcategorie){
    //Récupérer UN categorie en fonction de son id
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    let response = await fetch(urlcategorie+"/"+idcategorie, requestOptions);
    let result = await response.json();
    return result;
}