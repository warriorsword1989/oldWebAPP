angular.module('testApp', ['fastmap.uikit']).controller('DirectiveTestCtl', function ($scope, $http) {
    $scope.imageArray = [{
        id: 1,
        tag: 3,
        tagName: '水牌',
        url: '../../images/temp/01.jpg'
    }];
    $scope.selectImg = function (index, item) {
        console.log("select" + item);
    };
    $scope.clickImg = function (index, item) {
        console.log("click " + item);
    };
    $scope.beforeDeleteImg = function (item) {
        console.log('before delete ' + item);
    };
    $scope.afterDeleteImg = function (item) {
        console.log('after delete ' + item);
    };
    $scope.addImg = function () {
        $scope.imageArray.push({
            id: $scope.imageArray.length + 1,
            tag: 3,
            tagName: '水牌',
            url: '../../images/temp/0' + ($scope.imageArray.length + 1) + ".jpg"
        });
    };
});