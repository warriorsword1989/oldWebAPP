/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var sceneselectApp=angular.module('lazymodule', []);
sceneselectApp.controller("sceneSpeedLimitController",function ($scope) {

    $scope.speedLimitData= $scope.$parent.$parent.speedLimitDatas.deep;
    $scope.speedLimitGeometryData= $scope.$parent.$parent.speedLimitGeometryDatas.geometry.g_guide;
    $scope.speedDirectTypeOptions=[
        {"id":0,"label":"0  未调查"},
        {"id": 2, "label": "2 顺方向"},
        {"id": 3, "label": "3 逆方向"}
    ];
    for(var i in $scope.speedDirectTypeOptions){
        if($scope.speedDirectTypeOptions[i].id==$scope.speedLimitData.rdDir){
            $scope.rdDir=$scope.speedDirectTypeOptions[i].label;
        }
    }


    $scope.limitSrcOption=[
        {"id": 0, "label":"0  无"},
        {"id": 1, "label": "1 现场标牌"},
        {"id": 2, "label": "2 城区标识"},
        {"id": 3, "label": "3 高速标识"},
        {"id": 4, "label": "4 车道限速"},
        {"id": 5, "label": "5 方向限速"},
        {"id": 6, "label": "6 机动车限速"},
        {"id": 7, "label": "7 匝道未调查"},
        {"id": 8, "label": "8 缓速行驶"},
        {"id": 9, "label": "9 未调查"}
    ];


    for(var i in $scope.limitSrcOption){
        if($scope.limitSrcOption[i].id==$scope.speedLimitData.src){
            $scope.limitSrc=$scope.limitSrcOption[i].label;
        }
    }

});
