// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = (app, db) => {
  
  app.get("/api/scrape2", (req, res) => {
    // First, we grab the body of the html with axios
    // https://sdtimes.com/category/latest-news/page/2/
    // https://sdtimes.com/category/latest-news/
    // "http://www.echojs.com/"
    axios.get("http://www.echojs.com/")
      .then(response => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);
    
        // Now, we grab every h2 within an article tag, and do the following:
        // $("article h2").each(function(i, element) {
        $("article h2").each(function() {
          // Save an empty result object
          const result = {};
    
          // Add the text and href of every link, and save them as properties of the result object
          result.title = $(this)
            .children("a")
            .text();
          result.link = $(this)
            .children("a")
            .attr("href");
    
          // Custom Implementation of Find or Create
          // This will prevent to duplicate Articles
          db.Article.findOne({title:result.title})
            .then(article => {
              // console.log(article);
              if(!article){
                // console.log(result.title, "Not Found");
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                  .then(dbArticle => {
                    // View the added result in the console
                    // eslint-disable-next-line no-console
                    // console.log(dbArticle);
                    dbArticle;
                  })
                  .catch(function(err) {
                    // If an error occurred, log it
                    // eslint-disable-next-line no-console
                    console.log(err);
                  });
              }
            })
            .catch(error => res.json({"error": error}));
        });
    
        // Send a message to the client
        // res.send("Scrape Complete");
        res.json({"msg": "Scrape Complete"});
      })
      .catch(axiosError => {
        res.json({"error": axiosError.message});
      });
  });

  app.get("/api/scrape", (req, res) => {
    // First, we grab the body of the html with axios
    // https://sdtimes.com/category/latest-news/page/2/
    // https://sdtimes.com/category/latest-news/
    // "http://www.echojs.com/"
    axios.get("https://sdtimes.com/category/latest-news/")
      .then(response => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);
    
        // Now, we grab every h2 within an article tag, and do the following:
        // $("article h2").each(function(i, element) {
        $(".latestnewslist").each(function() {
          // Save an empty result object
          const result = {};
    
          // Add the text and href of every link, and save them as properties of the result object
          result.image = $(this).children(".thm").children("a").children("img").attr("src");
          result.title = $(this).children(".btmborder").children("h4").children("a").text();
          result.link = $(this).children(".btmborder").children("h4").children("a").attr("href");
          result.brief = $(this).children(".btmborder").children("p").text().replace("… continue reading", "...");
    
          // console.log("img src:", $(this).children(".thm").children("a").children("img").attr("src"));
          // console.log("title:", $(this).children(".btmborder").children("h4").children("a").text());
          // console.log("link:", $(this).children(".btmborder").children("h4").children("a").attr("href"));
          // console.log("brief:", $(this).children(".btmborder").children("p").text().replace("… continue reading", "..."));
          // console.log("");
          
          // Custom Implementation of Find or Create
          // This will prevent to duplicate Articles
          db.Article.findOne({title:result.title})
            .then(article => {
              // console.log(article);
              if(!article){
                // console.log(result.title, "Not Found");
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                  .then(dbArticle => {
                    // View the added result in the console
                    // eslint-disable-next-line no-console
                    // console.log(dbArticle);
                    dbArticle;
                  })
                  .catch(function(err) {
                    // If an error occurred, log it
                    // eslint-disable-next-line no-console
                    console.log(err);
                  });
              }
            })
            .catch(error => res.json({"error": error}));
        });
    
        // Send a message to the client
        // res.send("Scrape Complete");
        res.json({"msg": "Scrape Complete"});
      })
      .catch(axiosError => {
        res.json({"error": axiosError.message});
      });
  });
  
  // Route for getting all Scraped Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({saved:false})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // *************************************************************************
  
  // Route to Get All Articles
  app.get("/api/articles/:option", function(req, res) {
    const urlOption = req.params.option;
    const queryOptions = ["all", "scraped", "saved"];
    const removeOptions = ["remove-scraped", "remove-all"];
    let query;

    switch(urlOption){
    case "all":
      query = {};
      break;
    case "scraped":
      query = {saved:false};
      break;
    case "saved":
      query = {saved:true};
      break;
    case "remove-scraped":
      query = {saved:false};;
      break;
    case "remove-all":
      query = {};
      break;
    }

    if (queryOptions.includes(urlOption)) {
      db.Article.find(query)
        .populate("notes")
        .then(dbArticle => res.json(dbArticle))
        .catch(err =>res.json(err));
    } 
    else if (removeOptions.includes(urlOption)) {
      db.Article.remove(query)
        .then(result => res.json(result))
        .catch(err =>res.json(err));
    } else {
      res.json({msg: "GET /api/articles/:option NO OPTION MATCHING"});
    }
  });

  // Route for saving Scraped Article to Saved Articles
  app.post("/api/save_article/:id", function(req, res) {
    db.Article.findByIdAndUpdate(req.params.id, {saved:true}, { new: true })
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route to Delete Article
  app.post("/api/delete_article/:id", function(req, res) {
    db.Article.findByIdAndRemove(req.params.id)
      .then(dbArticle => res.json(dbArticle))
      .catch(err => res.json(err));
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/api/article/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("notes")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Add Note
  // Route for saving/updating an Article's associated Note
  app.post("/article-add-note/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Remove Note
  // https://mongoosejs.com/docs/api.html#mongoosearray_MongooseArray-pull
  // Route for saving/updating an Article's associated Note
  app.post("/article-remove-note/", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Article.findOneAndUpdate({ _id: req.body.articleId }, { $pull: { notes: req.body.noteId } }, { new: true })
      .then(dbArticle => {
        db.Note.findByIdAndRemove(req.body.noteId)
          .then(dbNote => {
            dbNote;
          })
          .catch(err => res.json(err));
        res.json(dbArticle);
      })
      .catch(err => res.json(err));
  });

};
