/**
 * Created by liwanchong on 2015/10/24.
 */
var objectEditApp = angular.module("lazymodule", []);
objectEditApp.controller("normalController", function ($scope) {
    var objectEditCtrl = new fastmap.uikit.ObjectEditController();
    objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data));
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $("#rdSubRestrictflagbtn"+$scope.rdRestrictData.flag).removeClass("btn btn-default").addClass("btn btn-primary");
    $scope.showTips = function (item) {
        $scope.rdSubRestrictData = item;
        var outLinkPid = item.outLinkPid;
        var tiles = rdLink.tiles;
        for (var obj in tiles) {
            var data = tiles[obj].data.features;
            for (var key in data) {
                if (data[key].properties.id === objectEditCtrl.data.inLinkPid || data[key].properties.id === outLinkPid) {
                    var ctx = {
                        canvas: tiles[obj].options.context,
                        tile: L.point(key.split(',')[0], key.split(',')[1]),
                        zoom: map.getZoom()
                    }
                    rdLink._drawLineString(ctx, data[key].geometry.coordinates, true, {
                        size: 3,
                        color: '#FFFF00'
                    }, {
                        color: '#FFFF00',
                        radius: 3
                    });


                }
            }
        }
    };
    //初始化交限
    $scope.addLimitedData = [
        {"id": 1},
        {"id": 2},
        {"id": 3},
        {"id": 4},
        {"id": 5},
        {"id": 6},
        {"id": 7},
        {"id": 11},
        {"id": 22},
        {"id": 33},
        {"id": 44},
        {"id": 55},
        {"id": 66},
        {"id": 77}

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
    if (objectEditCtrl.data === null) {
        $scope.rdSubRestrictData = [];
    } else {
        $scope.rdSubRestrictData = objectEditCtrl.data.details[0];
    }

    $scope.$parent.$parent.updateLinkData = function (data) {
        $scope.rdSubRestrictData = data.details[0];
    };

    //选择弹出框中的交限
    $scope.selectTip = function (item) {
        $scope.tipsId = item.id;
        var obj = {};
        obj.restricInfo = item.id;
        obj.outLinkPid = ""; //$scope.rdLink.outPid;
        obj.pid = "";//featCodeCtrl.newObj.pid;
        obj.relationshipType = 1;
        obj.flag = 1;
        obj.restricPid = ""// featCodeCtrl.newObj.pid;
        obj.type = 1;
        obj.conditons = [];
        $scope.newLimited = obj;

    };
    //双击
    $scope.test = function (item) {
        $("#myModal").modal("show");
        $scope.modifyItem = item;
    };
    //添加交限
    $scope.addTips = function () {


        if ($scope.modifyItem !== undefined) {
            var arr = $scope.$parent.$parent.rdRestrictData.details
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].pid === $scope.modifyItem.pid) {
                    $scope.$parent.$parent.rdRestrictData.details[i].restricInfo = $scope.tipsId;
                    $scope.modifyItem = undefined;
                    break;
                }
            }
        } else {
            if ($scope.tipsId === null || $scope.tipsId === undefined) {
                alert("请先选择tips");
                return;
            }
            $scope.rdRestrictData.details.push($scope.newLimited);
        }
    }
    //增加时间段
    $scope.addTime = function () {
        $scope.rdRestrictData.time.unshift({startTime: "", endTime: ""});
    }
    //删除时间段
    $scope.minusTime = function (id) {
        $scope.rdRestrictData.time.splice(id, 1);
    };
    $scope.$parent.$parent.save = function () {
        objectEditCtrl.setCurrentObject($scope.$parent.$parent.rdRestrictData);
        objectEditCtrl.save();
        var param = {
            "command": "updaterestriction",
            "projectId": 1,
            "data": objectEditCtrl.changedProperty
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var outputcontroller = fastmap.uikit.OutPutController({});
            outputcontroller.pushOutput(data.data);
        });
        if ($scope.$parent.$parent.rdRestrictData.rowkeyOfDataTips !== undefined) {
            var stageParam = {
                "rowkey": $scope.$parent.$parent.rdRestrictData.rowkeyOfDataTips,
                "stage": 3,
                "handler": 0

            }
            Application.functions.changeDataTipsState(JSON.stringify(stageParam), function (data) {
                var outputcontroller = fastmap.uikit.OutPutController({});
                outputcontroller.pushOutput(data.data);
                $scope.$parent.$parent.rdRestrictData.rowkeyOfDataTips = undefined;
            })
        }
    };
    $scope.$parent.$parent.delete = function () {
        var pid = parseInt($scope.$parent.$parent.rdRestrictData.pid);
        var param = {
            "command": "updaterestriction",
            "projectId": 1,
            "data": {
                "pid": pid,
                "objStatus": "DELETE"
            }
        }

        //结束编辑状态
        console.log("I am removing obj" + pid);
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var outputcontroller = new fastmap.uikit.OutPutController({});
            var restrict = layerCtrl.getLayerById("referencePoint");
            restrict.redraw();
            outputcontroller.pushOutput(data.data);
            console.log("交限 " + pid + " has been removed");
        })
        $scope.$parent.$parent.rdRestrictData = null;
    }

    $scope.checkrdSubRestrictflag=function(flag){
        $("#rdSubRestrictflagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#rdSubRestrictflagbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdRestrictData.flag=flag;
    }
});
