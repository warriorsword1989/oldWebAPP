/**
 * Created by zhaohang on 2016/11/2.
 */
angular.module('webeditor').controller('poiHeaderCtrl', ["$scope", "ngDialog",
  function ($scope, ngDialog) {
    $scope.showPoiList = function() {
      ngDialog.open({
        template: 'editor/templates/poiListTemp.html',
        controller: 'poiListCtrl',
        className: 'ngdialog-theme-default',
        width: '100%',
        height: '100%'
      });
    };
  }
]);