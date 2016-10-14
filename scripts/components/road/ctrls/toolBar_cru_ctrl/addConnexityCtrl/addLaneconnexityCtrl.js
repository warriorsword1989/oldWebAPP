/**
 * Created by liwanchong on 2016/1/25.
 */
var laneConnexityApp = angular.module("app");
laneConnexityApp.controller("addLaneConnexityController", ["$scope", '$ocLazyLoad','appPath', function ($scope, $ocLazyLoad, appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var tooltipsCtrl = fastmap.uikit.ToolTipsController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var rdlaneconnexity = layerCtrl.getLayerById('rdlaneconnexity');
    var rdLink = layerCtrl.getLayerById('rdLink');
    $scope.inLaneInfoArr = [];
    $scope.directData = objCtrl.originalData;
    $scope.laneConnexity = {};
    $scope.clickFlag = true;
    $scope.excitLineArr = [];
    $scope.highFeatures = [];


    var changedDirectObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
        "loadType": "subAttrTplContainer",
        "propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
        "propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
        "callback": function () {
            var laneObj = {
                "loadType": "subAttrTplContainer",
                "propertyCtrl":appPath.road + 'ctrls/toolBar_cru_ctrl/addConnexityCtrl/directOfConnexityCtrl',
                "propertyHtml":appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/addConnexityTepl/directOfConnexityTpl.html'
            };
            $scope.$emit("transitCtrlAndTpl", laneObj);
        }
    };
    $scope.$emit("transitCtrlAndTpl", changedDirectObj);


    //增加公交车道方向(单击)
    $scope.addTransitData=function(item,index) {

        var transitStr="",transitObj=null;
        transitObj = {
            "flag":item.flag,
            "type":1
        };
        transitStr = "<" + item.flag + ">";
        $scope.directData.showTransitData[index]=transitObj;
        $scope.directData.inLaneInfoArr[index] += transitStr;

    };

    //删除普通车道或附加车道方向有公交车道的时候 一并删除
    $scope.minusNormalData = function (item,index,event) {
        if ( $scope.directData.showNormalData.length > 0) {

            $scope.directData.showNormalData.splice(index, 1);
            $scope.directData.showTransitData.splice(index, 1);
            $scope.directData.inLaneInfoArr.splice(index, 1);

        }

    };
    $scope.minusTransitData=function(item,index) {
        if ( $scope.directData.showNormalData.length > 0) {
            $scope.directData.showTransitData[index] = {"flag":"test" , "log": ""};//主要是为了图标对齐
            $scope.directData.inLaneInfoArr[index] = $scope.directData.showNormalData[index].flag;
        }
    };

    shapeCtrl.setEditingType("addRdLaneConnexity")

    if (map.currentTool&&typeof map.currentTool.cleanHeight === "function") {
        map.currentTool.cleanHeight();
        map.currentTool.disable();//禁止当前的参考线图层的事件捕获
    }
    tooltipsCtrl.setEditEventType(fastmap.dataApi.GeoLiveModelType.RDLANECONNEXITY);
    tooltipsCtrl.setCurrentTooltip('正要新建车信,先选择线！');
    map.currentTool = new fastmap.uikit.SelectForRestriction({
        map: map,
        createLaneFlag:true,
        currentEditLayer: rdLink,
        shapeEditor: shapeCtrl,
        operationList:['line','point','line']
    });
    map.currentTool.enable();
    $scope.excitLineArr = [];
    eventController.on(eventController.eventTypes.GETLINKID, function (data) {
        if (data.index === 0) {
            if(parseInt(data.properties.direct) == 1){
                $scope.laneConnexity.inLinkPid = parseInt(data.id);
                highRenderCtrl.highLightFeatures.push({
                    id:   $scope.laneConnexity.inLinkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
                highRenderCtrl.drawHighlight();
                tooltipsCtrl.setStyleTooltip("color:black;");
                tooltipsCtrl.setCurrentTooltip("已经选择进入线,选择进入点!");
            } else if(parseInt(data.properties.direct) == 2 || parseInt(data.properties.direct) == 3){
                $scope.laneConnexity.inLinkPid = parseInt(data.id);
                if(parseInt(data.properties.direct) == 2){
                    $scope.laneConnexity.nodePid = parseInt(data.properties.enode);
                } else if(parseInt(data.properties.direct) == 3){
                    $scope.laneConnexity.nodePid = parseInt(data.properties.snode);
                }
                highRenderCtrl.highLightFeatures.push({
                    id:   $scope.laneConnexity.inLinkPid.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
                highRenderCtrl.highLightFeatures.push({
                    id:   $scope.laneConnexity.nodePid.toString(),
                    layerid: 'rdLink',
                    type: 'rdnode',
                    style: {}
                });
                highRenderCtrl.drawHighlight();
                tooltipsCtrl.setStyleTooltip("color:red;");
                tooltipsCtrl.setCurrentTooltip("已经选择进入点,请选择退出线!");
                map.currentTool.selectedFeatures.push($scope.laneConnexity.nodePid);
            }
        } else if (data.index === 1) {
            $scope.laneConnexity.nodePid = parseInt(data.id);
            highRenderCtrl.highLightFeatures.push({
                id:   $scope.laneConnexity.nodePid.toString(),
                layerid: 'rdLink',
                type: 'rdnode',
                style: {}
            });
            highRenderCtrl.drawHighlight();
            tooltipsCtrl.setStyleTooltip("color:red;");
            tooltipsCtrl.setCurrentTooltip("已经选择进入点,请选择退出线!");
        } else if (data.index > 1) {
            if(parseInt(data.properties.fc) != 9){
                $scope.excitLineArr.push(parseInt(data.id));
                highRenderCtrl.highLightFeatures.push({
                    id:  data.id.toString(),
                    layerid: 'rdLink',
                    type: 'line',
                    style: {}
                });
                highRenderCtrl .drawHighlight();
                $scope.laneConnexity.outLinkPids = $scope.excitLineArr;
                tooltipsCtrl.setCurrentTooltip("已选退出线,请选择方向或者选择退出线!");
            }
        }
        $scope.directData["laneConnexity"]=$scope.laneConnexity
    });

}])