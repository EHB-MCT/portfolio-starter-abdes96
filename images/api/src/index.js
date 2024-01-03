const express = require('express');
const cors = require('cors'); // Import the cors middleware
const usersRouter = require('./routes/users.js');
const artworksRouter = require('./routes/artworks.js');

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

const app = express();
const port = 3000;

app.use(cors()); 
app.use(express.json()); 

app.use((req, res, next) => {
    req.db = knex;
    next();
});

app.use('/users', usersRouter);
app.use('/artworks', artworksRouter);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
