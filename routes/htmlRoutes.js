module.exports = (app, db) => {

  app.get(["/", "/scraped-articles"], (req, res) => {
    db.Article.find({saved:false})
      .then((dbArticle) => {
        // eslint-disable-next-line no-console
        // console.log(dbArticle);

        res.render("index", {
          msg: "Welcome!",
          articles: dbArticle
        });

      })
      .catch((err) => {
        // If an error occurred, send it to the client
        // res.json(err);
        res.render("index", {
          msg: err
        });
      });
  });

  app.get("/saved-articles", (req, res) => {
    db.Article.find({saved:true})
      .then((dbArticle) => {
        // eslint-disable-next-line no-console
        // console.log(dbArticle);

        res.render("index", {
          msg: "Welcome!",
          articles: dbArticle
        });

      })
      .catch((err) => {
        // If an error occurred, send it to the client
        // res.json(err);
        res.render("index", {
          msg: err
        });
      });
  });

  app.get("*", (req, res) => {
    res.status(404).render("404");
  });
};