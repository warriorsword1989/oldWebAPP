/**
 * Created by liwanchong on 2015/11/3.
 */
var addLimitedApp = angular.module('lazymodule', []);
addLimitedApp.controller("normalController", function ($scope) {
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var layerCtrl = fastmap.uikit.LayerController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.rdRestrictData = {};
    $scope.rdRestrictData.pid = featCodeCtrl.newObj.enterLine;
    $scope.rdRestrictData.inLinkPid = featCodeCtrl.newObj.enterLine;
    $scope.rdRestrictData.kgFlag = 0;
    $scope.rdRestrictData.nodePid = featCodeCtrl.newObj.enterNode;
    $scope.rdRestrictData.restrictInfo = "1";
    $scope.rdRestrictData.details = [];
    //初始化交限
    $scope.addLimitedData = [
        {"id":1},
        {"id":2},
        {"id":3},
        {"id":4},
        {"id":5},
        {"id":6},
        {"id":7},
        {"id":8},
        {"id":9},
        {"id":11},
        {"id":22},
        {"id":33},
        {"id":44},
        {"id":55},
        {"id":66},
        {"id":77},
        {"id":88},
        {"id":99}

    ];
    $scope.vehicleOptions = [
        {"id": 0, "label": "客车(小汽车)"},
        {"id": 1, "label": "配送卡车"},
        {"id": 2, "label": "运输卡车"},
        {"id": 3, "label": "步行车"},
        {"id": 4, "label": "自行车"},
        {"id": 5, "label": "摩托车"},
        {"id": 6, "label": "机动脚踏两用车"},
        {"id": 7, "label": "急救车"},
        {"id": 8, "label": "出租车"},
        {"id": 9, "label": "公交车"},
        {"id": 10, "label": "工程车"},
        {"id": 11, "label": "本地车辆"},
        {"id": 12, "label": "自用车辆"},
        {"id": 13, "label": "多人乘坐车辆"},
        {"id": 14, "label": "军车"},
        {"id": 15, "label": "有拖车的车"},
        {"id": 16, "label": "私营公共汽车"},
        {"id": 17, "label": "农用车"},
        {"id": 18, "label": "载有易爆品的车辆"},
        {"id": 19, "label": "载有水污染品的车辆"},
        {"id": 20, "label": "载有其他污染品的车辆"},
        {"id": 21, "label": "电车"},
        {"id": 22, "label": "轻轨"},
        {"id": 23, "label": "校车"},
        {"id": 24, "label": "四轮驱动车"},
        {"id": 25, "label": "装有防雪链的车"},
        {"id": 26, "label": "邮政车"},
        {"id": 27, "label": "槽罐车"},
        {"id": 28, "label": "残疾人车"},
        {"id": 29, "label": "预留"},
        {"id": 30, "label": "预留"},
        {"id": 31, "label": "标志位,禁止/允许(0/1)"}
    ];
    rdLink.on('getId', function (data) {
        if(data.index>=2) {
            $scope.outPid = data.id;
            outPutCtrl.pushOutput({"label":"已经选了出线"})
        }
    })
    $scope.selectTip = function (item) {
        $scope.tipsId = item.id;
        var obj={};
        obj.flag = item.id;
        obj.outLinkPid =$scope.outPid; //$scope.rdLink.outPid;
        obj.pid = "";//featCodeCtrl.newObj.pid;
        obj.relationshipType = 1;
        obj.restricInfo = 1;
        obj.restricPid =""// featCodeCtrl.newObj.pid;
        obj.type = 1;
        obj.conditons = [];
        obj.vehicleExpression = 14;
        $scope.newObj = obj;
    };
    $scope.addTips = function () {
        if ($scope.tipsId === null || $scope.tipsId === undefined) {
            alert("请先选择tips");
            return;
        }

        var tipsObj = $scope.rdRestrictData.details;
        for (var i = 0, len = tipsObj.length; i < len; i++) {
            if (tipsObj[i].flag === $scope.tipsId) {
                alert("重复");
                return;
            }
        }
        $scope.rdSubRestrictData = $scope.newObj;
        $scope.rdRestrictData.details.push($scope.rdSubRestrictData);
        outPutCtrl.pushOutput({"label": "已经选择了交限"});
    };
    $scope.$parent.$parent.save=function() {
        var createRelation = $scope.rdRestrictData;
        var param = {
            "command": "updaterestriction",
            "projectId": 1,
            "data": $scope.rdRestrictData
        }
        Application.functions.save(param, function (data) {
            outPutCtrl.pushOutput(data);
        })
    };
})