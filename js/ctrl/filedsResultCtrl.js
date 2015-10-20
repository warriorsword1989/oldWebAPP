/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('lazymodule', []);
filedsModule.controller('fieldsResultController', function ($scope) {
    $scope.showLayers = function (item) {
        item.choose = !item.choose;
        console.log($scope.items);
    };
    $scope.showContent = function (id) {
        $scope.subItems=[
            {name: "china", id: "121"},
            {name: "USA", id: "122"},
            {name: "Russa", id: "123"}

        ]
//             for(var obj in subItems){
//                  if(obj.id===id.id) {
//                      $scope.subItems = obj.content;
//                  }
//            }
    };
    $scope.showTab=function(item) {
        alert(item.name);
    };
})