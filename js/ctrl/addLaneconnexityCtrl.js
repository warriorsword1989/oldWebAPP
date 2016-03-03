/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module("mapApp", ['oc.lazyLoad']);
laneConnexityApp.controller("addLaneConnexityController", ["$scope", '$ocLazyLoad', function ($scope, $ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();

    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var selectCtrl = fastmap.uikit.SelectController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var checkCtrl = fastmap.uikit.CheckResultController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdlaneconnexity = layerCtrl.getLayerById('rdlaneconnexity');
    $scope.laneConnexity = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];
    $scope.showTransitData = [];
    $scope.showAdditionalData = [];
    $scope.laneConnexityData = [
        {flag: 0, log: "调斜右"},
        {flag: 1, log: "斜左斜右"},
        {flag: 2, log: "直左斜左"},
        {flag: 3, log: "直左斜右"},
        {flag: 4, log: "直右斜左"},
        {flag: 5, log: "直右斜右"},
        {flag: "a", log: "直"},
        {flag: "b", log: "左"},
        {flag: "c", log: "右"},
        {flag: "d", log: "调"},
        {flag: "e", log: "直调"},
        {flag: "f", log: "直右"},
        {flag: "g", log: "直左"},
        {flag: "h", log: "左直右"},
        {flag: "i", log: "调直右"},
        {flag: "j", log: "调左值"},
        {flag: "k", log: "左右"},
        {flag: "i", log: "调右"},
        {flag: "m", log: "调左右"},
        {flag: "n", log: "调右"},
        {flag: "o", log: "空"},
        {flag: "p", log: "左直右调"},
        {flag: "r", log: "斜左"},
        {flag: "s", log: "斜右"},
        {flag: "t", log: "直斜左"},
        {flag: "u", log: "左斜左"},
        {flag: "v", log: "右斜左"},
        {flag: "w", log: "调斜左"},
        {flag: "x", log: "直斜右"},
        {flag: "y", log: "左斜右"},
        {flag: "z", log: "右斜右"}
    ];
    $scope.isExitObj = {};
    $scope.showNormalData = [];

    //增加普通车道方向(单击)
    $scope.addNormalData = function (item, event) {
            if (!$scope.isExitObj[item.flag]) {
                var obj = {"flag":"test" , "log": ""};
                $scope.isExitObj[item.flag] = true;
                if( $scope.showAdditionalData.length===0) {
                    $scope.showNormalData.push(item);
                    $scope.showTransitData.push(obj);
                }else{
                    var len = $scope.showNormalData.length;
                    $scope.showNormalData.splice(len - 1, 0, item);
                    $scope.showTransitData.splice(len - 1, 0, obj);
                }

            }


    };
    //增加公交车道方向(单击)
    $scope.addTransitData=function(item,index) {

        var obj = {};
        angular.extend(obj, item);
        obj.flag = obj.flag.toString()+obj.flag.toString();
        $scope.showTransitData[index]=obj;

    };
    //增加附加车道(双击)
    $scope.additionalData=function(item) {
        if(event.button===2) {
            //event.cancelBubble = true;
            event.preventDefault();
            var transitObj = {"flag":"test" , "log": ""};
            if($scope.showAdditionalData.length===0) {
                var obj = {};
                angular.extend(obj, item);
                obj["flag"] = [obj["flag"].toString()];
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
        if ($scope.isExitObj) {
            var laneArr = [],laneStr="",len;
            if($scope.showAdditionalData.length!==0){
                len = $scope.showNormalData.length - 1;
            }else{
                len = $scope.showNormalData.length;
            }
            for(var i= 0;i<len;i++) {
                if($scope.showTransitData[i]["flag"]!=="test") {
                    //获取含有公交车道的方向
                    var str = $scope.showTransitData[i]["flag"].toString();
                    str = str.substr(0, 1);
                     laneStr = $scope.showNormalData[i]["flag"].toString() +"<"+str+">";
                    laneArr.push(laneStr);
                }else{
                    if(i===(len-1)) {
                        if($scope.showAdditionalData.length!==0) {
                            laneStr = $scope.showNormalData[i]["flag"].toString() + "[" + $scope.showAdditionalData[0].flag.toString()+ "]";
                            laneArr.push(laneStr);
                        }else{
                            laneArr.push($scope.showNormalData[i]["flag"].toString());
                        }

                    }else{
                        laneArr.push($scope.showNormalData[i]["flag"].toString());
                    }
                }
            }
            //var laneInfo = Object.keys($scope.isExitObj);
            $scope.laneConnexity["laneInfo"] = laneArr.join(",");
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
        }

    };
}])