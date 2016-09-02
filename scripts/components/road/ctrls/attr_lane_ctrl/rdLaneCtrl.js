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
          linkPid:['123','234','567'],
          conditions:[
            
          ]
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
      var _width = $scope.laneData.length * 30 + 20;
      if(_width > 300) {
        $scope.laneStyle = {width:_width,'overflow-x':'auto'};
      } else {
        $scope.laneStyle = {width:_width,top:'auto',position:'relative'};
      }
      $scope.laneLength = $scope.laneData.length;
      $scope.laneIndex = -1;
      $scope.selectLaneActive = -1;
      $('body .carTypeTip:last').hide();
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
      if ( parseInt($scope.laneLength) > $scope.laneData.length ) {   //增加
        var addMount = parseInt($scope.laneLength) - $scope.laneData.length;
        for (var i=0;i<addMount;i++) {
          $scope.laneData.push(1);
        }
      } else if (parseInt($scope.laneLength) < $scope.laneData.length) {  //减少
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
    $scope.showLaneDirect = function (e,index,dir) {
      $('body').append($(e.target).parents(".fm-container").find(".carTypeTip"));
      $scope.laneIndex = index;
      if(index > -1){
        $(".carTypeTip").css({'top':($(e.target).offset().top-100)+'px','right':'310px'});
        $scope.showLaneSelect = true;
        $('body .carTypeTip:last').show();
        $scope.selectLaneActive = dir;
      }else{
        $scope.laneIndex = -1;
        $scope.showLaneSelect = false;
        $('body .carTypeTip:last').fadeOut(300);
      }
    };
    // 选择车道方向
    $scope.selectLaneDir = function (dir,index) {
      $scope.selectLaneActive = dir;
      $scope.laneData[$scope.laneIndex] = dir;
    };
    // 中央分隔带
    $scope.centerDividerObj = [
      {id:1,label:'双方向道路'},
      {id:2,label:'单方向或上下线分离道路'}
    ];
    // 车道标识
    $scope.laneFlag = [
      {id:0,label:'不应用'},
      {id:1,label:'车道形成'},
      {id:2,label:'车道结束'},
      {id:3,label:'车道形成&结束'}
    ];
    // 车道方向
    $scope.laneDirObj = [
      {id:1,label:'无'},
      {id:2,label:'顺方向'},
      {id:3,label:'逆方向'}
    ];
    // 车道类型
    $scope.laneTypeObj = [
      {id:0,label:'常规车道'},
      {id:1,label:'复合车道'},
      {id:2,label:'加速车道'},
      {id:3,label:'减速车道'},
      {id:4,label:'满载车道'},
      {id:5,label:'快车道'},
      {id:6,label:'慢车道'},
      {id:7,label:'超车道'},
      {id:8,label:'可行驶路肩带'},
      {id:9,label:'卡车停车道'},
      {id:10,label:'管制车道'},
      {id:11,label:'潮汐车道'},
      {id:12,label:'中心转向车道'},
      {id:13,label:'转向车道'},
      {id:14,label:'空车道'},
      {id:15,label:'转向可变车道'}
    ];
    // 车道分隔带
    $scope.laneDividerObj = [
      {id:0,label:'未调查'},
      {id:10,label:'虚线'},
      {id:11,label:'短虚线'},
      {id:12,label:'短粗虚线'},
      {id:13,label:'双虚线'},
      {id:20,label:'单实线'},
      {id:21,label:'双实线'},
      {id:30,label:'左实线/右虚线'},
      {id:31,label:'左虚线/右实线'},
      {id:40,label:'填充区标线'},
      {id:50,label:'警告线'},
      {id:51,label:'中心转向标线'},
      {id:60,label:'其他物理隔离'},
      {id:61,label:'栅栏'},
      {id:62,label:'绿化带'},
      {id:63,label:'混合'},
      {id:99,label:'无'}
    ];
    // 车道方向集合
    $scope.laneDirectArray = [0,1,2,3,4,5,'a','b','c',
    'd','e','f','g','h','i','j','k','l','m','n','o','r','s','t','u','v','w','x','y','z'];
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
