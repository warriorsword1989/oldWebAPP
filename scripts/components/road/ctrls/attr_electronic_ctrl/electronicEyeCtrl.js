/**
 * Created by wangmingdong on 2016/7/22.
 */

var rdElectronicEyeApp = angular.module("app");
rdElectronicEyeApp.controller("electronicEyeCtl", ['$scope', 'dsEdit', function ($scope, dsEdit) {
	var layerCtrl = fastmap.uikit.LayerController();
	var objCtrl = fastmap.uikit.ObjectEditController();
	var eventController = fastmap.uikit.EventController();
	var relationData = layerCtrl.getLayerById('relationData');
	var editLayer = layerCtrl.getLayerById('edit');
	var shapeCtrl = fastmap.uikit.ShapeEditorController();
	var selectCtrl = fastmap.uikit.SelectController();
	var highRenderCtrl = fastmap.uikit.HighRenderController();
	$scope.initializeData = function () {
		objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		$scope.electronicEyeData = objCtrl.data;
		conversionSystem();
		$scope.changeElecType($scope.electronicEyeData.kind);
		if($scope.electronicEyeData.pairs.length){
			if($scope.electronicEyeData.pairs[0].parts[0].eleceyePid == $scope.electronicEyeData.pid){
				$scope.elecPartPid = $scope.electronicEyeData.pairs[0].parts[1].eleceyePid;
			}else{
				$scope.elecPartPid = $scope.electronicEyeData.pairs[0].parts[0].eleceyePid;
			}
		}
		var highLightFeatures = [];
		highLightFeatures.push({
			id: $scope.electronicEyeData.linkPid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				size: 5
			}
		});
		highRenderCtrl.highLightFeatures = highLightFeatures;
		highRenderCtrl.drawHighlight();

	};
	$scope.refreshData = function () {
		dsEdit.getByPid(parseInt($scope.electronicEyeData.pid), "RDELECTRONICEYE").then(function (data) {
			if (data) {
				objCtrl.setCurrentObject("RDELECTRONICEYE", data);
				$scope.initializeData();
			}
		});
	};

	/*十进制转二进制*/
	function conversionSystem() {
		$scope.electronicEyeData.locations = parseInt(objCtrl.data.location, 10).toString(2);
		if ($scope.electronicEyeData.locations) {
			if ($scope.electronicEyeData.locations.length == 1) {
				$scope.electronicEyeData.locationLeft = 0;
				$scope.electronicEyeData.locationRight = 0;
				$scope.electronicEyeData.locationTop = $scope.electronicEyeData.locations;
			} else if ($scope.electronicEyeData.locations.length == 2) {
				$scope.electronicEyeData.locationLeft = 0;
				$scope.electronicEyeData.locationRight = $scope.electronicEyeData.locations.substr(0, 1);
				$scope.electronicEyeData.locationTop = $scope.electronicEyeData.locations.substr(1, 1);
			} else if ($scope.electronicEyeData.locations.length == 3) {
				$scope.electronicEyeData.locationLeft = $scope.electronicEyeData.locations.substr(0, 1);
				$scope.electronicEyeData.locationRight = $scope.electronicEyeData.locations.substr(1, 1);
				$scope.electronicEyeData.locationTop = $scope.electronicEyeData.locations.substr(2, 1);
			}
		}
	}

	/*二进制转十进制*/
	function bin2dec(bin) {
		c = bin.split("");
		len = c.length;
		dec = 0;
		for (i = 0; i < len; i++) {
			temp = 1;
			if (c[i] == 1) {
				for (j = i + 1; j < len; j++) temp *= 2;
				dec += temp;
			} else if (c[i] != 0) {
				return false;
			}
		}
		return dec;
	}

	$scope.changeLocationLeft = function () {
		if ($scope.electronicEyeData.locationLeft == 0) {
			$scope.electronicEyeData.locationLeft = 1;
		} else {
			$scope.electronicEyeData.locationLeft = 0
		}
	};
	$scope.changeLocationRight = function () {
		if ($scope.electronicEyeData.locationRight == 0) {
			$scope.electronicEyeData.locationRight = 1;
		} else {
			$scope.electronicEyeData.locationRight = 0
		}
	};
	$scope.changeLocationTop = function () {
		if ($scope.electronicEyeData.locationTop == 0) {
			$scope.electronicEyeData.locationTop = 1;
		} else {
			$scope.electronicEyeData.locationTop = 0
		}
	};

	//改变电子眼类型
	$scope.changeElecType = function(type){
		if(type == 1 || type == 2 || type == 3 || type ==20 || type == 21){
			$scope.electronicEyeData.isSpeedlimit = true;
		}else{
			$scope.electronicEyeData.isSpeedlimit = false;
			$scope.electronicEyeData.speedLimit = 0;
		}
	};
	/*电子眼类型*/
	$scope.elecEyeType = [
		{"id": 0, "label": "未调查"},
		{"id": 1, "label": "限速摄像头"},
		{"id": 2, "label": "雷达测速摄像头"},
		{"id": 3, "label": "移动式测速"},
		{"id": 10, "label": "交通信号灯摄像头"},
		{"id": 11, "label": "路况监控摄像头"},
		{"id": 12, "label": "单行线摄像头"},
		{"id": 13, "label": "非机动车道摄像头"},
		{"id": 14, "label": "高速/城市高速出入口摄像头"},
		{"id": 15, "label": "公交车道摄像头"},
		{"id": 16, "label": "禁止左/右转摄像头"},
		{"id": 17, "label": "禁止掉头摄像头"},
		{"id": 18, "label": "应急车道摄像头"},
		{"id": 19, "label": "交通标线摄像头"},
		{"id": 20, "label": "区间测速开始"},
		{"id": 21, "label": "区间测速结束"},
		{"id": 22, "label": "违章停车摄像头"},
		{"id": 23, "label": "限行限号摄像头"},
		{"id": 98, "label": "其他"}
	];
	$scope.srcFlagOption = [
	    {"id": "0", "label": "其他外包数据"},
	    {"id": "1", "label": "外业验证数据"},
	    {"id": "2", "label": "善领"},
	    {"id": "3", "label": "图吧"}
	];

	/*作用方向*/
	$scope.directArray = [
		{id: 0, label: '未调查'},
		{id: 2, label: '顺方向'},
		{id: 3, label: '逆方向'}
	];

	/*删除配对关系*/
	$scope.deletePairBond = function () {
		swal({
			title: "删除确认",
			text: "确定删除配对关系？",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "删除",
			closeOnConfirm: false
		}, function () {
			var param = {
				"command": "DELETE",
				"type": "RDELECEYEPAIR",
				"dbId": App.Temp.dbId,
				"objId": $scope.electronicEyeData.parts[0].groupId
			};
			dsEdit.save(param).then(function (data) {
				if (data) {
					objCtrl.setOriginalData(objCtrl.data.getIntegrate());
					relationData.redraw();
				}
				$scope.refreshData();
			})
		});
	};
	/*定位配对电子眼位置*/
	$scope.findPartElecLocation = function(pid){
		dsEdit.getByPid(pid, 'RDELECTRONICEYE').then(function(data) {
			if (!data) {
				return;
			}
			if (data.errcode === -1) {
				swal("", data.errmsg, "提示信息");
				return;
			}
			map.setView([data.geometry.coordinates[1], data.geometry.coordinates[0]], map.getZoom() < 17 ? 17 : map.getZoom());

			var highLightFeatures = [];
			highLightFeatures.push({
				id: data.linkPid.toString(),
				layerid: 'rdLink',
				type: 'line',
				style: {
					size: 5
				}
			});
			highRenderCtrl.highLightFeatures = highLightFeatures;
			highRenderCtrl.drawHighlight();
			objCtrl.setCurrentObject("RDELECTRONICEYE", data);
		});
	};
	$scope.initializeData();
	$scope.save = function () {
		objCtrl.data.location = bin2dec($scope.electronicEyeData.locationLeft + '' + $scope.electronicEyeData.locationRight + '' + $scope.electronicEyeData.locationTop) ;
		objCtrl.save();
		if (!objCtrl.changedProperty) {
			swal("操作成功", '属性值没有变化！', "success");
			return;
		}
		var param = {
			"command": "UPDATE",
			"type": "RDELECTRONICEYE",
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
					dsFcc.changeDataTipsState(JSON.stringify(stageParam)).then(function (data) {
						selectCtrl.rowkey.rowkey = undefined;
					});
				}
				objCtrl.setOriginalData(objCtrl.data.getIntegrate());
				relationData.redraw();
				// swal("操作成功", "修改电子眼成功！", "success");
			}
			$scope.refreshData();
		})
	};

	$scope.delete = function () {
		var objId = parseInt($scope.electronicEyeData.pid);
		var param = {
			"command": "DELETE",
			"type": "RDELECTRONICEYE",
			"dbId": App.Temp.dbId,
			"objId": objId
		};
		dsEdit.save(param).then(function (data) {
			var info = null;
			if (data) {
				$scope.electronicEyeData = null;
				relationData.redraw();
				highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                if (map.currentTool) {
                    map.currentTool.disable();//禁止当前的参考线图层的事件捕获
                }
				 //清空编辑图层和shapeCtrl
//                editLayer.drawGeometry = null;
//                shapeCtrl.stopEditing();
//                editLayer.bringToBack();
//                $(editLayer.options._div).unbind();
//                shapeCtrl.shapeEditorResult.setFinalGeometry(null);
//                shapeCtrl.shapeEditorResult.setOriginalGeometry(null);
//                editLayer.clear();
				// 清除地图上工具按钮
				if (map.floatMenu) {
					map.removeLayer(map.floatMenu);
					map.floatMenu = null;
				}
				$scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false});
			}
		})
	};
	$scope.cancel = function () {
	};
	eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
	eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
	eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
	eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
