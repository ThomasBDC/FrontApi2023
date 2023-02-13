//Code qui s'exécute en ouvrant la page
const urlApi = "https://localhost:7027/api";
const ctrlReplay = "Replays";
const urlReplay = urlApi + "/" + ctrlReplay;
getAllReplays();


//Valider le formulaire de création
document.querySelectorAll(".valid-form-create").forEach(element => {
    element.addEventListener("click", (e) =>{
        let cible = e.currentTarget.dataset.cible;
        let form = document.querySelector(cible);
        let data = new FormData(form);
        let value = Object.fromEntries(data.entries());
        let valueJSON = JSON.stringify(value);

        createReplay(valueJSON, form);
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
        EditReplay(value.id, valueJSON);

    });
});

//Méthodes
//Récupérer et afficher tous les replaus
function getAllReplays(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    toggleLoader();
    fetch(urlReplay, requestOptions)
    .then(response => response.json())
    .then(result => {
        let myDiv = document.getElementById("allReplays");
        myDiv.innerHTML = "";
        result.forEach(element => {
            let replayHtml = `
                                <div class="linkReplay">
                                    <div class="link-header">
                                        <h2>${element.title}</h2>
                                        <div>
                                            <button class="edit-replay" data-id="${element.id}">Modifier</button>
                                            <button class="delete-replay" data-id="${element.id}">Supprimer</button>
                                        </div>
                                    </div>
                                    <div class="linkReplayContent">
                                        <p>${element.description}</p>
                                        <p>${element.dateSortie}</p>
                                        <a target="_blank" href="${element.url}">${element.url}</a>
                                    </div>
                                </div>
                            `;
            myDiv.innerHTML += replayHtml;
        });
        document.querySelectorAll(".delete-replay").forEach(buttonDelete => {
            buttonDelete.addEventListener("click", (e)=> {
                if(confirm("Voulez-vous supprimer cet élément ?")){
                    let id = buttonDelete.dataset.id;
                    DeleteReplay(id);
                }
            });
        });
        document.querySelectorAll(".edit-replay").forEach(buttonEdit => {
            buttonEdit.addEventListener("click", (e) =>{
                let id = buttonEdit.dataset.id;

                //Récupérer les informations du replay via son id
                getReplay(id).then(replay =>{
                    console.log(replay);
                    //Ouvrir une modal de modification
                    let modalEdit = document.getElementById("modal-edit-replay");
                    modalEdit.classList.remove("hide");

                    //Remplir cette modal avec les informations du replay
                    let formEdit = modalEdit.querySelector("#edit-replay-form");
                    formEdit.elements['id'].value = replay.id;
                    formEdit.elements['title'].value = replay.title;
                    formEdit.elements['description'].value = replay.description;
                    formEdit.elements['dateSortie'].value = new Date(replay.dateSortie).toISOString().split('T')[0];
                    formEdit.elements['url'].value = replay.url;

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

//Appel AJAX pour créer un replay
function createReplay(dataJSON, form){
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
        fetch(urlReplay, requestOptions)
            .then(response => response.text())
            .then(result => 
                {
                    toggleLoader();
                    getAllReplays();
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

//Appel AJAX pour modifier un replay
function EditReplay(idReplay, dataJSON){
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: dataJSON,
        redirect: 'follow'
    };
    toggleLoader();
    fetch(urlReplay+"/"+idReplay, requestOptions)
        .then(response => response.text())
        .then(result => 
            {
                //Je ferme le loader
                toggleLoader();
                //Je refresh la liste des replays
                getAllReplays();
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

//Appel AJAX pour supprimer un replay
function DeleteReplay(idReplay){
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
    toggleLoader();
    fetch(urlReplay+"/"+idReplay, requestOptions)
    .then(response => response.text())
    .then(result => {
        toggleLoader();
        getAllReplays();//Cette méthode refresh la liste de replay
    })
    .catch(error => {
        toggleLoader();
        alert("Une erreur est survenue");
        console.log('error', error)
    });
}

//Appel AJAX pour récupérer un replay précis
async function getReplay(idReplay){
    //Récupérer UN replay en fonction de son id
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    let response = await fetch(urlReplay+"/"+idReplay, requestOptions);
    let result = await response.json();
    return result;
}