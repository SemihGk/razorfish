(function() {
  'use strict';
  angular.module("fish", ['ngFileUpload', '720kb.socialshare', 'ngNotificationsBar', 'ngMaterial'])
    .controller("fisherman", function($scope, $http, $timeout, Upload, notifications) {
      var self = this,
        socket = io();
      self.stockCls = true;
      $scope.currentTime = moment().format('ddd, hh:mm A');
      self.showBuffer = false;
      self.progressFirst = 20;
      self.progressSecond = 40;
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

            var optionsStock = {
              width: "100%",
              height: 72,
              legend: 'none',
              colors: ['#fff'],
              backgroundColor: '#4daf7b',
              chartArea: {
                left: 0,
                top: 0,
                width: "100%",
                height: "100%"
              },
              hAxis: {
                textPosition: "none",
                gridlines: {
                  color: "#4daf7b"
                },
                baselineColor: "#4daf7b"
              },
              vAxis: {
                textPosition: "none",
                gridlines: {
                  color: "#4daf7b"
                },
                baselineColor: "#4daf7b"
              }
            };
            var chartStock = new google.visualization.LineChart(document.getElementById('stockchart'));

            var optionsApl = {
              width: "100%",
              height: 40,
              legend: 'none',
              colors: ['#fff'],
              backgroundColor: '#fff',
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
                baselineColor: "#fff"
              },
              vAxis: {
                textPosition: "none",
                gridlines: {
                  color: "#fff"
                },
                baselineColor: "#fff"
              }
            };

            var chartApl = new google.visualization.ColumnChart(document.getElementById('stockapl'));
            // Update charts Data

            // socket connection
            var stockData, aplData;
            socket.on('stock', function(stock, apl) {
              var prevItemNumber = stock[stock.length - 2][1];
              var lastItemNumber = stock[stock.length - 1][1];
              var stockCls = (lastItemNumber - prevItemNumber) > 0 ? true : false;
              /*no idea but ng-class and scope change do not implement to ui*/
              $(".widget-title").removeClass('greenstock');
              $(".widget-title").removeClass('redstock');
              $(".widget-title").addClass(stockCls ? 'greenstock' : 'redstock');
              stockData = google.visualization.arrayToDataTable(stock);
              optionsStock.backgroundColor = stockCls ? '#4daf7b' : '#FF2115';
              optionsStock.hAxis.baselineColor = stockCls ? '#4daf7b' : '#FF2115';
              optionsStock.hAxis.gridlines.color = stockCls ? '#4daf7b' : '#FF2115';
              optionsStock.vAxis.baselineColor = stockCls ? '#4daf7b' : '#FF2115';
              optionsStock.vAxis.gridlines.color = stockCls ? '#4daf7b' : '#FF2115';
              chartStock.draw(stockData, optionsStock);
              $scope.currentTime = moment().format('ddd, hh:mm A');

              // chartApl
              aplData = google.visualization.arrayToDataTable(apl);
              chartApl.draw(aplData, optionsApl);
              $('.trade-bottom-content').css('background-color', stockCls ? '#4daf7b' : '#FF2115');
              $('.trade-bottom-content span').text((stockCls ? '+' : '-') + apl[apl.length - 1][1]);
              $('.trade-rate-change').text((stockCls ? '+' : '-') + apl[apl.length - 2][1] + '(' + apl[apl.length - 3][1] + ')');;
            });

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
                self.updateRequest(response);
              })
              .error(function(response) {
                // $scope.responseText = 'I am sorry. Something went wrong.'
              });
          } // drawChart

        } // init

      self.updateRequest = function(response) {
        var totalSize = 0;
        _.each(response.donut, function(item) {
          if (_.isNumber(item[1])) totalSize += item[1];
        });
        // set file percentages
        if (totalSize <= 0) {
          self.videoSize = 0;
          self.audioSize = 0;
          self.photoSize = 0;
        } else {
          self.videoSize = Math.floor(response
            .donut[_.findIndex(response.donut, function(item) {
              return item[0] === 'Video'
            })][1] / totalSize * 100);
          self.audioSize = Math.floor(response
            .donut[_.findIndex(response.donut, function(item) {
              return item[0] === 'Audio'
            })][1] / totalSize * 100);
          self.photoSize = Math.floor(response
            .donut[_.findIndex(response.donut, function(item) {
              return item[0] === 'Image'
            })][1] / totalSize * 100);
        }

        // set file counts
        self.videoCount = response
          .bar[_.findIndex(response.bar, function(item) {
            return item[0] === 'Video'
          })][1];
        self.audioCount = response
          .bar[_.findIndex(response.bar, function(item) {
            return item[0] === 'Audio'
          })][1];
        self.photoCount = response
          .bar[_.findIndex(response.bar, function(item) {
            return item[0] === 'Image'
          })][1];

        $scope.updateUploadCharts(response.donut, response.bar);
      }

      self.onFileChange = function() {
        if ($scope.form.media.$valid && $scope.media) {
          self.showBuffer = true;
          $scope.uploadFile($scope.media);
        } else {
          notifications.showError({
            message: 'Oops! Invalid file extension',
            hideDelay: 1500, //ms
            hide: true //bool
          });
        }
      }

      $scope.uploadFile = function(file) {
        Upload.upload({
          url: 'file',
          data: {
            file: file
          }
        }).then(function(resp) {
          self.updateRequest(resp.data);
          notifications.showSuccess({
            message: 'File is uploaded!',
            hideDelay: 2000, //ms
            hide: true //bool
          });
          // after progress finished hide
          $timeout(function () {
            self.showBuffer = false;
          }, 700);
        }, function(resp) {
          notifications.showError({
            message: 'Oops! Something went wrong!',
            hideDelay: 1500, //ms
            hide: true //bool
          });
        }, function (evt) {
            self.progressFirst = parseInt(100.0 * evt.loaded / evt.total);
            self.progressSecond = self.progressFirst + 20;
        });;
      }
    });
})();
