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
    var highLightLayer = fastmap.uikit.HighLightController();
    var eventController = fastmap.uikit.EventController();
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
        objectEditCtrl.setOriginalData(objectEditCtrl.data.getIntegrate());
        $scope.rdNodeData=objectEditCtrl.data;
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


        var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "linksOfnode",
            initFlag: true
        });
        highLightLayer.pushHighLightLayers(highLightLink);

        highLightLink.drawLinksOfCrossForInit( objectEditCtrl.data.linepids, [],[objectEditCtrl.data.nodeid]);

    };

    if(objectEditCtrl.data) {
        $scope.initializeNodeData();
    }
    objectEditCtrl.nodeObjRefresh=function() {
        $scope.initializeNodeData();
};


    $scope.showPopover=function(){
        if(!$scope.$parent.$parent.suspendFlag) {
            $scope.$parent.$parent.suspendFlag = true;
        }
        $ocLazyLoad.load('ctrl/nodeCtrl/addDirectOfNodeCtrl').then(function () {
            $scope.$parent.$parent.suspendObjURL = "js/tepl/nodeTepl/addDitrectOfNodeTepl.html";
        })
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


    $scope.saveroadtype=function(){
        $scope.rdNodeData.forms.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            linkPid:$scope.rdNodeData.pid
        })

        $scope.newFromOfWRoadDate.unshift({
            formOfWay: parseInt($("#roadtypename").find("option:selected").val()),
            name: $("#roadtypename").find("option:selected").text()
        });
        $('#myModal').modal('hide');
    }

    $scope.deleteroadtype=function(){
        $scope.newFromOfWRoadDate.splice(type, 1);
        $scope.roadlinkData.forms.splice(type, 1);
    }

    $scope.save = function () {
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
    if(eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY]) {
        for(var i= 0,len=eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY].length;i<len;i++) {
            eventController.off(eventController.eventTypes.SAVEPROPERTY, eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY][i]);
        }
    }
    if(eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY]) {
        for(var j= 0,lenJ=eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY].length;j<lenJ;j++) {
            eventController.off(eventController.eventTypes.SAVEPROPERTY, eventController.eventTypesMap[eventController.eventTypes.DELETEPROPERTY][j]);
        }
    }
    if(eventController.eventTypesMap[eventController.eventTypes.CANCELEVENT]) {
        for(var k= 0,lenK=eventController.eventTypesMap[eventController.eventTypes.SAVEPROPERTY].length;k<lenK;k++) {
            eventController.off(eventController.eventTypes.SAVEPROPERTY, eventController.eventTypesMap[eventController.eventTypes.CANCELEVENT][k]);
        }
    }
    //eventController.off(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);

})