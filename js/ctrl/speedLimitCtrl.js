/**
 * Created by liuzhaoxia on 2015/12/11.
 */
//var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
//var selectApp = angular.module("speedLimitApp",[]);
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("speedlimitTeplController", function ($scope, $timeout, $ocLazyLoad) {
    var selectCtrl = new fastmap.uikit.SelectController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var layerCtrl = fastmap.uikit.LayerController();
    var speedLimit = layerCtrl.getLayerById('speedlimit');

    $scope.initializeData = function () {
        $scope.speedLimitData = objectEditCtrl.data;
    }
    if(objectEditCtrl.data){
        $scope.initializeData();
    }
    //调用的方法
    objectEditCtrl.rdSpeedLimitObject=function(){

        $scope.initializeData();
    }
    $scope.speedLimitGeometryData = objectEditCtrl.data.geometry;
    objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data));
    $scope.speedTypeOptions = [
        {"id": 0, "label": "0  普通(General)"},
        {"id": 1, "label": "1 指示牌(Advisory)"},
        {"id": 3, "label": "3 特定条件(Dependent)"},
        {"id": 4, "label": "4 车道限速"}
    ];
    $scope.speedDirectTypeOptions = [
        {"id": 0, "label": "0  未调查"},
        {"id": 2, "label": "2 顺方向"},
        {"id": 3, "label": "3 逆方向"}
    ];
    $scope.speedDependentOption = [
        {"id": 0, "label": "0  无"},
        {"id": 1, "label": "1 雨天(Rain)"},
        {"id": 2, "label": "2 雪天(Snow)"},
        {"id": 3, "label": "3 雾天(Fog)"},
        {"id": 6, "label": "6 学校(School)"},
        {"id": 10, "label": "10 时间限制(Time-Dependent)"},
        {"id": 11, "label": "11 车道限制(Lane-Dependent)"},
        {"id": 12, "label": "12 季节时段(Approximate Seasonal Time)"},
        {"id": 13, "label": "13 医院"},
        {"id": 14, "label": "14 购物"},
        {"id": 15, "label": "15 居民区"},
        {"id": 16, "label": "16 企事业单位"},
        {"id": 17, "label": "17 景点景区"},
        {"id": 18, "label": "18 交通枢纽"}
    ];
    $scope.limitSrcOption = [
        {"id": 0, "label": "0  无"},
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
    $scope.speedLimitValue=$scope.speedLimitData.speedValue/10;
    $timeout(function(){
        $ocLazyLoad.load('ctrl/fmdateTimer').then(function () {
            $scope.dateURL = 'js/tepl/fmdateTimer.html';
            /*查询数据库取出时间字符串*/
            var tmpStr = $scope.speedLimitData.timeDomain;//'[[(h7m40)(h8m0)]+[(h11m30)(h12m0)]+[(h13m40)(h14m0)]+[(h17m40)(h18m0)]+[(h9m45)(h10m5)]+[(h11m45)(h12m5)]+[(h14m45)(h15m5)]+[[(M6d1)(M8d31)]*[(h0m0)(h5m0)]]+[[(M1d1)(M2d28)]*[(h0m0)(h6m0)]]+[[(M12d1)(M12d31)]*[(h0m0)(h6m0)]]+[[(M1d1)(M2d28)]*[(h23m0)(h23m59)]]+[[(M12d1)(M12d31)]*[(h23m0)(h23m59)]]]';
            $scope.fmdateTimer(tmpStr);
        });
    })
    /*时间控件*/
    $scope.fmdateTimer = function (str) {
        $scope.$on('get-date', function (event, data) {
            $scope.codeOutput = data;
            $scope.speedLimitData.timeDomain = data;
        });
        $timeout(function () {
            $scope.$broadcast('set-code', str);
            $scope.codeOutput = str;
            $scope.speedLimitData.timeDomain = str;
            $scope.$apply();
        }, 100);
    }
    var flag = $scope.speedLimitData.speedFlag;//限速标志
    $("#speedFlag" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
    var gaptureFlag = $scope.speedLimitData.captureFlag;//采集标志
    $("#gaptureFlag" + gaptureFlag).removeClass("btn btn-default").addClass("btn btn-primary");
    var tollgateFlag = $scope.speedLimitData.tollgateFlag;//收费站前限速
    $("#tollgateFlag" + tollgateFlag).removeClass("btn btn-default").addClass("btn btn-primary");
    $scope.checkspeedFlag = function (flag) {
        $("#speedFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#speedFlag" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.speedLimitData.speedFlag = flag;
    }

    $scope.checkgaptureFlag = function (flag) {
        $("#gaptureFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#gaptureFlag" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.speedLimitData.gaptureFlag = flag;
    }

    $scope.checktollgateFlag = function (flag) {
        $("#tollgateFlagdiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#tollgateFlag" + flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.speedLimitData.gaptureFlag = flag;
    }
    $scope.$parent.$parent.save = function () {
        objectEditCtrl.setCurrentObject($scope.speedLimitData);
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type": "RDSPEEDLIMIT",
            "projectId": 11,
            "data": objectEditCtrl.changedProperty
        };

        Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
            var info = [];
            if (data.data) {
                speedLimit.redraw();
                $.each(data.data.log, function (i, item) {
                    if (item.pid) {
                        info.push(item.op + item.type + "(pid:" + item.pid + ")");
                    } else {
                        info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                    }
                });
            } else {
                info.push(data.errmsg + data.errid)
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };
    $scope.$parent.$parent.delete = function () {
        var objId = parseInt($scope.speedLimitData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDSPEEDLIMIT",
            "projectId": 11,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            if(data.errcode===-1) {
                outputCtrl.pushOutput(data.errmsg);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
                return;
            }
            speedLimit.redraw();
            $scope.speedLimitData = null;
            $scope.speedLimitGeometryData = null;
            $scope.$parent.$parent.objectEditURL = "";
            var info = [];
            if (data.data) {
                $.each(data.data.log, function (i, item) {
                    if (item.pid) {
                        info.push(item.op + item.type + "(pid:" + item.pid + ")");
                    } else {
                        info.push(item.op + item.type + "(rowId:" + item.rowId + ")");
                    }
                });
            } else {
                info.push(data.errmsg + data.errid)
            }
            //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"

            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();

            }

        })
    }
});
