const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const uuid = require("uuid");

// This allows you to get the port from the bound environment variable (using process.env.PORT) if it exists, so that when your app starts on heroku's machine it will start listening on the appropriate port.
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes our static files aka our frontend code to our backend
//if we didn't do this, none of our code within the public folder would've worked
//meaning the css file, the js files
app.use(express.static("./public"));

app.get("/api/notes", (req, res) => {
  console.log("Workss");
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

  return res.json(notes);
});

// app.post("/api/notes", (req, res) => {
//   const newNote = req.body;

//   // add an id attribute to newNote with a random id
//   // get all notes from db.json and parse it into javascript

//   //append newnote to all notes
//   //write the newly updated all notes to db.json
//   return res.json(newNote);
// });

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

// The application should have a db.json file on the back end that will be used to store and retrieve notes using the fs module.
// The following HTML routes should be created:

// GET /notes should return the notes.html file. DONE

// GET * should return the index.html file. DONE

// The following API routes should be created:

// GET /api/notes should read the db.json file and return all saved notes as JSON. DONE

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
