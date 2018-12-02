const express = require('express');

const router = express.Router();


// css
router.use('/css', express.static('build/css/complete'));

// html
router.use('/html', express.static('build/html/complete'));

// js
router.use('/js', express.static('build/js/complete'));

// static
router.use('/downloads', express.static('build/static'));


// Error handler
router.use((err, req, res, next) => {
    res.sendStatus(404);
});

// keep at bottom of file
module.exports = router;
