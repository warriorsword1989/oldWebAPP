/**
 * Created by liuzhaoxia on 2015/12/10.
 */
//var otherApp=angular.module("lazymodule", []);
var otherApp=angular.module("lazymodule", []);
otherApp.controller("rdNodeFromController",function($scope){
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    var outPutCtrl = fastmap.uikit.OutPutController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highLightLayer = fastmap.uikit.HighLightController();
    rdLink = layerCtrl.getLayerById("referenceLine");
    $scope.initializeNodeData = function () {
        $scope.rdNodeData=objectEditCtrl.data.data;
        objectEditCtrl.setOriginalData($.extend(true, {}, objectEditCtrl.data.data));

        var highLightLink = new fastmap.uikit.HighLightRender(rdLink, {
            map: map,
            highLightFeature: "linksOfnode",
            initFlag: true
        });
        highLightLayer.pushHighLightLayers(highLightLink);

        highLightLink.drawLinksOfCrossForInit( objectEditCtrl.data.linepids, [],[objectEditCtrl.data.nodeid]);

    }
    //初始化controller调用
    if (objectEditCtrl.data) {
        $scope.initializeNodeData();
    }

    //不是初始化时,初始化需要显示的数据
    objectEditCtrl.updateObject = function () {
        $scope.initializeNodeData();
    };
    $scope.auxiFlag=$scope.rdNodeData.forms[0].auxiFlag;
    $scope.formOfWay=$scope.rdNodeData.forms[0].formOfWay;
    $scope.newFromOfWRoadDate=[];
    $scope.kindOptions=[
        {"id":0,"label":"平面交叉点"},
        {"id":1,"label":"Link属性变化点"},
        {"id":2,"label":"路上点"}
    ];


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
    {"id":0,"label":"未调查"},
    {"id":1,"label":"无属性"},
    {"id":2,"label":"图廓点"},
    {"id":3,"label":"CRF Info点"},
    {"id":4,"label":"收费站"},
    {"id":5,"label":"Hihgway起点"},
    {"id":6,"label":"Highway终点"},
    {"id":10,"label":"IC"},
    {"id":11,"label":"JCT"},
    {"id":12,"label":"桥"},
    {"id":13,"label":"隧道"},
    {"id":14,"label":"车站"},
    {"id":15,"label":"障碍物"},
    {"id":16,"label":"门牌号码点"},
    {"id":20,"label":"幅宽变化点"},
    {"id":21,"label":"种别变化点"},
    {"id":22,"label":"车道变化点"},
    {"id":23,"label":"分隔带变化点"},
    {"id":30,"label":"铁道道口"},
    {"id":31,"label":"有人看守铁道道口"},
    {"id":32,"label":"无人看守铁道道口"},
    {"id":41,"label":"KDZone与道路交点"}
    ];
    for(var p in $scope.rdNodeData.forms){
        for(var s in $scope.fromOfWayOption){
            if($scope.rdNodeData.forms[p].formOfWay==$scope.fromOfWayOption[s].id){
                $scope.newFromOfWRoadDate.push($scope.fromOfWayOption[s]);
            }
        }
    }
    $scope.otherFromOfWay=[];
    //初始化数据
    initOrig($scope.newFromOfWRoadDate,$scope.fromOfWayOption,"fromOfWRoaddiv");
    //点击内容显示框时，关闭下拉，保存数据
    $("#fromOfWRoaddiv").click(function(){
        $("#fromOfWRoaddiv").popover('hide');
        $scope.endFromOfWayArray=getEndArray();
        for(var p in $scope.endFromOfWayArray){
            $scope.otherFromOfWay.push({
                formOfWay: $scope.endFromOfWayArray[p].id,
                linkPid:$scope.rdNodeData.pid
            })
        }
        $scope.rdNodeData.forms=$scope.otherFromOfWay;
    });
    $scope.showPopover=function(){
        $('#fromOfWRoaddiv').popover('show');
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

    $scope.$parent.$parent.save = function () {
        objectEditCtrl.setCurrentObject($scope.rdNodeData);
        objectEditCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"RDNODE",
            "projectId": 11,
            "data": objectEditCtrl.changedProperty
        }
        if(!objectEditCtrl.changedProperty){
            swal("操作失败", '沒有做任何操作', "error");
            reutrn;
        }
        if(objectEditCtrl.changedProperty.forms.length > 0){
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
                data.data.log.unshift(sinfo);
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

    $scope.$parent.$parent.delete=function(){
        var pid = parseInt($scope.rdNodeData.pid);
        var param =
        {
            "command":"DELETE",
            "type":"RDNODE",
            "projectId":11,
            "objId":pid
        };
        //结束编辑状态
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var restrict = layerCtrl.getLayerById("referenceLine");
            restrict.redraw();
            var info=[];
            var info = null;
            if (data.errcode==0) {
                var sinfo={
                    "op":"删除RDNODE成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.unshift(sinfo);
                info=data.data.log;
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
                swal("删除失败", data.errmsg, "error");
            }
            outPutCtrl.pushOutput(info);
            if(outPutCtrl.updateOutPuts!=="") {
                outPutCtrl.updateOutPuts();
            }
        })
    }
})