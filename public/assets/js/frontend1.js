const homeUrl = "/scraped-articles";
const defaultTimeOut = 2000;
const getDOMArticle = (e) => {
  const articleContainer = e.target.parentElement.parentElement;
  const articleLink = articleContainer.children[0];
  const id = articleContainer.id;
  const title = articleLink.innerText;
  const link = articleLink.href;

  return {
    id,
    title,
    link
  };
};

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
      url: "/api/scrape",
      method: "GET"
    }
  )
    .then(response => {
      const message = response.msg ? response.msg : response.error;
      const title = response.msg ? "Scraping Succeded" : "An Error Occurred in the API endpoint";
      const myTimeOut = response.msg ? 2000 : 5000;
      drawAndShowModal(title, message);
      setTimeout(() => window.location.replace(homeUrl), myTimeOut);
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
};

// saveArticle Handler
const saveArticle = (e) => {
  e.preventDefault();

  const {id, title, link} = getDOMArticle(e);
  // console.log(getDOMArticle(e));
  
  // Ajax call to the API - Save Article to Saved Articles Collection
  $.ajax(
    {
      url: `/api/save_article/${id}`,
      method: "POST",
      data: {id:id}
    }
  )
    .then(response => {
      // console.log(response);
      drawAndShowModal("Article Saved", title);
      setTimeout(() => location.reload(), defaultTimeOut);
    })
    .catch(error => {
      // console.log(error);
      drawAndShowModal("An Error Happen", "Status Code: " + JSON.stringify(error.status));
    });  

};

// deleteArticle Handler
const deleteArticleFromSaved = (e) => {
  e.preventDefault();
  const {id, title, link} = getDOMArticle(e);
  // console.log(getDOMArticle(e));
  
  // Ajax call to the API - Delete Article
  $.ajax(
    {
      url: `/api/delete_article/${id}`,
      method: "POST",
      data: {id:id}
    }
  )
    .then(response => {
      // console.log(response);
      drawAndShowModal("Article Saved", title);
      setTimeout(() => location.reload(), defaultTimeOut);
    })
    .catch(error => {
      // console.log(error);
      drawAndShowModal("An Error Happen", "Status Code: " + JSON.stringify(error.status));
    });  

};

// viewNotes Handler
const viewNotes = (e) => {
  e.preventDefault();
  $("#notesModal").modal("show");
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
  if(e.target && e.target.classList.contains("article-div")){
    // console.log(e.target);
    // console.log(e.target.id);
    // scrapButtonHandler(e);
  }
  else if(e.target && e.target.classList.contains("save-article")){
    saveArticle(e);
  }
  else if(e.target && e.target.classList.contains("delete-article")){
    deleteArticleFromSaved(e);
  }
  else if(e.target && e.target.classList.contains("view-notes")){
    viewNotes(e);
  }
});