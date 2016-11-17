// var express = require('express')
//   , app = express()
//   , server = require('http').createServer(app)
//   , path = require('path')
//   , io = require('socket.io').listen(server)

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    // $ionicSideMenuDelegate.toggleLeft();

  };

  // $scope.closeSignup = function() {
  //   $scope.modal.hide();
  // };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // $scope.signup = function() {
  //   $scope.modal.show();
  // };

  $scope.doSignup = function() {
    console.log('Doing signup', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $state.go('home')
    }, 1000);
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $state.go('home')
    }, 1000);
  };
})

.controller('vidSearch', ['$scope', '$http', 'socket', function($scope, $http, socket) {
  $scope.search = {};
  // var host = document.location.origin;
  // var socket = io.connect(host);
  // console.log(socket);
  //   console.log(io());
  // $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
  // $scope.socket = socket.on('connect', function (data){
  //   socket.emit('remote');
  //
  // })

  $scope.search.getVideos = function(query) {
    $http.get("https://www.googleapis.com/youtube/v3/search?order=viewcount&part=snippet&q=" + query + "&type=video+&videoDefinition=high&key=" + "AIzaSyDOB7yYD2E_NK1P0HnPrgCN_hKmP-DYSIo" + "&maxResults=25").then(function(results) {
      console.log(results.data.items);
      var results = results.data.items;
      $scope.search.results = results;
      // console.log(socket.emit('video'));
    })
  }

  $scope.search.watch = function(videoId) {
    console.log('booyah');
    console.log(videoId);

    var socket = io('http://localhost');
    socket.on('connect', function(videoId) {

      socket.emit('video', {
        action: 'play',
        video_id: videoId
      })
    })
    console.log(videoId);

  }

}])

.controller('PlaylistCtrl', function($scope, $stateParams) {})
  .controller('About', function($scope, $stateParams) {});
