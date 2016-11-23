/**
 * Created by zhaohang on 2016/11/22.
 */
angular.module('webeditor').controller('userToolCtrl', ['$scope',
  function ($scope) {
    $scope.showInspectTool = function () {
      $scope.$emit("openInspect");
    };
  }
]);
