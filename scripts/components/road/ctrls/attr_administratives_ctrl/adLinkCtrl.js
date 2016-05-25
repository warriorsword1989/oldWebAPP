/**
 * Created by zhaohang on 2016/4/5.
 */
var adLinkApp = angular.module("mapApp");
adLinkApp.controller("adLinkController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var adLink = layerCtrl.getLayerById("adLink");
    var adNode=layerCtrl.getLayerById("adnode");
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var selectCtrl = fastmap.uikit.SelectController();
    $scope.kind = [
        {"id": 0, "label": "假想线"},
        {"id": 1, "label": "省,直辖市边界"},
        {"id": 2, "label": "市行政区界"},
        {"id": 3, "label": "区县边界"},
        {"id": 4, "label": "乡镇边界"},
        {"id": 5, "label": "村边界"},
        {"id": 6, "label": "国界"},
        {"id": 7, "label": "百万产品范围框"}

    ];
    $scope.form = [
        {"id": 0, "label": "未调查"},
        {"id": 1, "label": "无属性"},
        {"id": 2, "label": "海岸线"},
        {"id": 6, "label": "特别行政区界(K)"},
        {"id": 7, "label": "特别行政区界(G)"},
        {"id": 8, "label": "未定行政区划界"},
        {"id": 9, "label": "南海诸岛范围线"}

    ];
    $scope.scale = [
        {"id": 0, "label": "2.5w"},
        {"id": 1, "label": "20w"},
        {"id": 2, "label": "100w"}
    ];

    //初始化
    $scope.initializeData = function(){
        $scope.adLinkData = objCtrl.data;
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.adLinkForm) {
            $scope.adLinkForm.$setPristine();
        }

        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        var linkArr =$scope.adLinkData.geometry.coordinates, points = [];
        for (var i = 0, len = linkArr.length; i < len; i++) {
            var pointOfLine = fastmap.mapApi.point(linkArr[i][0], linkArr[i][1]);
            points.push(pointOfLine);
        }
        var line = fastmap.mapApi.lineString(points);
        selectCtrl.onSelected({//存储选择数据信息
            geometry: line,
            id: $scope.adLinkData.pid
        });
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    //保存
    $scope.save = function(){
        objCtrl.save();
        if(objCtrl.changedProperty.limits){
            if(objCtrl.changedProperty.limits.length > 0){
                $.each(objCtrl.changedProperty.limits,function(i,v){
                    delete v.pid;
                });
            }
        }
        if(objCtrl.changedProperty.limitTrucks){
            if(objCtrl.changedProperty.limitTrucks.length > 0){
                $.each(objCtrl.changedProperty.limitTrucks,function(i,v){
                    delete v.pid;
                });
            }
        }
        var param = {
            "command": "UPDATE",
            "type":"ADLINK",
            "projectId": Application.projectid,
            "data": objCtrl.changedProperty
        };

        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return;
        }
        //保存调用方法
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            var info = null;
            adLink.redraw();//线重绘
            adNode.redraw();//点重绘
            if (data.errcode==0) {
                //清除数据清除高亮
                if(shapeCtrl.shapeEditorResult.getFinalGeometry()!==null) {
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
                swal("操作成功",'保存成功！', "success");
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());

                //返回数据解析
                var sInfo={
                    "op":"修改道路link成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sInfo);
                for(var i=0; i<data.data.log.length-1;i++){
                    if(data.data.log[i].rowId){
                        data.data.log[i].rowId=$scope.linkData.pid;
                    }
                }

                info=data.data.log;

            } else {
                swal("操作失败", data.errmsg, "error");
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            //显示到output输出窗口
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };

    //删除
    $scope.delete = function(){
        var objId = parseInt($scope.adLinkData.pid);
        var param = {
            "command": "DELETE",
            "type":"ADLINK",
            "projectId": Application.projectid,
            "objId": objId
        }
        //删除调用方法
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            var info = null;
            adLink.redraw();
            adnode.redraw();
            if (data.errcode==0) {
                var sInfo={
                    "op":"删除行政区划线成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sInfo);
                info=data.data.log;

            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
            }
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };
    $scope.cancel = function(){

    };

    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})