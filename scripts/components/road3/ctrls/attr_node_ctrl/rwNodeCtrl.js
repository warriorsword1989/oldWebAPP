/**
 * Created by mali on 2016/6/23.
 */
angular.module("app").controller("rwNodeController",['$scope','dsRoad',function($scope,dsRoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("rwLink");
    var adNode = layerCtrl.getLayerById("rwnode");
    var selectCtrl = fastmap.uikit.SelectController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    //形态
    $scope.form = [
        {"id": 0, "label": "无"},
        {"id": 1, "label": "图廓点"},
        {"id": 7, "label": "角点"}
    ];
    //种别
    $scope.kind = [
        {"id": 1, "label": "平面交叉点"}
    ];
    //初始化
    $scope.initializeData = function(){
        $scope.rwNodeData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.rwNodeForm) {
            $scope.rwNodeForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//记录原始数据
        var highlightFeatures = [];
        /**
         * 根据点去获取多条adlink，再高亮点线
         */
        dsRoad.getByCondition({
            dbId: App.Temp.dbId,
            type: 'RWLINK',
            data: {"nodePid":  $scope.rwNodeData.pid}
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
                    layerid:'rwLink',
                    type:'line',
                    style:{}
                });
            }
            var multiPolyLine = fastmap.mapApi.multiPolyline(lines);
            //存储选择的数据
            selectCtrl.onSelected({geometry: multiPolyLine, id: $scope.rwNodeData.pid});
            //高亮点和线
            highlightFeatures.push({
                id:$scope.rwNodeData.pid.toString(),
                layerid:'rwLink',
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
        var param = {
            "command": "UPDATE",
            "type":"AWNODE",
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
                var sInfo={
                    "op":"修改AWNODE成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sInfo);
                info=data.data.log;

                adLink.redraw();
                adNode.redraw();
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
        var pid = parseInt($scope.rwNodeData.pid);
        var param =
        {
            "command": "DELETE",
            "type": "AWNODE",
            "projectId": Application.projectid,
            "objId": pid
        };
        //结束编辑状态
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            var info = [];
            if (data.errcode == 0) {
                swal("操作成功",'删除成功！', "success");
                var sinfo = {
                    "op": "删除AWNODE成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
                adLink.redraw();
                adNode.redraw();
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
}]);
