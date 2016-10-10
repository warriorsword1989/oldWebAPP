/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module("app");
addDirectOfRest.controller("addDirectOfRestController", function ($scope, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdLink = layerCtrl.getLayerById('rdLink');
    var eventController = fastmap.uikit.EventController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.addDirectData = objCtrl.data;
    //初始化交限
    $scope.addLimitedData = [
        {"id": 1, "flag": false},
        {"id": 2, "flag": false},
        {"id": 3, "flag": false},
        {"id": 4, "flag": false},
        {"id": 1, "flag": true},
        {"id": 2, "flag": true},
        {"id": 3, "flag": true},
        {"id": 4, "flag": true}

    ];
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
        $scope.tipsId = item.id;
        if (item.flag) {
            flag = 2;

        } else {
            flag = 1;
        }
        var newDirectObj = fastmap.dataApi.rdRestrictionDetail({"restricInfo": item.id, "flag": flag,"conditions":[]});
        var index = $scope.getRestrictInfoIndex(newDirectObj);
        if(index > -1){
            swal('提示','此交限已经存在，请选择其他交限','warning');
            return;
        }
        $scope.newLimited = newDirectObj;
        $scope.addOutLink();
    };
    //添加退出线
    var currentTool = null;
    $scope.addOutLink = function (item){
        currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: false,
            shapeEditor: fastmap.uikit.ShapeEditorController()
        });
        currentTool.enable();
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
            highRenderCtrl.highLightFeatures.length = 0;
            highRenderCtrl._cleanHighLight();
            // $scope.$apply(function () {
            //     $scope.rdSubRestrictData.outLinkPid = parseInt(data.id);
            // });

            var highLightFeatures = [];
            highLightFeatures.push({
                id: objCtrl.data["inLinkPid"].toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {color:"red"}
            });
            highLightFeatures.push({
                id: data.id.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}
            });
            highRenderCtrl.highLightFeatures = highLightFeatures;
            highRenderCtrl.drawHighlight();

            $scope.newLimited.outLinkPid = parseInt(data.id); //退出线
        });

    };

    //根据details数组中的每一项获取restricInfo对应的下标
    $scope.getRestrictInfoIndex = function (item){
        var restricInfo = $scope.addDirectData.restricInfo;
        var restricInfoArr = restricInfo.split(',');
        var flag = item.flag;
        var index = -1;
        if(flag == 1){ //实地交限
            index = restricInfoArr.indexOf(item.restricInfo+"");
        } else {  // 0--未验证 2--理论交限
            index = restricInfoArr.indexOf('['+item.restricInfo+']');
        }
        return index;
    };

    //添加交限
    $scope.addTips = function () {

        if ($scope.tipsId == null || $scope.tipsId == undefined) {
            swal('提示','请先选择图标!','warning');
            return;
        }
        if(!$scope.newLimited.outLinkPid){
            swal('提示','请先选退出线!','warning');
            return;
        }
        //清除选择线方法事件
        if(currentTool){
            currentTool.disable();
            currentTool = null;
        }

        $scope.addDirectData.details.unshift($scope.newLimited);
        if ($scope.newLimited.flag === 1) {
            $scope.addDirectData.restricInfo = $scope.newLimited.restricInfo + "," + $scope.addDirectData.restricInfo;
        } else if ($scope.newLimited.flag === 2) {
            var newDirect = "[" + $scope.newLimited.restricInfo + "],";
            $scope.addDirectData.restricInfo = newDirect + $scope.addDirectData.restricInfo;

        }

        $scope.removeImgActive();
        $scope.newLimited = '';
        $scope.tipsId = null;
        $timeout(function () {
            $(".show-tips:first").trigger('click');
        });
        // if ($scope.modifyItem !== undefined) {
        //     var arr = $scope.addDirectData.details;
        //     for (var i = 0, len = arr.length; i < len; i++) {
        //         if (arr[i].pid === $scope.modifyItem.pid) {
        //             $scope.addDirectData.details[i].restricInfo = $scope.tipsId;
        //             $scope.modifyItem = undefined;
        //             break;
        //         }
        //     }
        // } else {
        //     if ($scope.tipsId == null || $scope.tipsId == undefined) {
        //         swal('提示','请先选择图标!','warning');
        //         return;
        //     }
        //     if(!$scope.newLimited.outLinkPid){
        //         swal('提示','请先选退出线!','warning');
        //         return;
        //     }
        //     //清除选择线方法事件
        //     if(currentTool){
        //         currentTool.disable();
        //         currentTool = null;
        //     }
        //
        //     $scope.addDirectData.details.unshift($scope.newLimited);
        //     if ($scope.newLimited.flag === 1) {
        //         $scope.addDirectData.restricInfo = $scope.newLimited.restricInfo + "," + $scope.addDirectData.restricInfo;
        //     } else if ($scope.newLimited.flag === 2) {
        //         var newDirect = "[" + $scope.newLimited.restricInfo + "],";
        //         $scope.addDirectData.restricInfo = newDirect + $scope.addDirectData.restricInfo;
        //
        //     }
        //
        //     $scope.removeImgActive();
        //     $scope.newLimited = '';
        //     $scope.tipsId = null;
        //     $timeout(function () {
        //         $(".show-tips:first").trigger('click');
        //     })
        // }
    }
});