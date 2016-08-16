/**
 * Created by linglong on 2016/8/15.
 */

var rdElectronicEyeApp = angular.module("app");
rdElectronicEyeApp.controller("variableSpeedCtl", ['$scope', 'dsEdit','$ocLazyLoad','$timeout', function ($scope, dsEdit, $ocLazyLoad, $timeout) {
    /*限速类型*/
    $scope.speedType = [
        {"id": 0, "label": "普通(General)"},
        {"id": 1, "label": "指示牌(Advisory)"},
        {"id": 2, "label": "减速带(Speed Bumps Present)"},
        {"id": 3, "label": "特定条件(Dependent)"}
    ];
    /*限速条件*/
    $scope.speedDependent = [
        {id: 0, label: '无'},
        {id: 1, label: '雨天(Rain)'},
        {id: 2, label: '雪天(Snow)'},
        {id: 3, label: '雾天(Fog)'},
        {id: 6, label: '学校(School)'},
        {id: 10, label: '时间限制(Time-Dependent)'},
        {id: 11, label: '车道限制(Line-Dependent)'},
        {id: 12, label: '季节时段(Aproximate Seasonal Time)'}
    ];
	var layerCtrl = fastmap.uikit.LayerController();
	var objCtrl = fastmap.uikit.ObjectEditController();
	var eventController = fastmap.uikit.EventController();
	var relationData = layerCtrl.getLayerById('relationData');
	var selectCtrl = fastmap.uikit.SelectController();
	var highRenderCtrl = fastmap.uikit.HighRenderController();

    //加载车辆类型;
    $ocLazyLoad.load('scripts/components/road/ctrls/attr_variableSpeed_ctrl/carTypeCtrl').then(function() {
        $scope.carPopoverURL = '../../../scripts/components/road/tpls/attr_variableSpeed_tpl/carTypeTpl.html';
    });

	$scope.initializeData = function () {
		objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		$scope.electronicEyeData = objCtrl.data;
		conversionSystem();
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
	//$scope.initializeData();
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
		$scope.electronicEyeData.location = parseInt(objCtrl.data.location, 10).toString(2);
		if (objCtrl.data.location) {
			if (objCtrl.data.location.length == 1) {
				$scope.electronicEyeData.locationLeft = 0;
				$scope.electronicEyeData.locationRight = 0;
				$scope.electronicEyeData.locationTop = $scope.electronicEyeData.location;
			} else if (objCtrl.data.location.length == 2) {
				$scope.electronicEyeData.locationLeft = 0;
				$scope.electronicEyeData.locationRight = $scope.electronicEyeData.location.substr(0, 1);
				$scope.electronicEyeData.locationTop = $scope.electronicEyeData.location.substr(1, 1);
			} else if (objCtrl.data.location.length == 3) {
				$scope.electronicEyeData.locationLeft = $scope.electronicEyeData.location.substr(0, 1);
				$scope.electronicEyeData.locationRight = $scope.electronicEyeData.location.substr(1, 1);
				$scope.electronicEyeData.locationTop = $scope.electronicEyeData.location.substr(2, 1);
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
					swal("操作成功", "删除配对关系成功！", "success");
				}
				$scope.refreshData();
			})
		});
	};

	$scope.save = function () {
		objCtrl.data.location = bin2dec($scope.electronicEyeData.locationLeft + '' + $scope.electronicEyeData.locationRight + '' + $scope.electronicEyeData.locationTop);
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
				swal("操作成功", "修改电子眼成功！", "success");
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