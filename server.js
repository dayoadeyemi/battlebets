// DEPENDENCIES
// ============
var express = require('express');
var path = require('path');
var port = (process.env.PORT || 1251);
var app = express();

console.log("START >>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
console.log(__dirname);

app.use(express.static(path.join(__dirname +'/public/')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});



var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
