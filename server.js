const express = require("express");
const fs = require("fs");
const PORT = process.env.PORT || 3000;
const app = express();

//routes our static files aka our frontend code to our backend
//if we didn't do this, none of our code within the public folder would've worked
//meaning the css file, the js files
app.use(express.static("./public"));

app.get("/notes", (req, res) => {
  res.sendFile(`${__dirname}/public/notes.html`);
});

app.get("*", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
