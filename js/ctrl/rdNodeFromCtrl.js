/**
 * Created by liuzhaoxia on 2015/12/10.
 */
//var otherApp=angular.module("lazymodule", []);
var otherApp=angular.module("rdNodeFromApp", []);
otherApp.controller("rdNodeFromController",function($scope){

    $scope.newFromOfWRoadDate=[];
    $scope.kindOptions=[
        {"id":0,"label":"平面交叉点"},
        {"id":1,"label":"Link属性变化点"},
        {"id":2,"label":"路上点"}
    ];


    $scope.srcFlagOptions=[
        {"id": 1, "label": "1 施工图"},
        {"id": 2, "label": "2 高精度测量"},
        {"id": 3, "label": "3 卫星影像"},
        {"id": 4, "label": "4 惯导测量"},
        {"id": 5, "label": "5 基础数据"},
        {"id": 6, "label": "6 GPS测量"}
    ];

    $scope.digitalLeveOptions=[
        {"id":0,"label":"无"},
        {"id": 1, "label": "1 ±0~5米"},
        {"id": 2, "label": "2 ±5~10米"},
        {"id": 3, "label": "3 ±10~15米"},
        {"id": 4, "label": "4 ±15~20米"}
    ];

    $scope.auxiFlagOptions=[
        {"id":0,"label":"无"},
        {"id":42,"label":"点假立交"},
        {"id":43,"label":"路口挂接修改"}
    ];


    $scope.fromOfWayOption=[
    {"id":0,"label":"未调查"},
    {"id":1,"label":"无属性"},
    {"id":2,"label":"图廓点"},
    {"id":3,"label":"CRF Info点"},
    {"id":4,"label":"收费站"},
    {"id":5,"label":"Hihgway起点"},
    {"id":6,"label":"Highway终点"},
    {"id":10,"label":"IC"},
    {"id":11,"label":"JCT"},
    {"id":12,"label":"桥"},
    {"id":13,"label":"隧道"},
    {"id":14,"label":"车站"},
    {"id":15,"label":"障碍物"},
    {"id":16,"label":"门牌号码点"},
    {"id":20,"label":"幅宽变化点"},
    {"id":21,"label":"种别变化点"},
    {"id":22,"label":"车道变化点"},
    {"id":23,"label":"分隔带变化点"},
    {"id":30,"label":"铁道道口"},
    {"id":31,"label":"有人看守铁道道口"},
    {"id":32,"label":"无人看守铁道道口"},
    {"id":41,"label":"KDZone与道路交点"}
    ];

    $scope.saveroadtype=function(){
        $scope.rdNodeData.forms.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            linkPid:$scope.roadlinkData.pid
        })

        $scope.newFromOfWRoadDate.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            name: $("#roadtypename").find("option:selected").text()
        });
        $('#myModal').modal('hide');
    }

    $scope.deleteroadtype=function(){
        $scope.newFromOfWRoadDate.splice(type, 1);
        $scope.roadlinkData.forms.splice(type, 1);
    }
})