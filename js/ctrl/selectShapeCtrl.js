/**
 * Created by liwanchong on 2015/10/28.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("selectShapeController", ["$scope", '$ocLazyLoad','$rootScope', function ($scope, $ocLazyLoad,$rootScope) {
    $scope.selectClaArr = $scope.$parent.$parent.classArr;
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var eventController = fastmap.uikit.EventController();
    var rdLink = layerCtrl.getLayerById('referenceLine');
    var rdCross = layerCtrl.getLayerById("rdcross")
    var workPoint = layerCtrl.getLayerById('workPoint');
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.toolTipText = "";

    $scope.showTipsOrProperty = function (data, type, objCtrl, propertyId, propertyCtrl, propertyTpl) {
        var ctrlAndTplParams={
            loadType:'tipsTplContainer',
            propertyCtrl:"ctrl/sceneAllTipsCtrl",
            propertyHtml:"js/tepl/sceneAllTipsTepl.html",
            callback:function(){
                if (data.t_lifecycle === 2) { //外业修改
                    $scope.getFeatDataCallback(data,propertyId,type,propertyCtrl,propertyTpl);
                }
                else{//3新增或1删除
                    var stageLen = data.t_trackInfo.length;
                    var stage = parseInt(data.t_trackInfo[stageLen - 1]["stage"]);
                    if (stage === 1) { // 未作业
                        if (data.s_sourceType === "1201") {
                            $scope.getFeatDataCallback(data,propertyId,type,propertyCtrl,propertyTpl);
                        } else {
                            if (data.t_lifecycle === 1) {
                                $scope.getFeatDataCallback(data,propertyId,type,propertyCtrl,propertyTpl);
                            }
                        }
                    }else if (stage === 3) {  //已作业
                        if (data.t_lifecycle === 3) {
                            if (data.f) {
                                $scope.getFeatDataCallback(data,propertyId,type,propertyCtrl,propertyTpl);
                            }
                        }
                    }
                }
            }
        }
        //先load Tips面板和控制器
        $scope.$emit("transitCtrlAndTpl", ctrlAndTplParams);
    }
    $scope.selectShape = function (type, num) {
        if (highLightLayer.highLightLayersArr.length !== 0) {
            highLightLayer.removeHighLightLayers();
        }
        if (tooltipsCtrl.getCurrentTooltip()) {
            tooltipsCtrl.onRemoveTooltip();
        }
        if (typeof map.currentTool.cleanHeight === "function") {
            map.currentTool.cleanHeight();
        }
        if ($scope.$parent.$parent.panelFlag) {
            $scope.$parent.$parent.panelFlag = false;
        }
        if (!$scope.$parent.$parent.outErrorArr[3]) {
            $scope.$parent.$parent.outErrorArr[0] = false;
            $scope.$parent.$parent.outErrorArr[1] = false;
            $scope.$parent.$parent.outErrorArr[2] = false;
            $scope.$parent.$parent.outErrorArr[3] = true;
            $scope.$parent.$parent.outErrorUrlFlag = false;
        }
        if ($scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = false;
        }
        $("#popoverTips").hide();
        map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        $scope.$parent.$parent.attrTplContainer = "";
        $scope.$parent.$parent.changeBtnClass(num);
        if (type === "link") {
            layerCtrl.pushLayerFront('edit');
            map.currentTool = new fastmap.uikit.SelectPath(
                {
                    map: map,
                    currentEditLayer: rdLink,
                    linksFlag: true,
                    shapeEditor: shapeCtrl
                });
            map.currentTool.enable();
            //初始化鼠标提示
            $scope.toolTipText = '请选择线！';
            rdLink.options.selectType = 'link';
            rdLink.options.editable = true;
            eventController.on(eventController.eventTypes.GETLINKID, function (data) {
                selectCtrl.onSelected({
                    point:data.point
                });
                $scope.getFeatDataCallback(data,data.id,"RDLINK",'ctrl/linkObjectCtrl',"js/tepl/linkObjTepl/linkObjectTepl.html");
            })
        }
        else if (type === "node") {
            layerCtrl.pushLayerFront('edit');
            rdLink.options.selectType = 'node';
            rdLink.options.editable = true;
            map.currentTool = new fastmap.uikit.SelectNode({
                map: map,
                currentEditLayer: rdLink,
                shapeEditor: shapeCtrl
            });
            map.currentTool.enable();
            $scope.toolTipText = '请选择node！';
            eventController.on(eventController.eventTypes.GETNODEID, function (data) {
                $scope.getFeatDataCallback(data,data.id,"RDLINK",'ctrl/nodeCtrl/rdNodeFromCtrl',"js/tepl/nodeTepl/rdNodeFromTepl.html");
            });
        }
        else if (type === "relation") {
            map.currentTool = new fastmap.uikit.SelectRelation({map: map});
            map.currentTool.enable();

            editLayer.bringToBack();
            $scope.toolTipText = '请选择关系！';
            eventController.on(eventController.eventTypes.GETRELATIONID, function (data) {
                $scope.data = data;
                $scope.tips = data.tips;
                var ctrlAndTmplParams={
                    propertyCtrl:"",
                    propertyHtml:""
                }
                switch ($scope.data.optype) {
                    case 'RDRESTRICTION':
                        if ($scope.tips === 0) {
                            ctrlAndTmplParams.propertyCtrl="ctrl/restrictionCtrl/rdRestriction";
                            ctrlAndTmplParams.propertyHtml="js/tepl/restrictTepl/trafficLimitOfNormalTepl.html";
                        }
                        else{
                            ctrlAndTmplParams.propertyCtrl="ctrl/restrictionCtrl/rdRestriction";
                            ctrlAndTmplParams.propertyHtml="js/tepl/restrictTepl/trafficLimitOfTruckTepl.html";
                        }
                        break;
                    case 'RDLANECONNEXITY':
                        ctrlAndTmplParams.propertyCtrl='ctrl/connexityCtrl/rdLaneConnexityCtrl';
                        ctrlAndTmplParams.propertyHtml= "js/tepl/connexityTepl/rdLaneConnexityTepl.html";
                        break;
                    case 'RDSPEEDLIMIT':
                        ctrlAndTmplParams.propertyCtrl='ctrl/speedLimitCtrl';
                        ctrlAndTmplParams.propertyHtml= "js/tepl/speedLimitTepl.html";
                        break;
                    case 'RDCROSS':
                        ctrlAndTmplParams.propertyCtrl='ctrl/crossCtrl/rdCrossCtrl';
                        ctrlAndTmplParams.propertyHtml= "js/tepl/crossTepl/rdCrossTepl.html";
                        break;
                    case 'RDBRANCH':
                        ctrlAndTmplParams.propertyCtrl="ctrl/branchCtrl/namesOfBranchCtrl" ;
                        ctrlAndTmplParams.propertyHtml= "js/tepl/branchTepl/namesOfBranch.html";
                        break;
                }

                $scope.getFeatDataCallback(data,data.id, data.optype,ctrlAndTmplParams.propertyCtrl,ctrlAndTmplParams.propertyHtml);
            })
        }
        else if (type === "tips") {
            $scope.toolTipText = '请选择tips！';
            layerCtrl.pushLayerFront('workPoint');
            map.currentTool = new fastmap.uikit.SelectDataTips({map: map, currentEditLayer: workPoint});
            map.currentTool.enable();
            workPoint.options.selectType = 'tips';
            workPoint.options.editable = true;
            eventController.on(eventController.eventTypes.GETTIPSID, function (data) {
                    $scope.data = data;
                    $("#popoverTips").css("display", "block");
                    Application.functions.getTipsResult($scope.data .id, function (data) {
                        if (data.rowkey === "undefined") {
                            return;
                        }
                       eventController.fire(eventController.eventTypes.SELECTBYATTRIBUTE, {feather: data});
                        switch (data.s_sourceType) {
                            case "2001"://测线
                                $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.id, "ctrl/linkObjectCtrl", "js/tepl/linkObjTepl/linkObjectTepl.html");
                                break;
                            case "1101"://点限速
                                $scope.showTipsOrProperty(data, "RDSPEEDLIMIT", objCtrl, data.id, "ctrl/speedLimitCtrl", "js/tepl/speedLimitTepl.html");
                                break;
                            case "1203"://道路方向
                                var ctrlAndTplOfDirect={
                                    "loadType":"tipsTplContainer",
                                    "propertyCtrl":"ctrl/sceneAllTipsCtrl",
                                    "propertyHtml":"js/tepl/sceneAllTipsTepl.html",
                                    callback:function(){
                                        if (data.f.type == 1) {
                                            $scope.getFeatDataCallback(data,data.f.id,"RDLINK","ctrl/linkObjectCtrl","js/tepl/linkObjTepl/linkObjectTepl.html")
                                        }
                                    }
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfDirect);
                                break;
                            case "1201"://种别
                                $scope.showTipsOrProperty(data, "RDLINK", objCtrl, data.f.id,  "ctrl/linkObjectCtrl", "js/tepl/linkObjTepl/linkObjectTepl.html");
                                break;
                            case "1301"://车信
                                $scope.showTipsOrProperty(data, "RDLANECONNEXITY", objCtrl, data.id, "ctrl/connexityCtrl/rdLaneConnexityCtrl", "js/tepl/connexityTepl/rdLaneConnexityTepl.html");
                                break;
                            case "1302"://交限
                                $scope.showTipsOrProperty(data, "RDRESTRICTION", objCtrl, data.id, "ctrl/restrictionCtrl/rdRestriction", "js/tepl/restrictTepl/trafficLimitOfNormalTepl.html");
                                break;
                            case "1407"://分歧
                                $ocLazyLoad.load("ctrl/sceneAllTipsCtrl").then(function () {
                                    $scope.$parent.$parent.attrTplContainer = "js/tepl/sceneAllTipsTepl.html";
                                    $ocLazyLoad.load("ctrl/branchCtrl/namesOfBranchCtrl").then(function () {
                                        $scope.$parent.$parent.attrTplContainer = "js/tepl/namesOfBranch.html";
                                    });
                                });
                                objCtrl.setCurrentObject(data.brID);
                                break;
                            case "1510"://桥
                                var ctrlAndTmplOfBridge={
                                    "loadType":"tipsTplContainer",
                                    "propertyCtrl":"ctrl/sceneAllTipsCtrl",
                                    "propertyHtml":"js/tepl/sceneAllTipsTepl.html",
                                    callback:function(){
                                        if (data.f_array.length != 0) {
                                            $scope.brigeLinkArray = data.f_array;
                                            $scope.getFeatDataCallback(data,data.f_array[0].id,"RDLINK","ctrl/linkObjectCtrl","js/tepl/linkObjTepl/linkObjectTepl.html")
                                        }
                                    }
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTmplOfBridge);
                                break;
                            case "1604"://区域内道路
                                break;
                            case  "1704"://交叉路口
                                var ctrlAndTplOfCross={
                                    "loadType":"tipsTplContainer",
                                    "propertyCtrl":"ctrl/sceneAllTipsCtrl",
                                    "propertyHtml":"js/tepl/sceneAllTipsTepl.html",
                                    callback:function(){
                                        if (data.f.id) {
                                            var obj = {"nodePid": parseInt(data.f.id)};
                                            var param = {
                                                "projectId": Application.projectid,
                                                "type": "RDCROSS",
                                                "data": obj
                                            }
                                            Application.functions.getByCondition(JSON.stringify(param), function (data) {
                                                var crossCtrlAndTpl={
                                                    propertyCtrl:"ctrl/crossCtrl/rdCrossCtrl",
                                                    propertyHtml:"js/tepl/crossTepl/rdCrossTepl.html",
                                                }
                                                objCtrl.setCurrentObject(data.data[0]);
                                                $scope.$emit("transitCtrlAndTpl", crossCtrlAndTpl);
                                            });
                                        }
                                    }
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfCross);
                                break;
                            case "1803"://挂接
                                break;
                            case "1901"://道路名
                                var ctrlAndTplOfName= {
                                    "loadType":"tipsTplContainer",
                                    "propertyCtrl": "ctrl/sceneAllTipsCtrl",
                                    "propertyHtml": "js/tepl/sceneAllTipsTepl.html"
                                }
                                $scope.$emit("transitCtrlAndTpl", ctrlAndTplOfName);
                                break;
                        }

                        if (selectCtrl.updateTipsCtrl !== "") {
                            selectCtrl.updateTipsCtrl();
                        }
                    })
                }
            )
        }
        else if (type === "rdCross") {
            layerCtrl.pushLayerFront('rdcross');
            map.currentTool = new fastmap.uikit.SelectNode({map: map, currentEditLayer: rdCross});
            map.currentTool.enable();
            rdCross.options.selectType = 'relation';
            rdCross.options.editable = true;
            $scope.toolTipText = '请选择路口！';
            eventController.on(eventController.eventTypes.GETCROSSNODEID, function (data) {
                $scope.getFeatDataCallback(data,data.id,"RDCROSS",'ctrl/crossCtrl/rdCrossCtrl',"js/tepl/crossTepl/rdCrossTepl.html");
            })
        }
        tooltipsCtrl.setCurrentTooltip($scope.toolTipText);
    };

    $scope.getFeatDataCallback=function(selectedData,id,type,ctrl,tpl){
        Application.functions.getRdObjectById(id, type, function (data) {
            if(data.errcode === -1){
                return;
            }
            objCtrl.setCurrentObject(type,data.data);
            tooltipsCtrl.onRemoveTooltip();
            var options = {
                "loadType":'attrTplContainer',
                "propertyCtrl": ctrl,
                "propertyHtml": tpl
            }
            $scope.$emit("transitCtrlAndTpl", options);
        },selectedData.detailid);
    }
}])