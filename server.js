var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  path = require('path'),
  fs = require('fs'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  _ = require('lodash'),
  async = require('async'),
  readChunk = require('read-chunk'),
  fileType = require('file-type'),
  storage = multer.diskStorage({
    destination: 'store/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
  }),
  upload = multer({
    storage: storage
  });

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(express.static(__dirname + '/store'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var server = app.listen(process.env.PORT || 3000, function() {
  console.log("Great! Widgets are ready.");
});

//  socket io
var io = require('socket.io')(server);
io.on('connection', function(socket) {
  var stockArray = [
    ['number', 'X'], [0, 0],   [1, 10],  [2, 23],  [3, 17],  [4, 18],  [5, 9],
    [6, 11],  [7, 27],  [8, 33],  [9, 40],  [10, 32], [11, 35],
    [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
    [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
    [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
    [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
    [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
    [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
    [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
    [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
    [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
    [66, 70], [67, 72], [68, 75], [69, 80]
  ];
  var stockInterval = setInterval(function() {
    var stock = Math.floor(Math.random() * 80) + 1;
    stockArray.splice(1, 1); // remove first element
    stockArray = _.map(stockArray, function(item) {
      if(_.isNumber(item[0])) {
        item[0] -= 1;
      }
      return item;
    });
    console.log(stockArray);
    stockArray.push([69, stock]);
    socket.emit('stock', stockArray);
  }, 1000);

  // remove interval when disconnect
  socket.on('disconnect', function() {
    if (!stockInterval) {
      clearInterval(stockInterval);
      stockInterval = null;
    }
  }); // socket.on(disconnect)
});

/*
* read dir and get sizes and counts of files
*/
function getFileStatus(callback) {
  var types = {
    Image: { size: 0, count: 0 },
    Audio: { size: 0, count: 0 },
    Video: { size: 0, count: 0 },
    Other: { size: 0, count: 0 }
  };
  var dirPath = 'store/uploads';
  fs.readdir(dirPath, function(err, files) {
    if(err) callback(err);
    if(!files) callback('Something went wrong');
    async.eachSeries(files, function(file, next) {
      //  get sizes
      var stats = fs.statSync(path.join(dirPath, file));
      //Convert the file size to megabytes
      var fileSizeInMegaBytes = stats["size"] / 1000000.0;

      // get counts of files
      var buffer = readChunk.sync(path.join(dirPath, file), 0, 262); // name position length
      var mimeType = fileType(buffer);
      if (!mimeType) {  types.Other.count += 1; types.Other.size += fileSizeInMegaBytes; }
      else if (mimeType.mime.indexOf('image/') > -1) { types.Image.count += 1; types.Image.size += fileSizeInMegaBytes; }
      else if (mimeType.mime.indexOf('audio/') > -1) { types.Audio.count += 1; types.Audio.size += fileSizeInMegaBytes; }
      else if (mimeType.mime.indexOf('video/') > -1) { types.Video.count += 1; types.Video.size += fileSizeInMegaBytes; }
      else { types.Other.count += 1; types.Other.size += fileSizeInMegaBytes; }
      next(null);
    }, function(err) {
      if (err) return callback(err);
      var donut = [['Media', 'MB']],
        bar = [['Media', 'Count']];

      _.each(_.keys(types), function(key) {
        donut.push([key, types[key].size]);
        bar.push([key, types[key].count]);
      });
      callback(null, donut, bar);
    });
  })
}

// Post and get routes
  app.route('/file')
  .post(upload.single('file'), function(req, res) {
    getFileStatus(function(err, donut, bar) {
      if(err) return res.status(400).send(err);
      res.send({ bar: bar, donut: donut });
    });
  });

  app.route('/file')
  .get(function(req, res) {
    getFileStatus(function(err, donut, bar) {
      if(err) return res.status(400).send(err);
      res.send({ bar: bar, donut: donut });
    });
  });
