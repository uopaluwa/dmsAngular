"use strict";
angular.module("dmsApp", ['ui.router','ngMaterial','ngMdIcons'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('homepage', {
        url: '/home',
        templateUrl: 'app/views/login.html',
        controller: 'homeCtrl'
      })
      .state('userhome', {
        url: '/userhome',
        templateUrl: 'app/views/userhome.html',
        controller: 'userCtrl'
      });
    //go to landing if it is an invalid url
    $urlRouterProvider.otherwise('/home');
  });

angular.module('dmsApp')
  .config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
  .primaryPalette('blue')
  .accentPalette('light-blue')
  .warnPalette('red');
});
