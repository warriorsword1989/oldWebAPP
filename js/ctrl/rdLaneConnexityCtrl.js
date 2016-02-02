/**
 * Created by liuzhaoxia on 2015/12/23.
 */
var otherApp = angular.module("lazymodule", []);
otherApp.controller("rdLaneConnexityController", function ($scope) {

    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.showNormalData = [];
    $scope.showTransitData = [];
    $scope.outLanesArr = [];
    //附加车道图标获得
    $scope.getAdditionalLane = function (index, data) {
        var obj = {}, arr;
        if (data.length === 1) {
            $scope.showNormalData.push(data);
            $scope.showTransitData.push("test");
        } else {
            arr = data.split("[");
            //把第一个放进去
            $scope.showNormalData.push(arr[0]);
            $scope.showTransitData.push("test");
            //第二个
            if (index === 0) {
                $scope.showNormalData.unshift([arr[1].substr(0, 1)]);
                $scope.showTransitData.unshift("test");
            } else {
                $scope.showNormalData.push([arr[1].substr(0, 1)]);
                $scope.showTransitData.push("test");
            }

        }
    };
    //公交车道图标获得
    $scope.getTransitData = function (data) {
        var obj = {}, arr;
        if (data.length === 1) {
            $scope.showNormalData.push(data);
            $scope.showTransitData.push("test");
        } else {
            arr = data.split("<");
            //把第一个放进去
            $scope.showNormalData.push(arr[0]);
            //第二个
            $scope.showTransitData.push(arr[1].substr(0, 1).toString()+arr[1].substr(0, 1).toString());
        }
    }
    $scope.decimalToArr = function (data) {
        var arr = [];
        arr = data.toString(2).split("");
        return arr;
    };
    $scope.initializeData = function () {
        var reg = new RegExp("/\<|\>|\&/g");
        $scope.lanesData = objCtrl.data;
        $scope.lanesArr = $scope.lanesData["laneInfo"].split(",");
        var lanesLen = $scope.lanesArr.length;
        for(var j= 0,lenJ=$scope.lanesArr.length;j<lenJ;j++) {
            if(j===0||j===lenJ-1) {
                if(reg.test($scope.lanesArr[j])) {
                    $scope.getTransitData($scope.lanesArr[j]);
                }else{
                    $scope.getAdditionalLane(j,$scope.lanesArr[j]);
                }
            }else {
                $scope.getTransitData($scope.lanesArr[j]);
            }

        }
        for (var i = 0, len = $scope.lanesData["topos"].length; i < len; i++) {
            var arrOfDecimal = $scope.decimalToArr($scope.lanesData["topos"][i]["inLaneInfo"]);
            if (arrOfDecimal[lanesLen - 1] === "1") {
                $scope.outLanesArr.push($scope.lanesData[i]);
            }

        }
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    setTimeout(function () {
        for (var sitem in $scope.lanesData.topos) {
            var flag = $scope.lanesData.topos[sitem].relationshipType;
            $("#relationshipType" + flag + "_" + sitem).removeClass("btn btn-default").addClass("btn btn-primary");
        }
    }, 10)
    $scope.addRdLancdData = [
        {"id": 1, "class": false},
        {"id": 2, "class": false},
        {"id": 3, "class": false},
        {"id": 4, "class": false},
        {"id": 5, "class": false},
        {"id": 11, "class": false},
        {"id": 12, "class": false},
        {"id": 13, "class": false},
        {"id": 14, "class": false},
        {"id": 15, "class": false},
        {"id": 21, "class": false},
        {"id": 22, "class": false},
        {"id": 23, "class": false},
        {"id": 24, "class": false},
        {"id": 25, "class": false},
        {"id": 31, "class": false},
        {"id": 32, "class": false},
        {"id": 33, "class": false},
        {"id": 34, "class": false},
        {"id": 35, "class": false},
        {"id": 41, "class": false},
        {"id": 42, "class": false},
        {"id": 43, "class": false},
        {"id": 44, "class": false},
        {"id": 45, "class": false},
        {"id": 51, "class": false},
        {"id": 52, "class": false},
        {"id": 53, "class": false},
        {"id": 54, "class": false},
        {"id": 55, "class": false},
        {"id": 61, "class": false},
        {"id": 62, "class": false},
        {"id": 63, "class": false},
        {"id": 64, "class": false},
        {"id": 65, "class": false},
        {"id": 71, "class": false},
        {"id": 72, "class": false},
        {"id": 73, "class": false},
        {"id": 74, "class": false},
        {"id": 75, "class": false},
        {"id": 81, "class": false},
        {"id": 82, "class": false},
        {"id": 83, "class": false},
        {"id": 84, "class": false},
        {"id": 85, "class": false},
        {"id": 91, "class": false},
        {"id": 92, "class": false},
        {"id": 93, "class": false},
        {"id": 94, "class": false},
        {"id": 95, "class": false},
        {"id": "a1", "class": false},
        {"id": "a2", "class": false},
        {"id": "a3", "class": false},
        {"id": "a4", "class": false},
        {"id": "a5", "class": false}
    ];
    $scope.ptOriginArray = [
        {"index": 0, "id": 3},
        {"index": 1, "id": 4},
        {"index": 2, "id": 5},
        {"index": 3, "id": 11},
        {"index": 4, "id": "a5"}
    ];
    $scope.gjOriginArray = [
        {"index": 0, "id": 0},
        {"index": 1, "id": 0},
        {"index": 2, "id": 0},
        {"index": 3, "id": 0},
        {"index": 4, "id": "a5"}
    ];
    for (var i in $scope.addRdLancdData) {
        for (var j in $scope.originArray) {
            if ($scope.addRdLancdData[i].id == $scope.originArray[j].id) {
                $scope.addRdLancdData[i].class = true;
            }
        }
    }
    $scope.changeColor = function (item, ind) {
        var istrue = true;
        for (var i in $scope.addRdLancdData) {
            if ($scope.addRdLancdData[i].id == item.id && $scope.addRdLancdData[i].class == true) {
                $scope.addRdLancdData[i].class = false;
                istrue = false;
            }
        }
        if (istrue) {
            $scope.tipsId = item.id;
            var obj = {};
            obj.restricInfo = item.id;
            obj.outLinkPid = 0; //$scope.rdLink.outPid;
            obj.pid = 0;//featCodeCtrl.newObj.pid;
            obj.relationshipType = 1;
            obj.flag = 1;
            obj.restricPid = 0// featCodeCtrl.newObj.pid;
            obj.type = 1;
            obj.conditons = [];
            $scope.newLimited = obj;
            $scope.selectedRow = ind;
        }
    }

    $scope.addTips = function () {
        for (var i in $scope.addRdLancdData) {
            if ($scope.addRdLancdData[i].id == $scope.tipsId) {
                $scope.addRdLancdData[i].class = true;
            }
        }
    }
    //REACH_DIR
    $scope.reachDirOptions = [
        {"id": 0, "label": "0 未调查"},
        {"id": 1, "label": "1 直"},
        {"id": 2, "label": "2 左"},
        {"id": 3, "label": "3 右"},
        {"id": 4, "label": "4 调"},
        {"id": 5, "label": "5 左斜前"},
        {"id": 6, "label": "6 右斜前"}
    ];
});

