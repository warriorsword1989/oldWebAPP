/**
 * Created by zhaohang on 2016/4/7.
 */
var adFaceApp = angular.module("app");
adFaceApp.controller("adFaceController",["$scope","dsEdit" , function($scope,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var adFace = layerCtrl.getLayerById("adface");
    var outputCtrl = fastmap.uikit.OutPutController({});
    //初始化
    $scope.initializeData = function(){
        $scope.adFaceData = objCtrl.data;//获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());//存储原始数据
        //回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if($scope.adFaceForm) {
            $scope.adFaceForm.$setPristine();
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
        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
    };

    //删除
    $scope.delete = function(){
        dsEdit.delete($scope.adFaceData.pid, "ADFACE").then(function(data) {
            if (data) {
                adFace.redraw();//重绘
                $scope.adFaceData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                var editorLayer = layerCtrl.getLayerById("edit");
                editorLayer.clear();
                $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
            }
        });
    };
    $scope.cancel = function(){

    };
    //监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}])