
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Retrieve all user names from the database
        const users = await req.db.select('name').from('users');

        // Extract usernames and send them in the response
        const usernames = users.map(user => user.name);
        res.json(usernames);
    } catch (error) {
        console.error('Error retrieving user names:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
