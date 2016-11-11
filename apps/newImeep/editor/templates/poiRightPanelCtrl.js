/**
 * Created by zhaohang on 2016/11/10.
 */
angular.module('webeditor').controller('poiRightPanelCtrl', ["$scope",
  function ($scope) {
    var height = document.documentElement.clientHeight;
    $scope.rightPanelHeight = {
      'height' : (height - 80) + 'px',
      'overflow': 'auto',
      'width': '100%'
    };
    $scope.basicOpenFlag = true;
    $scope.depthOpenFlag = true;
    $scope.fatherAndSonOpenFlag = true;
    $scope.sameOpenFlag = true;
    $scope.basicOpen = function () {
      $scope.basicOpenFlag = !$scope.basicOpenFlag;
    };
    $scope.depthOpen = function () {
      $scope.depthOpenFlag = !$scope.depthOpenFlag;
    };
    $scope.fatherAndSonOpen = function () {
      $scope.fatherAndSonOpenFlag = !$scope.fatherAndSonOpenFlag;
    };
    $scope.sameOpen = function () {
      $scope.sameOpenFlag = !$scope.sameOpenFlag;
    };
  }
]);