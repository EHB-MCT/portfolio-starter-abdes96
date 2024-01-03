// routes/artworks.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Artworks endpoint');
});


module.exports = router;
