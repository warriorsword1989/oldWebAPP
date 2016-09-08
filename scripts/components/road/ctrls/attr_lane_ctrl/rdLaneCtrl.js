/**
 * Created by wangmingdong on 2016/8/26.
 */

var rdLineApp = angular.module("app");
rdLineApp.controller("ClmCtl",['$scope','dsEdit','appPath','$timeout','$ocLazyLoad',function($scope,dsEdit,appPath,$timeout,$ocLazyLoad) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('relationData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    $scope.clmData = objCtrl.data;
    $scope.carData=[];
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
              id: objCtrl.memo.links[0].toString(),
              layerid: 'rdLink',
              type: 'line',
              style: {
                  color: 'rgb(255, 0, 0)'
              }
          });
        } else {
          highLightFeatures.push({
              id: objCtrl.memo.links[i].toString(),
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
        $scope.laneLength = $scope.clmData.laneInfos.length;
        $scope.laneIndex = 0;
        $scope.refreshLaneData();
        $(".datetip-double").hide();
        $(".datetip").hide();
        $scope.highLightLaneLink();
    };
    // 刷新车道图
    $scope.refreshLaneData = function () {
      $scope.selectLaneActive = -1;
      if($scope.clmData.laneInfos.length > 0){
        $scope.laneInfo = $scope.clmData.laneInfos[$scope.laneIndex];
      }else{
        $scope.laneInfo = fastmap.dataApi.rdLane({pid:0});
        $scope.clmData.laneInfos.push($scope.laneInfo);
      }
      if($scope.laneInfo && $scope.laneInfo.conditions.lenth > 0){
        $scope.showvehicle($scope.laneInfo.conditions[0].vehicle);
      }
      var _width = $scope.clmData.laneInfos.length * 30 + 20;
      if(_width > 300) {
        $scope.laneStyle = {width:_width,'overflow-x':'auto'};
      } else {
        $scope.laneStyle = {width:_width,top:'auto',position:'relative'};
      }
      for(var i=0,len=$scope.clmData.laneInfos.length;i<len;i++){
        $scope.clmData.laneInfos[i].seqNum = i+1;
      }
      $scope.laneLength = $scope.clmData.laneInfos.length;
      $('body .carTypeTip:last').hide();
    };
    $scope.initializeData();
    $scope.refreshData = function () {
        var param = {
            "type": "RDLANE",
            "dbId": App.Temp.dbId,
            "data": {
                linkPid:$scope.clmData.linkPids[0],
                laneDir:$scope.clmData.laneDir
            }
        };
        dsEdit.getByCondition(param).then(function(data) {
          objCtrl.setCurrentObject('RDLANE', {
            linkPids:$scope.clmData.linkPids,
            laneDir:$scope.clmData.laneDir,
            laneInfos:data.data
          });
          $scope.initializeData();
        });
    };
    // 车道总数修改
    $scope.changeCarLane = function () {
      if ( parseInt($scope.laneLength) > $scope.clmData.laneInfos.length ) {   //增加
        var addMount = parseInt($scope.laneLength) - $scope.clmData.laneInfos.length;
        for (var i=0;i<addMount;i++) {
          $scope.clmData.laneInfos.push(fastmap.dataApi.rdLane({pid:0}));
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
    // 修改车道类型
    $scope.changeLaneType = function(){
      if($scope.laneInfo.laneType != 11){
        $scope.laneInfo.conditions = [];
      }else{
        $scope.laneInfo.conditions.push(fastmap.dataApi.rdLaneCondition({pid:0}));
        $(".datetip-double").hide();
        $(".datetip").hide();
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
      // $scope.$emit('SWITCHCONTAINERSTATE', {
      //   'subAttrContainerTpl': false,
      //   'attrContainerTpl': true
      // });
    };
    // 选择车道方向
    $scope.selectLaneDir = function (dir,index) {
      $scope.selectLaneActive = dir;
      $scope.clmData.laneInfos[$scope.laneIndex].arrowDir = dir;
    };
    // 增加车道信息
    // $scope.addItem = function(){
    //   $scope.clmData.laneInfos[$scope.laneIndex].conditions.push(fastmap.dataApi.rdLaneCondition({lanePid:0}));
    // };
    // 车道信息condition
  	$scope.carSelect=function(item){
  		if(item.checked){
  			item.checked=false;
  			for(var i in $scope.carData){
  				if($scope.carData[i].id.toString()==item.id){
  					$scope.carData.splice(i,1);
  				}
  			}
  		}else{
  			item.checked=true;
  			$scope.carData.push(item);
  		}
  		$scope.checkViche();
  	};
  	$scope.showvehicle=function(vehicle){
  		var towbin=dec2bin(vehicle);

  		//循环车辆值域，根据数据库数据取出新的数组显示在页面
  		var originArray=[];
  		$scope.checkValue=false;
  		var len=towbin.length-1;
  		//长度小于32即是没有选中checkbox，不允许
  		if(towbin.length<32){
  			$scope.checkValue=false;
  		}else{
  			len=towbin.length-2;
  			$scope.checkValue=true;
  		}
  		for(var i=len;i>=0;i--){
  			if(towbin.split("").reverse().join("")[i]==1){
  				originArray.push($scope.vehicleOptions[i]);
  			}
  		}

  		if(originArray.length === 0){
  			$scope.carData = [];
  		} else {
  			for(var p in originArray){
  				for(var s in $scope.vehicleOptions){
  					if(originArray[p].id.toString()==$scope.vehicleOptions[s].id){
  						$scope.vehicleOptions[s].checked=true;
  						$scope.carData.push($scope.vehicleOptions[s]);
  					}
  				}
  			}
  		}
  	};
  	$scope.showPopover=function(e){
  		$('body').append($(e.target).parents(".fm-container").find(".carTip"));
  		if($('body .carTip:last').css('display') == 'none'){
  			$(".carTip").css({'top':($(e.target).offset().top-100)+'px','right':'300px'});
  			$('body .carTip:last').show();
  		}else{
  			$('body .carTip:last').hide();
  		}
  	};
  	$scope.checkViche=function(){
  		var newArray=[];
  		var result="";
  		for(var j=0;j<$scope.carData.length;j++){
  			newArray.push($scope.carData[j].id);
  		}
  		for(var i=31;i>=0;i--){
  			if(i==31){
  				if($scope.checkValue){
  					result+="1";//允许
  				}else{
  					result+="0";//禁止
  				}
  			}else{
  				if($.inArray(i, newArray)!=-1){
  					result+="1";
  				}else{
  					result+="0";
  				}
  			}

  		}

  		$scope.laneInfo.conditions[0].vehicle=parseInt(bin2dec(result));
  	};

  	$timeout(function(){
  			$ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimer').then(function () {
  					$scope.dateURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimer.html';
            if($scope.laneInfo && $scope.laneInfo.conditions.length > 0){
              $timeout(function(){
    							$scope.fmdateTimer($scope.laneInfo.conditions[0].directionTime);
    							$scope.$broadcast('set-code',$scope.laneInfo.conditions[0].directionTime);
    							$scope.$apply();
    					},100);
            }
  					$ocLazyLoad.load('scripts/components/tools/fmTimeComponent/fmdateTimerDouble').then(function () {
  							$scope.dateDoubleURL = '../../../scripts/components/tools/fmTimeComponent/fmdateTimerDouble.html';
                if($scope.laneInfo && $scope.laneInfo.conditions.length > 0){
                  $timeout(function(){
    									$scope.carFmdateTimer($scope.laneInfo.conditions[0].vehicleTime);
    									$scope.$broadcast('set-code',$scope.laneInfo.conditions[0].vehicleTime);
    									$scope.$apply();
    							},100);
                }
  					});
  			});
  	});
  	/*时间控件*/
  	$scope.fmdateTimer = function(str){
  			$scope.$on('get-date', function(event,data) {
  					$scope.laneInfo.conditions[0].directionTime = data;
  			});
  			$timeout(function(){
  					$scope.$broadcast('set-code',str);
  					$scope.laneInfo.conditions[0].directionTime = str;
  					$scope.$apply();
  			},100);
  	};
  	$scope.carFmdateTimer = function(str){
  			$scope.$on('get-date', function(event,data) {
  					$scope.laneInfo.conditions[0].vehicleTime = data;
  			});
  			$timeout(function(){
  					$scope.$broadcast('set-code',str);
  					$scope.laneInfo.conditions[0].vehicleTime = str;
  					$scope.$apply();
  			},100);
  	};
  		$scope.vehicleOptions = [
  			{"id": 0, "label": "客车(小汽车)","checked":false},
  			{"id": 1, "label": "配送卡车","checked":false},
  			{"id": 2, "label": "运输卡车","checked":false},
  			{"id": 3, "label": "步行者","checked":false},
  			{"id": 4, "label": "自行车","checked":false},
  			{"id": 5, "label": "摩托车","checked":false},
  			{"id": 6, "label": "机动脚踏两用车","checked":false},
  			{"id": 7, "label": "急救车","checked":false},
  			{"id": 8, "label": "出租车","checked":false},
  			{"id": 9, "label": "公交车","checked":false},
  			{"id": 10, "label": "工程车","checked":false},
  			{"id": 11, "label": "本地车辆","checked":false},
  			{"id": 12, "label": "自用车辆","checked":false},
  			{"id": 13, "label": "多人乘坐车辆","checked":false},
  			{"id": 14, "label": "军车","checked":false},
  			{"id": 15, "label": "有拖车的车","checked":false},
  			{"id": 16, "label": "私营公共汽车","checked":false},
  			{"id": 17, "label": "农用车","checked":false},
  			{"id": 18, "label": "载有易爆品的车辆","checked":false},
  			{"id": 19, "label": "载有水污染品的车辆","checked":false},
  			{"id": 20, "label": "载有其它危险品的车辆","checked":false},
  			{"id": 21, "label": "电车","checked":false},
  			{"id": 22, "label": "轻轨","checked":false},
  			{"id": 23, "label": "校车","checked":false},
  			{"id": 24, "label": "四轮驱动车","checked":false},
  			{"id": 25, "label": "装有防雪链的车","checked":false},
  			{"id": 26, "label": "邮政车","checked":false},
  			{"id": 27, "label": "槽罐车","checked":false},
  			{"id": 28, "label": "残疾人车","checked":false}
  		];
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
        // objCtrl.save();
        // if(!objCtrl.changedProperty){
        //     swal("操作成功",'属性值没有变化！', "success");
        //     return ;
        // }
        var param = {
            "command": "BATCH",
            "type": "RDLANE",
            "dbId": App.Temp.dbId,
            "data": $scope.clmData
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
                swal("操作成功", "操作详细车道编辑成功！", "success");
            }
            $scope.refreshData();
        });
    };

    $scope.delete = function(){
        var param = {
            "command": "DELETE",
            "type": "RDLANE",
            "dbId": App.Temp.dbId,
            "data": {
              linkPid:$scope.clmData.linkPids[0],
              laneDir:$scope.clmData.laneDir
            }
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
    eventController.on(eventController.eventTypes.SELECTEDFEATURETYPECHANGE,  $scope.initializeData);
}]);
