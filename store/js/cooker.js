(function() {
  'use strict';
  angular.module("fish", ['ngFileUpload'])
    .controller("fisherman", function($scope, $http, Upload) {
      var self = this,
        socket = io();

      // socket connection
      // socket.on('stock', function(stock) {
      //   console.log(stock);
      // });

      $scope.init = function() {
        // Draw graphs
          google.load("visualization", "1", {
            packages: ["corechart"]
          });
          google.setOnLoadCallback(drawChart);

          function drawChart() {

            var optionsDonut = {
              pieHole: 0.4,
              legend: 'none',
              pieSliceText: 'none',
              width: 220,
              height: 220,
              slices: {
                0: {
                  color: '#4daf7b'
                },
                1: {
                  color: '#e6623d'
                },
                2: {
                  color: '#ebc85e'
                },
                3: {
                  color: '#f4ede7'
                }
              },
              chartArea: {
                left: "10px",
                top: "10px",
                width: "92%",
                height: "92%"
              }
            };
            var chartDonut = new google.visualization.PieChart(document.getElementById('donutchart'));
            var optionsBar = {
              width: 220,
              height: 220,
              legend: 'none',
              colors: ['#4daf7b'],
              chartArea: {
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
              },
              hAxis: {
                textPosition: "none",
                gridlines: {
                  color: "#fff"
                },
                baselineColor: "#4daf7b"
              },
              vAxis: {
                textPosition: "none",
                gridlines: {
                  color: "#fff"
                },
                baselineColor: "#4daf7b"
              }
            };

            var chartBar = new google.visualization.ColumnChart(document.getElementById('columnchart'));
            // Update charts Data
            $scope.updateUploadCharts = function updateUploadCharts(donut, bar) {
              // Donut chart
              var donutData = google.visualization.arrayToDataTable(donut);
              chartDonut.draw(donutData, optionsDonut);

              // Bar chart
              var barData = google.visualization.arrayToDataTable(bar);
              chartBar.draw(barData, optionsBar);
            } // updateUploadCharts

            // init graphs
            $http.get('/file')
              .success(function(response) {
                // $scope.responseText = 'Your message is sent successfully!';
                var totalSize = 0;
                _.each(response.donut, function(item) {
                  if(_.isNumber(item[1])) totalSize += item[1];
                });
                // set file percentages
                  self.videoSize = Math.floor(response
                  .donut[_.findIndex(response.donut, function(item) { return item[0] === 'Video' })][1] / totalSize * 100);
                  self.audioSize = Math.floor(response
                  .donut[_.findIndex(response.donut, function(item) { return item[0] === 'Audio' })][1] / totalSize * 100);
                  self.photoSize = Math.floor(response
                  .donut[_.findIndex(response.donut, function(item) { return item[0] === 'Image' })][1] / totalSize * 100);

                  // set file counts

                  self.videoCount = response
                  .bar[_.findIndex(response.bar, function(item) { return item[0] === 'Video' })][1];
                  self.audioCount = response
                  .bar[_.findIndex(response.bar, function(item) { return item[0] === 'Audio' })][1];
                  self.photoCount = response
                  .bar[_.findIndex(response.bar, function(item) { return item[0] === 'Image' })][1];

                $scope.updateUploadCharts(response.donut, response.bar);
              })
              .error(function(response) {
                // $scope.responseText = 'I am sorry. Something went wrong.'
              });
          } // drawChart

      } // init

      self.onFileChange = function() {
        if ($scope.form.media.$valid && $scope.media) {
          $scope.uploadFile($scope.media);
        } else {
          console.log('errroe');
        }
      }

      $scope.uploadFile = function(file) {
        Upload.upload({
            url: 'file',
            data: {file: file}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
      }
    });
})();
