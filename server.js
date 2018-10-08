const express = require('express');
const HTTP = require('http');
const URL = require('url').URL;
const PATH = require('path');
const FS = require('fs');

const app = express();
const port = 8080;
const ROOT = PATH.join(process.cwd(), "/build");

app.get('/*', (req, res) => {
    var path = new URL(req.url, "http://localhost").pathname;
    console.log("%s | %s | %s | %s | %s", req.headers.host, new Date().toString(), req.method, path, req.headers['user-agent']);

    var filepath = PATH.join(ROOT, path);

    FS.readFile(filepath, (err, file_data) => {
        if (err) {
            res.set('Content-Type', 'text/plain');
            res.status(404).send(HTTP.STATUS_CODES[404]);
        }
        else {
            var ext = PATH.extname(filepath);
            if (ext == ".html") {
                res.set('Content-Type', 'text/html');
            }
            else if (ext == ".css") {
                res.set('Content-Type', 'text/css');
            }
            else if (ext == ".js") {
                res.set('Content-Type', 'text/js');
            }
            else if (ext == ".png") {
                res.set('Content-Type', 'image/png');
            }
            else if (ext == ".jpg") {
                res.set('Content-Type', 'image/jpg');
            }
            else {
                res.set('Content-Type', 'text/plain');
            }
            res.status(200).send(file_data);
      }
    });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
