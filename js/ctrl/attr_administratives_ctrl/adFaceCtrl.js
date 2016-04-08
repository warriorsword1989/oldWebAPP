/**
 * Created by zhaohang on 2016/4/7.
 */
var adFaceApp = angular.module("lazymodule", []);
adFaceApp.controller("adFaceController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();

    var test = {"regionId":3468,"meshId":33,"area":2344.565,"perimeter":234.56,"facePid":467052};


    $scope.initializeData = function(){
        var faceData = fastmap.dataApi.adface(test);
        objCtrl.data = faceData;
        $scope.adFaceData = objCtrl.data;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
    };
    $scope.initializeData();

    $scope.save = function(){

    };

    $scope.delete = function(){

    };
    $scope.cancel = function(){

    };

    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
})