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
    $scope.initializeData = function(){
        $scope.adFaceData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        if($(".ng-dirty")) {
            $.each($('.ng-dirty'), function (i, v) {
                $scope.adFaceForm.$setPristine();
            });
        }

        var highLightFeatures=[];
        highLightFeatures.push({
            id:$scope.adFaceData.pid.toString(),
            layerid:'adface',
            type:'adface',
            style:{color:'#3A5FCD'}
        })
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();

    };
    if(objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function(){

    };

    $scope.delete = function(){
        var objId = parseInt($scope.adFaceData.pid);
        var param = {
            "command": "DELETE",
            "type":"ADFACE",
            "projectId": Application.projectid,
            "objId": objId
        }
        Application.functions.saveProperty(JSON.stringify(param), function (data) {
            var info = null;
            adface.redraw();
            if (data.errcode==0) {
                var sinfo={
                    "op":"删除行政区划面成功",
                    "type":"",
                    "pid": ""
                };
                data.data.log.push(sinfo);
                info=data.data.log;
                outputCtrl.pushOutput(info);
                if (outputCtrl.updateOutPuts !== "") {
                    outputCtrl.updateOutPuts();
                }
            }else{
                info=[{
                    "op":data.errcode,
                    "type":data.errmsg,
                    "pid": data.errid
                }];
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