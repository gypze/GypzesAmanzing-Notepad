const express = require('express'); // Imports express
const path = require('path'); // Imports path
const fs = require('fs'); // Imports fs
const { v4: uuidv4 } = require('uuid'); // Imports uuid

const app = express(); // Creates an express app
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes' });
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to save note' });
      }
      res.json(newNote);
    });
  });
});

// DELETE Route
// app.delete('/api/notes/:id', (req, res) => {
//   const noteId = req.params.id;

//   fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Failed to read notes' });
//     }

//     let notes = JSON.parse(data);
//     notes = notes.filter(note => note.id !== noteId);

//     fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes, null, 2), (err) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).json({ error: 'Failed to delete note' });
//       }
//       res.json({ message: 'Note deleted successfully' });
//     });
//   });
// });


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});