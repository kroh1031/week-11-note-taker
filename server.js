const express = require("express");
const app = express();

const fs = require("fs");
const path = require("path");

const uuid = require("uuid");

// This allows you to get the port from the bound environment variable (using process.env.PORT) if it exists, so that when your app starts on heroku's machine it will start listening on the appropriate port.
const PORT = process.env.PORT || 3000;

// Body Parser Middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Routes static files aka the frontend code to the backend
app.use(express.static("./public"));

app.get("/api/notes", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  return res.json(notes);
});

// Create Note
app.post("/api/notes", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  const newNote = {
    // method that generates a random id
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text,
  };

  if (!newNote.title || !newNote.text) {
    return res.status(400).json({
      msg: `Please include a title and text`,
    });
  }
  // append newNote to all notes
  notes.push(newNote);
  // write the newly updated notes to db.json
  fs.writeFileSync("./db/db.json", JSON.stringify(notes), (err) =>
    err ? console.log(err) : console.log("Successfully deleted note!")
  );
  return res.json(newNote);
});

// Delete Note
app.delete("/api/notes/:id", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  //The some() array method runs the condition and if it exists, it will equal true, and if not, it will equal false.
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
    res.status(400).json({
      msg: `Note with the id of ${req.params.id} cannot be found`,
    });
  }
});

app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// Catch all for all routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
