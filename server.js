const express = require("express");

const app = express();
const PORT = process.env.PORT || 3300;

app.listen(PORT, () => {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
    PORT,
    PORT
  );
});