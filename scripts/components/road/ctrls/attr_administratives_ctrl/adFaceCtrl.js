/**
 * Created by zhaohang on 2016/4/7.
 */
var adFaceApp = angular.module("mapApp");
adFaceApp.controller("adFaceController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var adface = layerCtrl.getLayerById("adface");
    var outputCtrl = fastmap.uikit.OutPutController({});
    //初始化
    $scope.initializeData = function(){
        $scope.adFaceData = objCtrl.data;//获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        //属性值监控
        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                if($scope.adFaceForm!=undefined) {
                    $scope.adFaceForm.$setPristine();
                }
            });
        }

        //高亮adface
        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.adFaceData.pid.toString(),
            layerid:'adface',
            type:'adface',
            style:{}
        })
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();

    };
    if(objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function(){

    };

    //删除
    $scope.delete = function(){
        var objId = parseInt($scope.adFaceData.pid);
        var param = {
            "command": "DELETE",
            "type":"ADFACE",
            "projectId": Application.projectid,
            "objId": objId
        }
        //删除调用方法
        Application.functions.editGeometryOrProperty(JSON.stringify(param), function (data) {
            var info = null;
            adface.redraw();//重绘
            //返回正确时解析数据
            if (data.errcode==0) {
                var sinfo={
                    "op":"删除行政区划面成功",
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
            if(info!=null){
                //显示到output输出窗口
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
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