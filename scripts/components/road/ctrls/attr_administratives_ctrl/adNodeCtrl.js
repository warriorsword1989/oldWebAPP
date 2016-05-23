/**
 * Created by zhaohang on 2016/4/25.
 */
var adNodeApp = angular.module("mapApp");
adNodeApp.controller("adNodeController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("referenceLine");
    var adnode = layerCtrl.getLayerById("adnode");
    var selectCtrl = fastmap.uikit.SelectController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var highRenderCtrl = fastmap.uikit.HighRenderController();
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
        //node属性值变化监控
        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                if($scope.adNodeForm!=undefined) {
                    $scope.adNodeForm.$setPristine();
                }
            });
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//记录原始数据
        var highlightFeatures = [];
        /**
         * 根据点去获取多条adlink，再高亮点线
         */
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
            })
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

        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
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
                adnode.redraw();
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            //数据解析后展示到输出框
            if(info!=null){
                outputCtrl.pushOutput(info);
                if(outputCtrl.updateOutPuts!=="") {
                    outputCtrl.updateOutPuts();
                }
            }

        });
    };
    //删除
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
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
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
                adnode.redraw();
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
                    "pid": data.errid
                }];
                swal("删除失败", data.errmsg, "error");
            }
            //返回数据显示到输出框
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };
    $scope.cancel = function(){

    };

    //监听 保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})
