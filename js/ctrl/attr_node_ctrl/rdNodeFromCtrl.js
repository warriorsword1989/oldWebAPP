/**
 * Created by liuzhaoxia on 2015/12/10.
 */
//var otherApp=angular.module("lazymodule", []);
var otherApp=angular.module("lazymodule", []);
otherApp.controller("rdNodeFromController",function($scope,$ocLazyLoad){
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById("referenceLine");
    var eventController = fastmap.uikit.EventController();
    var selectCtrl = fastmap.uikit.SelectController();
    var hLayer = layerCtrl.getLayerById('highlightlayer');
    $scope.srcFlagOptions=[
        {"id": 1, "label": "1 施工图"},
        {"id": 2, "label": "2 高精度测量"},
        {"id": 3, "label": "3 卫星影像"},
        {"id": 4, "label": "4 惯导测量"},
        {"id": 5, "label": "5 基础数据"},
        {"id": 6, "label": "6 GPS测量"}
    ];

    $scope.digitalLeveOptions=[
        {"id":0,"label":"无"},
        {"id": 1, "label": "1 ±0~5米"},
        {"id": 2, "label": "2 ±5~10米"},
        {"id": 3, "label": "3 ±10~15米"},
        {"id": 4, "label": "4 ±15~20米"}
    ];

    $scope.auxiFlagOptions=[
        {"id":0,"label":"无"},
        {"id":42,"label":"点假立交"},
        {"id":43,"label":"路口挂接修改"}
    ];

    $scope.fromOfWayOption=[
        {"id":0,"label":"未调查","isCheck":false},
        {"id":1,"label":"无属性","isCheck":false},
        {"id":2,"label":"图廓点","isCheck":false},
        {"id":3,"label":"CRF Info点","isCheck":false},
        {"id":4,"label":"收费站","isCheck":false},
        {"id":5,"label":"Hihgway起点","isCheck":false},
        {"id":6,"label":"Highway终点","isCheck":false},
        {"id":10,"label":"IC","isCheck":false},
        {"id":11,"label":"JCT","isCheck":false},
        {"id":12,"label":"桥","isCheck":false},
        {"id":13,"label":"隧道","isCheck":false},
        {"id":14,"label":"车站","isCheck":false},
        {"id":15,"label":"障碍物","isCheck":false},
        {"id":16,"label":"门牌号码点","isCheck":false},
        {"id":20,"label":"幅宽变化点","isCheck":false},
        {"id":21,"label":"种别变化点","isCheck":false},
        {"id":22,"label":"车道变化点","isCheck":false},
        {"id":23,"label":"分隔带变化点","isCheck":false},
        {"id":30,"label":"铁道道口","isCheck":false},
        {"id":31,"label":"有人看守铁道道口","isCheck":false},
        {"id":32,"label":"无人看守铁道道口","isCheck":false},
        {"id":41,"label":"KDZone与道路交点","isCheck":false}
    ];

    $scope.otherFromOfWay=[];
    $scope.kindOptions=[
        {"id":0,"label":"平面交叉点"},
        {"id":1,"label":"Link属性变化点"},
        {"id":2,"label":"路上点"}
    ];
    $scope.initializeNodeData=function() {
        $scope.rdNodeData = {};
        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                console.log("ddddd");
                $scope.nodeForm.$setPristine();
            });

        }
        $scope.rdNodeData=objectEditCtrl.data;
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        var highlightFeatures = [];
        Application.functions.getByCondition(JSON.stringify({
            projectId: Application.projectid,
            type: 'RDLINK',
            data: {"nodePid":  $scope.rdNodeData.pid}
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
                    layerid:'referenceLine',
                    type:'line',
                    style:{}
                })
            }

            var multiPolyLine = fastmap.mapApi.multiPolyline(lines);

            selectCtrl.onSelected({geometry: multiPolyLine, id: $scope.rdNodeData.pid});
            $scope.initialForms();


            highlightFeatures.push({
                id:$scope.rdNodeData.pid.toString(),
                layerid:'referenceLine',
                type:'node',
                style:{}
            })
            var highLightLink = new fastmap.uikit.HighLightRender(hLayer);
            highLightLink.highLightFeatures =highlightFeatures;
            highLightLink.drawHighlight();

        });

    };

    $scope.initialForms = function(){
        if($scope.rdNodeData.forms.length>0){
            $scope.auxiFlag=$scope.rdNodeData.forms[0].auxiFlag;
            $scope.formOfWay=$scope.rdNodeData.forms[0].formOfWay;
        }
        $scope.newFromOfWRoadDate=[];
        for(var p in $scope.rdNodeData.forms){
            for(var s in $scope.fromOfWayOption){
                if($scope.rdNodeData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                    $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
                }
            }
        }
    }

    if(objectEditCtrl.data) {
        $scope.initializeNodeData();
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
            "propertyCtrl":'ctrl/attr_node_ctrl/addDirectCtrl',
            "propertyHtml":'js/tpl/attr_node_tpl/addDitrectTpl.html'
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
        for(var p in $scope.rdNodeData.forms){
            if($scope.rdNodeData.forms[p].formOfWay==item.id){
                $scope.rdNodeData.forms.splice(p,1);
            }
        }
        objectEditCtrl.selectNodeRefresh();
    }
    $scope.save = function () {
        $scope.nodeForm.$setPristine();
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"RDNODE",
            "projectId": Application.projectid,
            "data": objectEditCtrl.changedProperty
        }
        if(!objectEditCtrl.changedProperty){
            swal("操作失败", '沒有做任何操作', "error");
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

        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var restrict = layerCtrl.getLayerById("referenceLine");
            restrict.redraw();
            var info = null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"修改RDNODE成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outPutCtrl.pushOutput(info);
            if(outPutCtrl.updateOutPuts!=="") {
                outPutCtrl.updateOutPuts();
            }
        });
    }

    $scope.delete = function () {
        var pid = parseInt($scope.rdNodeData.pid);
        var param =
        {
            "command": "DELETE",
            "type": "RDNODE",
            "projectId": Application.projectid,
            "objId": pid
        };
        //结束编辑状态
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            rdLink.redraw();
            var info = [];
            if (data.errcode == 0) {
                var sinfo = {
                    "op": "删除RDNODE成功",
                    "type": "",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info = data.data.log;
            } else {
                info = [{
                    "op": data.errcode,
                    "type": data.errmsg,
                    "pid": data.errid
                }];
                swal("删除失败", data.errmsg, "error");
            }
            outPutCtrl.pushOutput(info);
            if (outPutCtrl.updateOutPuts !== "") {
                outPutCtrl.updateOutPuts();
            }
        })
    };
    $scope.cancel=function(){

    }
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeNodeData);
})