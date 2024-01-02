const express = require('express');
const app = express();
const port = 3000;

const knex = require('knex')({
    client: 'pg',
    connection: {        
        host : '127.0.0.1',
        user : 'your_database_user',
        password : 'your_database_password',
        database : 'your_database_name'
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
    knex.select('*').from('your_table_name')
        .then(data => res.send(data))
        .catch(err => res.status(500).send('An error occurred'));

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});