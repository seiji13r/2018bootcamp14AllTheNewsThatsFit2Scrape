const homeUrl = "/";
const defaultTimeOut = 2000;
// This Function Take the information From the Article in the DOM
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

const drawAndShowNotesModal = (title, message, article) => {
  // Draw the response Message in the Modal
  $("#notesModal .modal-title").text(article.title);
  $("#notesModal .modal-body > p").text(article.brief);
  // Draw the article Notes
  article.notes.forEach( note => {
    // console.log(note.body);
    const noteDiv = $("<div>")
      .addClass("note-div d-flex justify-content-between my-2")
      .attr("data-articleid", article._id)
      .attr("id",`div-note-${note._id}`);
    const delNoteBtn = $("<button>")
      .addClass("btn btn-sm btn-danger delete-note")
      .html("&times;")
      .attr("data-articleid", article._id)
      .attr("id",`btn-del-note-${note._id}`);
    noteDiv.text(note.body);
    noteDiv.append(delNoteBtn);
    $("#notesModal .modal-body .notes").append(noteDiv);
  });

  // Add Submit Button
  const submitNoteBtn = $("<button>")
    .addClass("btn btn-primary btn-add-note")
    .attr("data-articleid", article._id)
    .text("Submit");
  $("#notesModal .modal-footer").append(submitNoteBtn);

  // Show the Modal
  $("#notesModal").modal("show");
};

// Clear modal dismiss 
$('#messageModal').on('hidden.bs.modal', function (e) {
  $("#messageModal .modal-body > p").text("");
  $("#messageModal .modal-title").text("");
  location.reload();
});

// Clear modal dismiss 
$('#notesModal').on('hidden.bs.modal', function (e) {
  $("#notesModal .modal-body > p").text("");
  $("#notesModal .modal-body .notes").empty();
  $("#notesModal .modal-title").text("");
  $("#notesModal .modal-footer").empty();
  $("#noteInput").val("");
  location.reload();
});

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
  // Get the Information of the Article
  const {id, title, link} = getDOMArticle(e);
  // console.log(`/api/article/${id}`);
  // Get the Notes From the Article
  $.ajax(
    {
      url: `/api/article/${id}`,
      method: "GET"
    }
  )
    .then(response => {
      drawAndShowNotesModal(id, title, response);
    })
    .catch(error => {
      // console.log(error);
      drawAndShowModal("An Error Happen", "Status Code: " + JSON.stringify(error.status));
    });  
};

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

// addNote Handler
const addNote = (e) => {
  e.preventDefault();
  const articleId = e.target.dataset.articleid;
  const noteInput = document.getElementById("noteInput");
  const title = "";
  const body = noteInput.value

  $.ajax({
    url: `/article-add-note/${articleId}`,
    method: "POST",
    data: {
      title,
      body
    }
  })
    .then(response => {
      // console.log("Response:", response)
      const lastNote = response.notes.reverse()[0];
      const noteDiv = $("<div>")
        .addClass("note-div d-flex justify-content-between my-2")
        .attr("data-articleid", articleId)
        .attr("id",`div-note-${lastNote}`);
      const delNoteBtn = $("<button>")
        .addClass("btn btn-sm btn-danger delete-note")
        .html("&times;")
        .attr("data-articleid", articleId)
        .attr("id",`btn-del-note-${lastNote}`);
      noteDiv.text(body);
      noteDiv.append(delNoteBtn);
      $("#notesModal .modal-body .notes").append(noteDiv);
      $("#noteInput").val("");
    })
    .catch(error => console.log("Error:", error));
};

// deleteNote Handler
const deleteNote = (e) => {
  e.preventDefault();
  // IDs are generated in drawAndShowNotesModal() in this File.
  const btnId = e.target.id;
  const articleId = e.target.dataset.articleid;
  const noteId = btnId.replace("btn-del-note-", "");
  const noteDiv = document.getElementById(`div-note-${noteId}`);
  // Remove the Note From the Modal
  noteDiv.remove();
  // Remove the Note From the Database by Calling the API.
  $.ajax({
    url: "/article-remove-note",
    method: "POST",
    data: {
      articleId,
      noteId
    }
  })
    .then(result => /*console.log(result)*/ result)
    .catch(err => console.log(err));
};

document.getElementById("notesModal").addEventListener("click", e => {
  if(e.target && e.target.classList.contains("delete-note")){
    deleteNote(e);
  }
  else if(e.target && e.target.classList.contains("btn-add-note")){
    addNote(e);
  }
});