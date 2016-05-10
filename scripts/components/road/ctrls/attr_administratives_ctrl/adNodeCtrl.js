/**
 * Created by zhaohang on 2016/4/25.
 */
var adNodeApp = angular.module("mapApp");
adNodeApp.controller("adNodeController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("referenceLine");
    var selectCtrl = fastmap.uikit.SelectController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var hLayer = layerCtrl.getLayerById('highlightlayer');
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "图廓点"},
        {"id": 7, "label": "角点"}
    ];
    $scope.editFlag = [
        {"id": 0, "label": "不可编辑"},
        {"id": 1, "label": "可编辑"}
    ];
    $scope.kind = [
        {"id": 1, "label": "平面交叉点"}
    ];
    $scope.initializeData = function(){
        $scope.adNodeData = objCtrl.data;
        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                $scope.adNodeForm.$setPristine();
            });
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        var highlightFeatures = [];
        Application.functions.getByCondition(JSON.stringify({
            projectId: Application.projectid,
            type: 'ADLINK',
            data: {"nodePid":  $scope.adNodeData.pid}
        }), function (data) {
            if (data.errcode === -1) {
                return;
            }
            var lines = [];
            $scope.linepids = [];
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
            selectCtrl.onSelected({geometry: multiPolyLine, id: $scope.adNodeData.pid});
            highlightFeatures.push({
                id:$scope.adNodeData.pid.toString(),
                layerid:'adLink',
                type:'node',
                style:{}
            })
            var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
            highLightLink.highLightFeatures =highlightFeatures;
            highLightLink.drawHighlight();

        });
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function(){
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"ADNODE",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        }
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
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

        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                swal("操作成功",'保存成功！', "success");
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                var sinfo={
                    "op":"修改ADNODE成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
                var restrict = layerCtrl.getLayerById("adLink");
                restrict.redraw();
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outputCtrl.pushOutput(info);
            if(outputCtrl.updateOutPuts!=="") {
                outputCtrl.updateOutPuts();
            }
        });
    };
    $scope.delete = function(){
        var pid = parseInt($scope.adNodeData.pid);
        var param =
        {
            "command": "DELETE",
            "type": "ADNODE",
            "projectId": Application.projectid,
            "objId": pid
        };
        //结束编辑状态
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = [];
            if (data.errcode == 0) {
                swal("操作成功",'删除成功！', "success");
                var sinfo = {
                    "op": "删除ADNODE成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
                var restrict = layerCtrl.getLayerById("adLink");
                restrict.redraw();
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
                    "pid": data.errid
                }];
                swal("删除失败", data.errmsg, "error");
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };
    $scope.cancel = function(){

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})
