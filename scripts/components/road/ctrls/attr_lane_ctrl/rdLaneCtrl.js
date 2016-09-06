/**
 * Created by wangmingdong on 2016/8/26.
 */

var rdLineApp = angular.module("app");
rdLineApp.controller("ClmCtl",['$scope','dsEdit','appPath',function($scope,dsEdit,appPath) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    // 高亮link
    $scope.highLightLaneLink = function(){
      var highLightFeatures = [];
      highLightFeatures.push({
          id: objCtrl.memo.nodePid.toString(),
          layerid: 'rdLink',
          type: 'node',
          style: {
              color: 'yellow'
          }
      });
      for(var i=0,len=objCtrl.memo.links.length;i<len;i++){
        if(i === 0) {
          highLightFeatures.push({
              id: objCtrl.memo.links.pid.toString(),
              layerid: 'rdLink',
              type: 'line',
              style: {
                  color: 'rgb(255, 0, 0)'
              }
          });
        } else {
          highLightFeatures.push({
              id: objCtrl.memo.links.toString(),
              layerid: 'rdLink',
              type: 'line',
              style: {
                  color: 'rgb(0, 245, 255)'
              }
          });
        }
      }
      highRenderCtrl.highLightFeatures = highLightFeatures;
      highRenderCtrl.drawHighlight();
    };
    $scope.initializeData = function(){
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        $scope.clmData = objCtrl.data;
        $scope.clmData = {
          linkPids:['123','234','567'],
          laneDir:2,
          laneInfos:[
             fastmap.dataApi.rdLane({
              pid:100000159,
              seqNum:1,
              arrowDir:'o',
              laneType:3,
              laneForming:3,
              conditions:[
                {
                  lanePid:432112,
                  viaLinkPid:56432,
                  groupId:1,
                  seqNum:1
                },
                {
                  lanePid:432112,
                  viaLinkPid:56432,
                  groupId:1,
                  seqNum:1
                }
              ]
            }),
            fastmap.dataApi.rdLane({
              pid:100000160,
              seqNum:2,
              arrowDir:'e',
              conditions:[
                {
                  lanePid:432112,
                  viaLinkPid:56432,
                  groupId:1,
                  seqNum:1
                },
                {
                  lanePid:432112,
                  viaLinkPid:56432,
                  groupId:1,
                  seqNum:1
                }
              ]
            }),
            fastmap.dataApi.rdLane({
              pid:100000161,
              seqNum:3,
              arrowDir:'a',
              conditions:[
                {
                  lanePid:432112,
                  viaLinkPid:56432,
                  groupId:1,
                  seqNum:1
                },
                {
                  lanePid:432112,
                  viaLinkPid:56432,
                  groupId:1,
                  seqNum:1
                }
              ]
            })
          ]
        };
        $scope.laneLength = $scope.clmData.laneInfos.length;
        $scope.laneIndex = 0;
        $scope.refreshLaneData();
        // $scope.highLightLaneLink();
    };
    // 刷新车道图
    $scope.refreshLaneData = function () {
      var _width = $scope.clmData.laneInfos.length * 30 + 20;
      if(_width > 300) {
        $scope.laneStyle = {width:_width,'overflow-x':'auto'};
      } else {
        $scope.laneStyle = {width:_width,top:'auto',position:'relative'};
      }
      $scope.laneLength = $scope.clmData.laneInfos.length;
      $scope.selectLaneActive = -1;
      $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
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
      if ( parseInt($scope.laneLength) > $scope.clmData.laneInfos.length ) {   //增加
        var addMount = parseInt($scope.laneLength) - $scope.clmData.laneInfos.length;
        for (var i=0;i<addMount;i++) {
          $scope.clmData.laneInfos.push(fastmap.dataApi.rdLane({pid:0,lanePid:0}));
        }
      } else if (parseInt($scope.laneLength) < $scope.clmData.laneInfos.length) {  //减少
        $scope.clmData.laneInfos.splice(parseInt($scope.laneLength) + 1,$scope.clmData.laneInfos.length - parseInt($scope.laneLength));
        if(parseInt($scope.laneLength) < $scope.laneIndex){
          $scope.laneIndex = 0;
          $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
          $scope.$emit('SWITCHCONTAINERSTATE', {
            'subAttrContainerTpl': false,
            'attrContainerTpl': true
          });
        }
      }
      $scope.refreshLaneData();
    };
    // 删除车道
    $scope.removeLane = function (index) {
      $scope.clmData.laneInfos.splice(index,1);
      $scope.refreshLaneData();
      if(index == $scope.laneIndex){
        $scope.laneIndex = 0;
        $scope.laneInfo = $scope.clmData.laneInfos[0];
      }else{
        $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
      }
    };
    // 弹出车道方向面板
    $scope.showLaneDirect = function (e,index,dir) {
      $('body').append($(e.target).parents(".fm-container").find(".carTypeTip"));
      if(index > -1){
        $scope.laneIndex = index;
        $(".carTypeTip").css({'top':($(e.target).offset().top-100)+'px','right':'310px'});
        $scope.showLaneSelect = true;
        $('body .carTypeTip:last').show();
        $scope.selectLaneActive = dir;
      }else{
        $scope.showLaneSelect = false;
        $('body .carTypeTip:last').fadeOut(300);
      }
      $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
      $scope.$emit('SWITCHCONTAINERSTATE', {
        'subAttrContainerTpl': false,
        'attrContainerTpl': true
      });
    };
    // 选择车道方向
    $scope.selectLaneDir = function (dir,index) {
      $scope.selectLaneActive = dir;
      $scope.clmData.laneInfos[$scope.laneIndex].arrowDir = dir;
    };
    // 增加车道信息
    $scope.addItem = function(){
      $scope.clmData.laneInfos[$scope.laneIndex].conditions.push(fastmap.dataApi.rdLaneCondition({lanePid:0}));
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
    /*展示车道详细信息*/
    $scope.showDetail = function (index) {
        var tempCtr = '', tempTepl = '';
        tempCtr = appPath.road + 'ctrls/attr_lane_ctrl/laneInfoCtrl';
        tempTepl = appPath.root + appPath.road + 'tpls/attr_lane_tpl/laneInfoTpl.html';
        var laneInfo = {
            "loadType": "subAttrTplContainer",
            "propertyCtrl": tempCtr,
            "propertyHtml": tempTepl,
            "data":$scope.clmData.laneInfos[$scope.laneIndex].conditions[index]
        };
        // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        objCtrl.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex].conditions[index];
        $scope.$emit("transitCtrlAndTpl", laneInfo);
    };
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
                $scope.$emit('SWITCHCONTAINERSTATE', {
                  'subAttrContainerTpl': false,
                  'attrContainerTpl': false
                });
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