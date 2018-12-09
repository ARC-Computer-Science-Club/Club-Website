const ejs = require('ejs');
const path = require('path');

const args = process.argv.slice(2);
const rendered = ejs.renderFile(args[0], {}, {root: path.join(__dirname, "..", "src/html/")}, (err, str) => {
    if (err){
        console.error(err);
        process.exit(1);
    } else console.log(str);
});
