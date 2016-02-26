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
        {"id": 0, "label": "普通"},
        {"id": 1, "label": "指示牌"},
        {"id": 3, "label": "特定条件"},
        {"id": 4, "label": "车道限速"}
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
        {"id": 10, "label": "10 时间限制"},
        {"id": 11, "label": "11 车道限制"},
        {"id": 12, "label": "12 季节时段"},
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
            var info=null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"修改RDSPEEDLIMIT成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.unshift(sinfo);
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
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
                return;
            }
            speedLimit.redraw();
            $scope.speedLimitData = null;
            $scope.speedLimitGeometryData = null;
            $scope.$parent.$parent.objectEditURL = "";
            var info=null;
            if (data.errcode==0) {
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            //"errmsg":"此link上存在交限关系信息，删除该Link会对应删除此组关系"

            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();

            }

        })
    }
});
