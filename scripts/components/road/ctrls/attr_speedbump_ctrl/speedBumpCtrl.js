/**
 * Created by wangmingdong on 2016/8/5.
 */

var rdElectronicEyeApp = angular.module("app");
rdElectronicEyeApp.controller("SpeedBumpCtl", ['$scope', 'dsEdit', function ($scope, dsEdit) {
	var layerCtrl = fastmap.uikit.LayerController();
	var objCtrl = fastmap.uikit.ObjectEditController();
	var eventController = fastmap.uikit.EventController();
	var relationData = layerCtrl.getLayerById('relationData');
	var selectCtrl = fastmap.uikit.SelectController();
	var highRenderCtrl = fastmap.uikit.HighRenderController();
	$scope.initializeData = function () {
		objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		$scope.speedBumpData = objCtrl.data;
		var highLightFeatures = [];
		highLightFeatures.push({
			id: $scope.speedBumpData.linkPid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				size: 5
			}
		});
		highLightFeatures.push({
			id: $scope.speedBumpData.nodePid.toString(),
			layerid: 'rdLink',
			type: 'node',
			style: {
				color: 'yellow'
			}
		});
		highRenderCtrl.highLightFeatures = highLightFeatures;
		highRenderCtrl.drawHighlight();

	};
	$scope.initializeData();
	$scope.refreshData = function () {
		dsEdit.getByPid(parseInt($scope.speedBumpData.pid), "RDSPEEDBUMP").then(function (data) {
			if (data) {
				objCtrl.setCurrentObject("RDSPEEDBUMP", data);
				$scope.initializeData();
			}
		});
	};

	$scope.save = function () {
		objCtrl.save();
		if (!objCtrl.changedProperty) {
			swal("操作成功", '属性值没有变化！', "success");
			return;
		}
		var param = {
			"command": "UPDATE",
			"type": "RDSPEEDBUMP",
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
				swal("操作成功", "修改减速带成功！", "success");
			}
			$scope.refreshData();
		})
	};

	$scope.delete = function () {
		var objId = parseInt($scope.speedBumpData.pid);
		var param = {
			"command": "DELETE",
			"type": "RDSPEEDBUMP",
			"dbId": App.Temp.dbId,
			"objId": objId
		};
		dsEdit.save(param).then(function (data) {
			var info = null;
			if (data) {
				$scope.speedBumpData = null;
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