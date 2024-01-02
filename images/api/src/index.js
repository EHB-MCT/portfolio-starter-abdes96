const express = require('express');

require('dotenv').config();

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig.development);

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}` );
    
});
