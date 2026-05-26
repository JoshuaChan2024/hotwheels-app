const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for Hot Wheels Collection
let collection = [];
let nextId = 1;

// View all items
app.get('/', (req, res) => {
    res.render('index', { collection });
});

// Page to add a new item
app.get('/add', (req, res) => {
    res.render('add');
});

// Action to add a new item
app.post('/add', (req, res) => {
    const { name, description } = req.body;
    if (name) {
        collection.push({ id: nextId++, name, description });
    }
    res.redirect('/');
});

// Page to edit an item
app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = collection.find(i => i.id === id);
    if (item) {
        res.render('edit', { item });
    } else {
        res.status(404).send('Item not found');
    }
});

// Action to update an item
app.post('/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const item = collection.find(i => i.id === id);
    if (item) {
        item.name = name;
        item.description = description;
    }
    res.redirect('/');
});

// Action to delete an item
app.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    collection = collection.filter(i => i.id !== id);
    res.redirect('/');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Hot Wheels Collection app is running at http://localhost:${PORT}`);
});
