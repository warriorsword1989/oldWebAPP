/**
 * Created by zhaohang on 2016/4/5.
 */
var adAdminZone = angular.module("mapApp");
adAdminZone.controller("adAdminController",function($scope,$timeout,$document) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var adAdmin = layerCtrl.getLayerById("adAdmin");
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.isbase=true;

    //行政类型
    $scope.adminType = [
        {"id": 0, "label": "国家地区级"},
        {"id": 1, "label": "省/直辖市/自治区"},
        {"id": 2, "label": "地级市/自治州/省直辖县"},
        {"id": 2.5, "label": "DUMMY 地级市"},
        {"id": 3, "label": "地级市市区(GCZone)"},
        {"id": 3.5, "label": "地级市市区(未作区界)"},
        {"id": 4, "label": "区县/自治县"},
        {"id": 4.5, "label": "DUMMY 区县"},
        {"id": 4.8, "label": "DUMMY 区县(地级市下无区县)"},
        {"id": 5, "label": "区中心部"},
        {"id": 6, "label": "城镇/街道"},
        {"id": 7, "label": "飞地"},
        {"id": 8, "label": "KDZone"},
        {"id": 9, "label": "AOI"}
    ];
    //代表点标识
    $scope.capital = [
        {"id": 0, "label": "未定义"},
        {"id": 1, "label": "首都"},
        {"id": 2, "label": "省会/直辖市"},
        {"id": 3, "label": "地级市"}
    ];

    /**
     * 初始化数据
     */
    $scope.initializeData = function(){
        $scope.adAdminData = objCtrl.data;//获取数据
        objCtrl.setOriginalData(objCtrl.data);//记录原始数据值
        var linkArr =$scope.adAdminData.geometry.coordinates;
        var points = fastmap.mapApi.point(linkArr[0], linkArr[1]);
        selectCtrl.onSelected({//记录选中点信息
            geometry: points,
            id: $scope.adAdminData.pid
        });

        //高亮行政区划代表点
        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.adAdminData.pid.toString(),
            layerid:'adAdmin',
            type:'adadmin',
            style:{src: '../../images/road/img/heightStar.svg'}
        })
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.adAdminForm) {
            $scope.adAdminForm.$setPristine();
        }
    };
    if(objCtrl.data){
        $scope.initializeData();
    }

    $scope.cancel = function(){

    };


    /**
     * 名称属性页面
     */
    $scope.otherAdminName=function(){
        var showOtherObj={
            "loadType":"subAttrTplContainer",
            "propertyCtrl":'components/road/ctrls/attr_administratives_ctrl/adAdminNameCtrl',
            "propertyHtml":'../../scripts/components/road/tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
        }
        $scope.$emit("transitCtrlAndTpl", showOtherObj);
    }

    /**
     * 层级属性页面
     * @param boolValue
     */
    $scope.clickBasic=function(boolValue){
        $scope.isbase=boolValue;
        if($scope.isbase==false){
            var showOrdinaryObj={
                "loadType":"subAttrTplContainer",
                "propertyCtrl":'components/road/ctrls/attr_administratives_ctrl/adAdminOfLevelCtrl',
                "propertyHtml":'../../scripts/components/road/tpls/attr_adminstratives_tpl/adAdminOfLevelTpl.html'
            }
            $scope.$emit("transitCtrlAndTpl", showOrdinaryObj);
        }

    }

    //保存
    $scope.save = function(){
        objCtrl.save();
        var param = {
            "command": "UPDATE",
            "type":"ADADMIN",
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
            if (data.errcode==0) {
                adAdmin.redraw();//代表点重绘
                //清除数据清除高亮
                if(shapeCtrl.shapeEditorResult.getFinalGeometry()!==null) {
                    if (typeof map.currentTool.cleanHeight === "function") {
                        map.currentTool.cleanHeight();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                swal("操作成功",'保存成功！', "success");

                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                var sInfo={
                    "op":"修改行政区划代表点成功",
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
            //数据解析存入output
            outputCtrl.pushOutput(info);
            if (outputCtrl.updateOutPuts !== "") {
                outputCtrl.updateOutPuts();
            }
        })
    };

    //删除
    $scope.delete = function(){
        var objId = parseInt($scope.adAdminData.regionId);
        var param = {
            "command": "DELETE",
            "type":"ADADMIN",
            "projectId": Application.projectid,
            "objId": objId
        }
        //删除调用方法
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            var info = null;
            if (data.errcode==0) {
                adAdmin.redraw();
                //清除数据清除高亮
                if(shapeCtrl.shapeEditorResult.getFinalGeometry()!==null) {
                    if (typeof map.currentTool.cleanHeight === "function") {
                        map.currentTool.cleanHeight();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                var sInfo={
                    "op":"删除行政区划代表点成功",
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
            //解析数据后，展示在output 输出框
            if(info!=null){
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
            }
        })
    };
    //监听保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);


})
