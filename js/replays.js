getAllReplays();


function getAllReplays(){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    toggleLoader();
    fetch("https://localhost:7027/api/Replays", requestOptions)
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




document.querySelectorAll(".background-modal").forEach(element => {
    element.addEventListener("click", (e) =>{
        e.currentTarget.classList.toggle("hide");
    })
});

document.querySelectorAll(".modal").forEach(element => {
    element.addEventListener("click", (e) =>{
        e.stopPropagation();
    })
});

document.querySelectorAll(".open-modal").forEach(element => {
    element.addEventListener("click", (e) =>{
        let cible = e.currentTarget.dataset.cible;
        document.querySelector(cible).classList.toggle("hide");
    })
});

document.querySelectorAll(".valid-form").forEach(element => {
    element.addEventListener("click", (e) =>{
        let cible = e.currentTarget.dataset.cible;
        let form = document.querySelector(cible);
        let data = new FormData(form);
        let value = Object.fromEntries(data.entries());
        let valueJSON = JSON.stringify(value);
        console.log(JSON.stringify(value));

        //faire le fetch pour envoyer le POST
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: valueJSON,
            redirect: 'follow'
        };
        toggleLoader();
        fetch("https://localhost:7027/api/Replays", requestOptions)
            .then(response => response.text())
            .then(result => 
                {
                    toggleLoader();
                    getAllReplays();
                    document.querySelector(".background-modal").classList.toggle("hide");
                    form.reset();
                })
            .catch(error => {
                toggleLoader();
                console.log('error', error);
                alert("Création impossible");
            });
        })
});


function DeleteReplay(idReplay){
    const requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
    toggleLoader();
    fetch("https://localhost:7027/api/Replays/"+idReplay, requestOptions)
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

async function getReplay(idReplay){
    //Récupérer UN replay en fonction de son id
    const requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
    let response = await fetch("https://localhost:7027/api/Replays/"+idReplay, requestOptions);
    let result = await response.json();
    return result;
}