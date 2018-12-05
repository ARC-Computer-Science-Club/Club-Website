// changes working directory of the process to the directory this file is in
process.chdir(__dirname);

//-------------------------------------------------------------------------------

const express      = require('express');
const compression  = require('compression');
const fs           = require('fs');
const path         = require('path');
const url          = require('url');
const ejs          = require('ejs');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const session      = require('./src/server/js/controller/sessions.js');

const app = express();
const port = process.env.PORT || 8080;

//-------------------------------------------------------------------------------

// assign the ejs engine
app.engine('ejs', (filePath, options, callback) => {
    fs.readFile(filePath, 'utf-8', (err, content) => {
        if (err) return callback(err);
        var rendered = ejs.render(content, options);
        return callback(null, rendered);
    });
});

// set the views directory
app.set('views', process.cwd() + '/build/server/ejs/complete');


//-------------------------------------------------------------------------------

// logging
app.use((req, res, next) => {
    // Only logs request once it has been complete
    var
    client_ip    = req.connection.remoteAddress,
    time_started = new Date().toISOString(),
    method       = req.method,
    endpoint     = req.url,
    user_agent   = req.headers['user-agent'];

    res.on('finish', () => {
        console.log("%s | %s -> %s | %s | %s | %s, %s | %s",
                    client_ip,
                    time_started,
                    new Date().toISOString(),
                    method,
                    endpoint,
                    res.statusCode,
                    res.statusMessage,
                    user_agent);
    });
    next();
});

//-------------------------------------------------------------------------------

// Use compression
app.use(compression());

// remove default header
app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
});

//-------------------------------------------------------------------------------

// Default file
app.get('/', (req, res, next) => {
    // cache on client
    res.set('Cache-Control', `max-age=${60 * 60}`); //1 hour

    res.sendFile('/build/html/complete/home.html', {root: __dirname});
});

// Don't serve the default file above from the static middleware
app.get('/static/html/home.html', (req, res, next) => {
    res.sendStatus(404);
});

// Serves local static assets such as html, css, images, and js files
const static_content = require('./build/server/js/view/static.js');
app.use('/static', static_content);

//-------------------------------------------------------------------------------

// For login and signup logic
const auth = require('./build/server/js/view/auth.js');
app.use('/auth', auth);


// Force user to be logged in
app.use(cookieParser(), (req, res, next) => {
    if ('session' in req.cookies)
    {
        session.verify(req.cookies['session'])
            .then(payload => {
                next();
            })
            .catch(err => {
                // not authorized
                console.error(err);
                res.sendStatus(403);
            });
    }
    else
    {
        // TODO not authorized
        next();
        //res.sendStatus(403);
    }
});

// Dynamic html content
app.get('/dynamic/*', (req, res, next) => {
    // sends file to user
    var url = path.normalize(req.params[0]);
    res.render(url, {site_name: 'ARC Computer Science Club'}, (err, rendered) => {
        if (err) res.sendStatus(404);
        else res.status(200).send(rendered);
    });

});

//-------------------------------------------------------------------------------

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(500);
});


// No route found
app.use((req, res) => {
    res.sendStatus(404);
});

//-------------------------------------------------------------------------------

// keep at the bottom
app.listen(port, () => console.log(`Listening on port ${port}!`));
