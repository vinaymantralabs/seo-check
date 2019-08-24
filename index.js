const express = require('express');
const app = express();
const port = 3000;
let bodyParser = require('body-parser');
const appScript = require('./app');
let moment = require('moment');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs');
app.use(express.static('theme'));

app.get('/', function (req, res) {
    res.render('index')
});

app.post('/start', async function (req, res) {
    let url = req.body.url;
    let promise = new Promise(function (resolve, reject) {
        let seo = appScript.check(url, resolve);
    });

    promise.then(function(value) {
        console.log(value);
        res.render('start', {value : value, url : url, moment: moment});
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))