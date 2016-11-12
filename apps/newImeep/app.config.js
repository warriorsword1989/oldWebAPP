/**
 * Created by zhongxiaoming on 2016/10/26.
 */
'use strict';

angular.module('webeditor',['ngRoute','fastmap.uikit', 'ngCookies', 'dataService', 'ui.layout','highcharts-ng','ui.bootstrap','ngDialog','ngAnimate','mgcrea.ngStrap','angular-drag']).config(['$locationProvider' ,'$routeProvider',
  function config($locationProvider, $routeProvider) {
    //$locationProvider.hashPrefix('!');
    console.log('---------------------------');
    $routeProvider.
    when('/login', {
      templateUrl: 'newlogin.html',
      controller: 'loginCtrl'
    })
      .
    when('/tasks', {
      templateUrl: './task/taskMainMap.html',
      controller: 'taskMainMapCtrl'
    })
      .
      when('/editor', {
        templateUrl: './editor/mapEditor.html',
        controller: 'editorCtrl'
      })
      .
    otherwise('/login');
  }
]);

