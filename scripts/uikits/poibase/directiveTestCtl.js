angular.module('testApp', ['fastmap.uikit', 'ngTable']).controller('DirectiveTestCtl', function($scope, $http, $timeout) {
    $scope.tagList = [{
        "id": 1,
        text: 'test1'
    }, {
        "id": 2,
        text: 'test2'
    }, {
        "id": 3,
        text: 'test3'
    }];
    $scope.imageArray = [{
        id: 1,
        tag: 3,
        tagName: function() {
            return '水牌';
        },
        url: '../../images/temp/01.jpg'
    }];
    /*$timeout(function (){ //此种方法会导致watch方法执行两次
        $scope.imageArray = [{
            id: 1,
            tag: 3,
            tagName: '水牌',
            url: '../../images/temp/01.jpg'
        }];
    },2000);*/
    $scope.selectImg = function(index, item) {
        console.log("select" + item);
    };
    $scope.clickImg = function(index, item) {
        console.log("click " + item);
    };
    $scope.beforeDeleteImg = function(item) {
        console.log('before delete ' + item);
    };
    $scope.afterDeleteImg = function(item) {
        console.log('after delete ' + item);
    };
    $scope.addImg = function() {
        $scope.imageArray.push({
            id: $scope.imageArray.length + 1,
            tag: 3,
            tagName: function() {
                return '水牌';
            },
            url: '../../images/temp/0' + ($scope.imageArray.length + 1) + ".jpg"
        });
    };
    $scope.test = function() {
        console.log($scope.selectedTag);
    };
    $scope.tableData = [{
        test1: 'abc',
        test2: '123',
        test3: 'ddsfdsfsf'
    }, {
        test1: 'abc',
        test2: '123',
        test3: 'ddsfdsfsf'
    }];
}).controller("ngTableDemoCtl", ["NgTableParams", "", function() {
    var self = this;
}]);