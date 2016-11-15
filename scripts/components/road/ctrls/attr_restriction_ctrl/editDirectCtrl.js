/**
 * Created by linglong on 2016/11/23.
 */
var addDirectOfRest = angular.module("app");
addDirectOfRest.controller("editDirectOfRestController", function ($rootScope, $scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();

    /**
     * 初始化该控制器数据模型;
     *
     */
    $scope.initPage = function(){
        $scope.editDirectData = objCtrl.data;
        //初始化交限
        $scope.editLimitedData = [
            {"id": 1, "flag": false},
            {"id": 2, "flag": false},
            {"id": 3, "flag": false},
            {"id": 4, "flag": false},
            {"id": 1, "flag": true},
            {"id": 2, "flag": true},
            {"id": 3, "flag": true},
            {"id": 4, "flag": true}

        ];
    }

    $scope.removeImgActive = function () {
        $.each($('.trafficPic'), function (i, v) {
            $(v).find('img').removeClass('active');
        });
    };

    //选择弹出框中的交限
    $scope.selectTip = function (item, e) {
        /*选中高亮*/
        $scope.removeImgActive();
        $(e.target).addClass('active');
        var flag;
        if (item.flag) {
            flag = 2;
        } else {
            flag = 1;
        }
        $scope.editDirectData.details[$rootScope.flag].flag = flag;
        $scope.editDirectData.details[$rootScope.flag].restricInfo = item.id;

        var tempArr = $scope.editDirectData.restricInfo.split(',');
        if(flag==2){
            tempArr[$rootScope.flag] = "["+item.id+"]";
        }else{
            tempArr[$rootScope.flag] = item.id
        }

        $scope.editDirectData.restricInfo = tempArr.join(',');
    };

    $scope.initPage();
});