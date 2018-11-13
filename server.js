const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;


// helper function
var static_middleware = (path_to_static_files) => {
    return express.static(path.join(__dirname, path_to_static_files));
};


app.use((req, res, next) => {
    console.log("%s | %s | %s | %s | %s", req.connection.remoteAddress, new Date().toString(), req.method, req.url, req.headers['user-agent']);
	next();
});


app.get('/', (req, res) => {
	res.redirect('/html/home_page.ejs.html');
});


// static assets
app.use('/', static_middleware('build'));



app.listen(port, () => console.log(`Listening on port ${port}!`));
