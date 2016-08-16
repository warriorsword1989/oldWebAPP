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
		$scope.variableSpeed = objCtrl.data;
        objCtrl.setOriginalData($scope.variableSpeed.getIntegrate());
        //十进制转二进制;
		conversionSystem();
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.variableSpeed.inLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {color: '#21ed25'}
        });
        highLightFeatures.push({
            id: $scope.variableSpeed.outLinkPid.toString(),
            layerid: 'rdLink',
            type: 'line',
            style: {size: 5}
        });
        highLightFeatures.push({
            id: $scope.variableSpeed.nodePid.toString(),
            layerid: 'rdLink',
            type: 'node',
            style: {color: 'yellow',size:8}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
	};

	/*十进制转二进制*/
	function conversionSystem() {
		$scope.variableSpeed.location = parseInt(objCtrl.data.location, 10).toString(2);
		if (objCtrl.data.location) {
			if (objCtrl.data.location.length == 1) {
				$scope.variableSpeed.locationLeft = 0;
				$scope.variableSpeed.locationRight = 0;
				$scope.variableSpeed.locationTop = $scope.variableSpeed.location;
			} else if (objCtrl.data.location.length == 2) {
				$scope.variableSpeed.locationLeft = 0;
				$scope.variableSpeed.locationRight = $scope.variableSpeed.location.substr(0, 1);
				$scope.variableSpeed.locationTop = $scope.variableSpeed.location.substr(1, 1);
			} else if (objCtrl.data.location.length == 3) {
				$scope.variableSpeed.locationLeft = $scope.variableSpeed.location.substr(0, 1);
				$scope.variableSpeed.locationRight = $scope.variableSpeed.location.substr(1, 1);
				$scope.variableSpeed.locationTop = $scope.variableSpeed.location.substr(2, 1);
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
		if ($scope.variableSpeed.locationLeft == 0) {
			$scope.variableSpeed.locationLeft = 1;
		} else {
			$scope.variableSpeed.locationLeft = 0
		}
	};
	$scope.changeLocationRight = function () {
		if ($scope.variableSpeed.locationRight == 0) {
			$scope.variableSpeed.locationRight = 1;
		} else {
			$scope.variableSpeed.locationRight = 0
		}
	};
	$scope.changeLocationTop = function () {
		if ($scope.variableSpeed.locationTop == 0) {
			$scope.variableSpeed.locationTop = 1;
		} else {
			$scope.variableSpeed.locationTop = 0
		}
	};

	$scope.save = function () {
		objCtrl.data.location = bin2dec($scope.variableSpeed.locationLeft + '' + $scope.variableSpeed.locationRight + '' + $scope.variableSpeed.locationTop);
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
		var objId = parseInt($scope.variableSpeed.pid);
		var param = {
			"command": "DELETE",
			"type": "RDELECTRONICEYE",
			"dbId": App.Temp.dbId,
			"objId": objId
		};
		dsEdit.save(param).then(function (data) {
			var info = null;
			if (data) {
				$scope.variableSpeed = null;
				relationData.redraw();
			}
		})
	};
	$scope.cancel = function () {
	};
    //
    if (objCtrl.data) {
        $scope.initializeData();
    }
	eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
	eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
	eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
	eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);