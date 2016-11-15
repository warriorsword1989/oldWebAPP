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

    /**
     * 初始化工作包括高亮显示交限的进入线和进入点以及交限图标;
     * 初始化该控制器数据模型;
     *
     */
    $scope.initPage = function(){
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
        highRenderCtrl.highLightFeatures = [];
        highRenderCtrl.highLightFeatures.push({
            id: $scope.addDirectData["inLinkPid"].toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: 'green'}
        });
        highRenderCtrl.highLightFeatures.push({
            id: $scope.addDirectData["nodePid"].toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {color: 'yellow'}
        });
        highRenderCtrl.highLightFeatures.push({
            id: $scope.addDirectData["pid"].toString(),
            layerid: 'relationData',
            type: 'relationData',
            style: {}
        });
        highRenderCtrl._cleanHighLight();
        highRenderCtrl.drawHighlight();
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
        $scope.tipsId = item.id;
        if (item.flag) {
            flag = 2;
        } else {
            flag = 1;
        }
        var newDirectObj = fastmap.dataApi.rdRestrictionDetail({"restricInfo": item.id, "flag": flag,"conditions":[]});
        
        $scope.newLimited = newDirectObj;
        $scope.addOutLink(item);
    };
    //添加退出线
    $scope.addOutLink = function (item){

        map.currentTool.disable();//禁止当前的参考线图层的事件捕获
        map.currentTool = new fastmap.uikit.SelectPath({
            map: map,
            currentEditLayer: rdLink,
            linksFlag: false,
            shapeEditor: fastmap.uikit.ShapeEditorController()
        });
        map.currentTool.enable();

        eventController.off(eventController.eventTypes.GETOUTLINKSPID);
        eventController.on(eventController.eventTypes.GETOUTLINKSPID, function (data) {
            var flag = false;
            for(var i = 0; i < $scope.addDirectData.details.length; i++ ){
                if($scope.addDirectData.details[i].outLinkPid == data.id){
                    flag = true;
                    break
                }
            }
            if(flag){
                swal('提示','已存在此退出线，请选择其他线！','warning');
                return ;
            }

            highRenderCtrl.highLightFeatures.length = 0;
            highRenderCtrl._cleanHighLight();

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
    }


    $scope.initPage();
});