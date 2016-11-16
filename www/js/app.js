// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  var home = {
    name: 'home',
    url: '/',
    // abstract: true,
    templateUrl: 'templates/home.html',
    controller: 'AppCtrl'
  }

  var signUp = {
    name: 'signup',
    url: '/signup',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html'
      }
    }
  }

  var logIn = {
    name: 'login',
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AppCtrl'
  }

  var signUp = {
    name: 'signup',
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'AppCtrl'
  }

  var about = {
    name: 'home.about',
    url: 'about',
    controller: 'About',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html'
      }
    }
  }

  var landingContent = {
    name: 'home.landing',
    url: 'search',
    controller: 'AppCtrl',
    views: {
      'menuContent': {
        templateUrl: 'templates/content.html'
      }
    }
  }

  var account = {
    name: 'account',
    url: '/users/:userid/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/account.html'
      }
    }
  }


  $stateProvider.state(home)
  $stateProvider.state(about)
  $stateProvider.state(signUp)
  $stateProvider.state(logIn)
  $stateProvider.state(account)
  $stateProvider.state(landingContent)



  $stateProvider

    .state('app', {
    url: '/app',
    // abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback

  // $urlRouterProvider.otherwise('app/browse');
  $urlRouterProvider.otherwise('/about');

});
