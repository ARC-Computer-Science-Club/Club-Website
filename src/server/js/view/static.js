const express = require('express');

const router = express.Router();


// cache static resources on the client
router.use((req, res, next) => {
    res.set('Cache-Control', `max-age=${60 * 60}`); //1 hour
    next();
});

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
