
const drawAndShowModal = (title, message) => {
  // Draw the response Message in the Modal
  $("#messageModal .modal-title").text(title);
  $("#messageModal .modal-body > p").text(message);
  // Show the Modal
  $("#messageModal").modal("show");
};

// Clear modal dismiss 
$('#messageModal').on('hidden.bs.modal', function (e) {
  $("#messageModal .modal-body > p").text("");
  $("#messageModal .modal-title").text("");
})

// Scrap Button Handler
const scrapButtonHandler = (e) => {
  e.preventDefault();
  // Execute Scraping Routine via Ajax
  $.ajax(
    {
      url: "/scrape",
      method: "GET"
    }
  )
    .then(response => {
      const message = response.msg ? response.msg : response.error;
      const title = response.msg ? "Scraping Succeded" : "An Error Occurred in the API endpoint";
      const myTimeOut = response.msg ? 3000 : 5000;
      drawAndShowModal(title, message);
      setTimeout(() => location.reload(), myTimeOut);
    })
    .catch(error => {
      // console.log(error);
      drawAndShowModal("An Error Happen", "Status Code: " + JSON.stringify(error.status));
    });  
};

// Event Delegation
// https://davidwalsh.name/event-delegate
// $(document).on("click", "#scrapingBtn", scrapButtonHandler); //jQuery
document.getElementById("mainNavbar").addEventListener("click", e => {
  if(e.target && e.target.id==="scrapingBtn"){
    // console.log(e.target);
    scrapButtonHandler(e);
  }
});

// displayArticle Handler
const displayArticle = (e) => {
  e.preventDefault();
}

// deleteArticle Handler
const deleteArticle = (e) => {
  e.preventDefault();
}

// prepareNoteForm Handler
const prepareNoteForm = (e) => {
  e.preventDefault();
}

// addNote Handler
const addNote = (e) => {
  e.preventDefault();
}

// deleteNote Handler
const deleteNote = (e) => {
  e.preventDefault();
}

document.getElementById("articleList").addEventListener("click", e => {
  if(e.target && e.target.classList.contains("articleDiv")){
    // console.log(e.target);
    console.log(e.target.id);
    // scrapButtonHandler(e);
  }
});