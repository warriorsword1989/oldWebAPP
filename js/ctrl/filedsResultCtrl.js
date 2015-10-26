/**
 * Created by liwanchong on 2015/9/25.
 */
var filedsModule = angular.module('mapApp', ['oc.lazyLoad']);
filedsModule.controller('fieldsResultController',['$rootScope','$scope', '$ocLazyLoad',function ($rootScope,$scope,$ocLazyLoad) {
        $scope.items = items;
        var selectCtrl;
        if(!selectCtrl) {
            selectCtrl = new fastmap.uikit.SelectController();
        }
        //切换处理 待处理 已处理 页面
        $scope.changeList=function(stage) {
            //图幅号如何获得
            alert(stage);
        };
       //点击下拉框的时  显示内容
        $scope.showContent = function (id,stage) {
            //如何根据类型获取下拉列表中的数据
            $scope.subItems=[
                {name: "china", id: "121"},
                {name: "USA", id: "122"},
                {name: "Russa", id: "123"}

            ]
        };
        //点击列表需要的方法
        $scope.showTab=function(item) {

            $("#popoverTips").css("display", "block");
            $ocLazyLoad.load('ctrl/dataTipsCtrl').then(function () {
                    $scope.$parent.$parent.dataTipsURL = "js/tepl/sceneTipsTepl.html";
                    $ocLazyLoad.load("ctrl/objectEditCtrl").then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/trafficLimitOfNormalTepl.html";
                    });
                }
            );
            selectCtrl.fire("selectByAttribute", {feather: item});
            L.marker([39.907333,  116.391083]).addTo(map);
            map.panTo({});
        };
        //checkbox中的处理方法
        $scope.showLayers = function (item) {
            item.choose = !item.choose;
            console.log($scope.items);
        };
    }]
    )