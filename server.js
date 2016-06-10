var express = require("express");
var app = express();
var bodyParser = require('body-parser');

var path = require("path");

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname + '/store'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(process.env.PORT || 3000, function() {
  console.log("Great! Nodejs is running at port 3000.");
});
