var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
fetch("https://localhost:7027/api/Replays", requestOptions)
.then(response => response.json())
.then(result => {
    let myDiv = document.getElementById("allReplays");
    myDiv.innerHTML = "";
    result.forEach(element => {
        let replayHtml = `
                            <div class="linkReplay">
                                <h2>${element.title}</h2>
                                <div class="linkReplayContent">
                                    <p>${element.description}</p>
                                    <p>${element.dateSortie}</p>
                                    <a target="_blank" href="${element.url}">${element.url}</a>
                                </div>
                            </div>
                        `;
        myDiv.innerHTML += replayHtml;
    });
})
.catch(error => console.log('error', error));