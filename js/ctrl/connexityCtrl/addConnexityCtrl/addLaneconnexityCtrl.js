/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module("mapApp", ['oc.lazyLoad']);
laneConnexityApp.controller("addLaneConnexityController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    $scope.inLaneInfoArr = [];
    var rdlaneconnexity = layerCtrl.getLayerById('rdlaneconnexity');
    $scope.laneConnexity = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];
    $scope.showTransitData = [];
    $scope.showAdditionalData = [];
    $scope.showNormalData = [];

    //增加普通车道方向(单击)
    $scope.addNormalData = function (item, event) {
                var obj = {"flag":"test" , "log": ""};
                if( $scope.showAdditionalData.length===0) {
                    $scope.showNormalData.push(item);
                    $scope.showTransitData.push(obj);
                    $scope.inLaneInfoArr.push(item.flag)
                }else{
                    var len = $scope.showNormalData.length;
                    $scope.showNormalData.splice(len - 1, 0, item);
                    $scope.showTransitData.splice(len - 1, 0, obj);
                    $scope.inLaneInfoArr.splice(len - 1, 0, item.flag);
                }


    };
    //增加公交车道方向(单击)
    $scope.addTransitData=function(item,index) {

        var obj = {},transitStr="";
        angular.extend(obj, item);
        obj.flag = obj.flag.toString()+obj.flag.toString();
        transitStr = "<" + item.flag + ">";
        $scope.showTransitData[index]=obj;
        $scope.inLaneInfoArr[index] += transitStr;

    };
    //增加附加车道(双击)
    $scope.additionalData=function(item) {
        if(event.button===2) {
            //event.cancelBubble = true;
            event.preventDefault();
            var transitObj = {"flag":"test" , "log": ""};
            if($scope.showAdditionalData.length===0) {
                var obj = {},additionStr;
                angular.extend(obj, item);
                additionStr = "[" + item.flag + "]";
                obj["flag"] = obj.flag.toString()+obj.flag.toString()+obj.flag.toString();
                $scope.showNormalData.push(obj);
                $scope.showTransitData.push(transitObj);
                $scope.showAdditionalData.push(obj);
            }
        }



    };
    //删除普通车道或附加车道方向有公交车道的时候 一并删除
    $scope.minusNormalData = function (item,index,event) {
        if(event.button===2) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }

            if ($scope.showNormalData.length > 0) {
                $scope.showNormalData.splice(index, 1);
                $scope.showTransitData.splice(index, 1);
                $scope.isExitObj[item.flag] = undefined;

            }
        }


    };

    shapeCtrl.setEditingType("rdlaneConnexity")
    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
    if (typeof map.currentTool.cleanHeight === "function") {
        map.currentTool.cleanHeight();
    }
    tooltipsCtrl.setEditEventType('rdlaneConnexity');
    tooltipsCtrl.setCurrentTooltip('正要新建车信,先选择线！');
    map.currentTool = new fastmap.uikit.SelectForRestriction({map: map, currentEditLayer: rdLink});
    map.currentTool.enable();
    $scope.excitLineArr = [];
    rdLink.on("getId", function (data) {
        if (data.index === 0) {
            $scope.laneConnexity.inLinkPid = parseInt(data.id);
            tooltipsCtrl.setStyleTooltip("color:black;");
            tooltipsCtrl.setChangeInnerHtml("已经选择进入线,选择进入点!");
        } else if (data.index === 1) {
            $scope.laneConnexity.nodePid = parseInt(data.id);
            tooltipsCtrl.setStyleTooltip("color:red;");
            tooltipsCtrl.setChangeInnerHtml("已经选择进入点,请选择方向!");
        } else if (data.index > 1) {
            $scope.excitLineArr.push(parseInt(data.id));
            $scope.laneConnexity.outLinkPids = $scope.excitLineArr;
            tooltipsCtrl.setChangeInnerHtml("已选退出线,请选择方向或者选择退出线!");
        }
    });
    $scope.$parent.$parent.save = function () {
            $scope.laneConnexity["laneInfo"] =  $scope.inLaneInfoArr.join(",");
            var param = {
                "command": "CREATE",
                "type": "RDLANECONNEXITY",
                "projectId": 11,
                "data":  $scope.laneConnexity
            };
            Application.functions.saveLinkGeometry(JSON.stringify(param), function (data) {
                if (data.errcode === -1) {
                    checkCtrl.setCheckResult(data);
                    return;
                }
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
                    info.push(data.errmsg + data.errid);
                }
                outPutCtrl.pushOutput(info);
                var pid = data.data.log[0].pid;
                checkCtrl.setCheckResult(data);
                //清空上一次的操作
                $scope.excitLineArr.length = 0;
                map.currentTool.cleanHeight();
                map.currentTool.disable();
                rdlaneconnexity.redraw();
                Application.functions.getRdObjectById(data.data.pid, "RDLANECONNEXITY", function (data) {
                    objCtrl.setCurrentObject(data.data);
                    $ocLazyLoad.load("ctrl/connexityCtrl/rdLaneConnexityCtrl").then(function () {
                        $scope.$parent.$parent.objectEditURL = "js/tepl/connexityTepl/rdLaneConnexityTepl.html";
                    });
                });
            })


    };
}])