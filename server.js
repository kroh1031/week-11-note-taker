const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const uuid = require("uuid");
let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

// This allows you to get the port from the bound environment variable (using process.env.PORT) if it exists, so that when your app starts on heroku's machine it will start listening on the appropriate port.
const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes our static files aka our frontend code to our backend
app.use(express.static("./public"));

app.get("/api/notes", (req, res) => {
  res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  //The some() array method runs the condition and if it exists, it will equal true, and if not, it will equal false.
  const found = notes.some((note) => note.id === parseInt(req.params.id));

  //Need to parseInt req.params.id because it needs to match the data type of note.id, which is a number
  if (found) {
    res.json(notes.filter((note) => note.id === parseInt(req.params.id)));
  } else {
    res
      .status(400)
      .json({ msg: `No note with the id of ${req.params.id} can be found` });
  }
});

// Create Note
app.post("/api/notes", (req, res) => {
  // add an id attribute to newNote with a random id
  const newNote = {
    // method that generates a random id
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };

  if (!newNote.title || !newNote.text) {
    return res.status(400).json({ msg: `Please include a title and text` });
  }
  // append newNote to all notes
  notes.push(newNote);

  //write the newly updated all notes to db.json
  return res.json(notes);
});

// Delete Note
app.delete("/api/notes/:id", (req, res) => {
  //The some() array method runs the condition and if it exists, it will equal true, and if not, it will equal false.
  console.log(req.params.id);
  const found = notes.some((note) => note.id === req.params.id);

  if (found) {
    const excludeDeletedNote = notes.filter(
      (note) => note.id !== req.params.id
    );
    fs.writeFileSync(
      "./db/db.json",
      JSON.stringify(excludeDeletedNote),
      (err) =>
        err ? console.log(err) : console.log("Successfully deleted note!")
    );
    res.json({
      msg: `Note deleted`,
      notes: excludeDeletedNote,
    });
  } else {
    res
      .status(400)
      .json({ msg: `Note with the id of ${req.params.id} cannot be found` });
  }
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

//this is a catch all for all routes
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
