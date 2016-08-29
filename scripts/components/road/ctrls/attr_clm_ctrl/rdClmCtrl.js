/**
 * Created by wangmingdong on 2016/8/26.
 */

var rdLineApp = angular.module("app");
rdLineApp.controller("ClmCtl",['$scope','dsEdit',function($scope,dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.initializeData = function(){
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.clmData = objCtrl.data;
        $scope.clmData = {
          pid:123,
          linkPid:123,
          centerDivider:1
        };
        $scope.laneData = [1,2,3,4];
        $scope.laneLength = $scope.laneData.length;
        $scope.refreshLaneData();
        // var highLightFeatures = [];
        // highLightFeatures.push({
        //     id: $scope.clmData.inLinkPid.toString(),
        //     layerid: 'rdLink',
        //     type: 'line',
        //     style: {
        //         color: '#21ed25'
        //     }
        // });
        // highLightFeatures.push({
        //     id: $scope.clmData.nodePid.toString(),
        //     layerid: 'rdLink',
        //     type: 'node',
        //     style: {
        //         color: 'yellow'
        //     }
        // });
        // highLightFeatures.push({
        //     id: $scope.clmData.outLinkPid.toString(),
        //     layerid: 'rdLink',
        //     type: 'line',
        //     style: {
        //         size: 5
        //     }
        // });
        // highRenderCtrl.highLightFeatures = highLightFeatures;
        // highRenderCtrl.drawHighlight();
    };
    // 刷新车道图
    $scope.refreshLaneData = function () {
      $scope.laneStyle = {width:$scope.laneData.length * 30 + 20 + 'px'};
      $scope.laneLength = $scope.laneData.length;
    };
    $scope.initializeData();
    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.clmData.pid), "RDLANE").then(function(data){
        	if (data) {
                objCtrl.setCurrentObject("RDSE", data);
                $scope.initializeData();
            }
        });
    };
    // 车道总数修改
    $scope.changeCarLane = function () {
      if ( parseInt($scope.laneLength) > $scope.laneData.length ) {
        var addMount = parseInt($scope.laneLength) - $scope.laneData.length;
        for (var i=0;i<addMount;i++) {
          $scope.laneData.push(1);
        }
      } else if (parseInt($scope.laneLength) < $scope.laneData.length) {
        $scope.laneData.splice(parseInt($scope.laneLength) + 1,$scope.laneData.length - parseInt($scope.laneLength));
      }
      $scope.refreshLaneData();
    };
    // 删除车道
    $scope.removeLane = function (index) {
      $scope.laneData.splice(index,1);
      $scope.refreshLaneData();
    };
    // 弹出车道方向面板
    $scope.showLaneDirect = function () {

    };
    // 中央分隔带
    $scope.centerDividerObj = [
      {id:1,label:'双方向道路'},
      {id:2,label:'单方向或上下线分离道路'}
    ];
    $scope.save = function(){
        objCtrl.save();
        if(!objCtrl.changedProperty){
            swal("操作成功",'属性值没有变化！', "success");
            return ;
        }
        var param = {
            "command": "UPDATE",
            "type": "RDLANE",
            "dbId": App.Temp.dbId,
            "data": objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                if (selectCtrl.rowkey) {
                    var stageParam = {
                        "rowkey": selectCtrl.rowkey.rowkey,
                        "stage": 3,
                        "handler": 0
                    };
                    dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function(data){
                        selectCtrl.rowkey.rowkey = undefined;
                    });
                }
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                relationData.redraw();
                swal("操作成功", "修改分叉口提示成功！", "success");
            }
            $scope.refreshData();
        });
    };

    $scope.delete = function(){
        var objId = parseInt($scope.clmData.pid);
        var param = {
            "command": "DELETE",
            "type": "RDLANE",
            "dbId": App.Temp.dbId,
            "objId": objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.clmData = null;
                relationData.redraw();
                highRenderCtrl._cleanHighLight();
            }
        });
    };
    $scope.cancel = function(){
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT,  $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE,  $scope.initializeData);
}]);
