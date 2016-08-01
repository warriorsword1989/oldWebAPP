/**
 * Created by mali on 2016/7/20.
 */
angular.module("app").controller("rdGateController",["$scope",'appPath',"dsEdit","$timeout","$ocLazyLoad",function($scope,appPath,dsEdit,$timeout,$ocLazyLoad){
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var relationData = layerCtrl.getLayerById('relationData');
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.gateTypeOptions={
        "0": "EG",
        "1": "KG",
        "2": "PG"
    };

    $scope.gateDirOptions={
        "0": "单向",
        "1": "双向",
        "2": "未调查"
    };

    $scope.gateFeeOptions={
        "0": "免费",
        "1": "收费"
    };
    $scope.showTrcukInfo = function(item) {
        var showTrcukObj = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": 'scripts/components/road/ctrls/attr_gate_ctrl/limitOfGateCtrl',
            "propertyHtml": '../../../scripts/components/road/tpls/attr_gate_tpl/limitOfGateTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showTrcukObj);
    };
    $scope.initializeData=function() {
        $scope.rdGateData = {};
        var highLightFeatures = [];
        $scope.rdGateData=objectEditCtrl.data;
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        highLightFeatures.push({
			id: $scope.rdGateData.pid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				size: 5
			}
		});
		highRenderCtrl.highLightFeatures = highLightFeatures;
		highRenderCtrl.drawHighlight();
    };

    if(objectEditCtrl.data) {
        $scope.initializeData();
    }
    objectEditCtrl.nodeObjRefresh=function(flag) {
        $scope.initialForms();
    };
    $scope.loadJsAndCtrl=function(obj) {
        $scope.$emit('transitCtrlAndTpl', obj);
    };
    $scope.showPopover=function(){
        var showPopoverObj = {
            "loadType":"subAttrTplContainer",
            "propertyCtrl":appPath.road +'ctrls/attr_node_ctrl/addDirectCtrl',
            "propertyHtml":appPath.root + appPath.road + 'tpls/attr_node_tpl/addDitrectTpl.html'
        };
        $scope.loadJsAndCtrl(showPopoverObj);
    }

    $scope.delFrom=function(item){
        item.isCheck=false;
        for(var i=0;i<$scope.newFromOfWRoadDate.length;i++){
            if($scope.newFromOfWRoadDate[i].id==item.id){
                $scope.newFromOfWRoadDate.splice(i,1);
            }
        }
        for(var p in $scope.rdGateData.forms){
            if($scope.rdGateData.forms[p].formOfWay==item.id){
                $scope.rdGateData.forms.splice(p,1);
            }
        }
        objectEditCtrl.selectNodeRefresh();
    }
    $scope.save = function () {
        objectEditCtrl.save();
        if(!objectEditCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        if(objectEditCtrl.changedProperty && objectEditCtrl.changedProperty.forms && objectEditCtrl.changedProperty.forms.length > 0){
            $.each(objectEditCtrl.changedProperty.forms,function(i,v){
                if(v.linkPid || v.pid){
                    delete v.linkPid;
                    delete v.pid;
                }
            });
            objectEditCtrl.changedProperty.forms.filter(function(v){
                return v;
            });
        }
        dsEdit.update($scope.rdGateData.pid, "RDGATE", objectEditCtrl.changedProperty).then(function(data) {
            if (data) {
                //rdLink.redraw();
                if (shapeCtrl.shapeEditorResult.getFinalGeometry() !== null) {
                    if (typeof map.currentTool.cleanHeight === "function") {
                        map.currentTool.cleanHeight();
                    }
                    if (toolTipsCtrl.getCurrentTooltip()) {
                        toolTipsCtrl.onRemoveTooltip();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
            }
        });
    };

    $scope.delete = function () {
        dsEdit.delete($scope.rdGateData.pid, "RDGATE").then(function(data) {
            if (data) {
            	relationData.redraw();
                $scope.rdGateData = null;
                // var editorLayer = layerCtrl.getLayerById("edit");
                // editorLayer.clear();
                highRenderCtrl._cleanHighLight(); //清空高亮
            }
            $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
        });
    };
    $scope.cancel=function(){

    }
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}])