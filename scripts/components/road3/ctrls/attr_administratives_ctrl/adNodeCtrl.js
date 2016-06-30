/**
 * Created by zhaohang on 2016/4/25.
 */
var adNodeApp = angular.module("app");
adNodeApp.controller("adNodeController",['$scope','dsEdit',function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("adLink");
    var adNode = layerCtrl.getLayerById("adnode");
    var selectCtrl = fastmap.uikit.SelectController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var editLayer = layerCtrl.getLayerById('edit');
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    //形态
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "图廓点"},
        {"id": 7, "label": "角点"}
    ];
    $scope.editFlag = [
        {"id": 0, "label": "不可编辑"},
        {"id": 1, "label": "可编辑"}
    ];
    //种别
    $scope.kind = [
        {"id": 1, "label": "平面交叉点"}
    ];
    //初始化
    $scope.initializeData = function(){
        $scope.adNodeData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.adNodeForm) {
            $scope.adNodeForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//记录原始数据
        var highlightFeatures = [];
        /**
         * 根据点去获取多条adlink，再高亮点线
         */
        dsEdit.getByCondition({
            dbId: App.Temp.dbId,
            type: 'ADLINK',
            data: {"nodePid":  $scope.adNodeData.pid}
        }).then(function (data){
            if (data.errcode === -1) {
                return;
            }
            var lines = [];
            $scope.linepids = [];
            //获取点连接的线
            for (var index in data.data) {
                var linkArr = data.data[index].geometry.coordinates || data[index].geometry.coordinates, points = [];
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    var point = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
                    points.push(point);
                }
                lines.push(fastmap.mapApi.lineString(points));
                $scope.linepids.push(data.data[index].pid);
                highlightFeatures.push({
                    id:data.data[index].pid.toString(),
                    layerid:'adLink',
                    type:'line',
                    style:{}
                })
            }
            var multiPolyLine = fastmap.mapApi.multiPolyline(lines);
            //存储选择的数据
            selectCtrl.onSelected({geometry: multiPolyLine, id: $scope.adNodeData.pid});
            //高亮点和线
            highlightFeatures.push({
                id:$scope.adNodeData.pid.toString(),
                layerid:'adLink',
                type:'node',
                style:{}
            });
            highRenderCtrl .highLightFeatures =highlightFeatures;
            highRenderCtrl .drawHighlight();
        });
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    //保存
    $scope.save = function(){
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化，不需要保存', "info");
            return;
        }
        if(objCtrl.changedProperty && objCtrl.changedProperty.forms && objCtrl.changedProperty.forms.length > 0){
            $.each(objCtrl.changedProperty.forms,function(i,v){
                if(v.linkPid || v.pid){
                    delete v.linkPid;
                    delete v.pid;
                }
            });
            objCtrl.changedProperty.forms.filter(function(v){
                return v;
            });
        }
        dsEdit.update($scope.adNodeData.pid, "ADNODE", objectEditCtrl.changedProperty).then(function(data) {
            if (data) {
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
    //删除
    $scope.delete = function(){
        dsEdit.delete($scope.adNodeData.pid, "ADNODE").then(function(data) {
            if (data) {
                adLink.redraw();
                adNode.redraw();
                $scope.adNodeData = null;
                // var editorLayer = layerCtrl.getLayerById("edit");
                // editorLayer.clear();
                highRenderCtrl._cleanHighLight(); //清空高亮
            }
            $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
        });
    };
    $scope.cancel = function(){

    };

    //监听 保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);
