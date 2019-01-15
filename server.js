const express = require("express");
const mongoose = require("mongoose");

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3300;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});