/**
 * Created by wangmingdong on 2016/8/5.
 */

var rdElectronicEyeApp = angular.module("app");
rdElectronicEyeApp.controller("DirectRouteCtl", ['$scope', 'dsEdit', function ($scope, dsEdit) {
	var layerCtrl = fastmap.uikit.LayerController();
	var objCtrl = fastmap.uikit.ObjectEditController();
	var eventController = fastmap.uikit.EventController();
	var relationData = layerCtrl.getLayerById('relationData');
	var selectCtrl = fastmap.uikit.SelectController();
	var highRenderCtrl = fastmap.uikit.HighRenderController();
	$scope.initializeData = function () {
		objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		$scope.directRouteData = objCtrl.data;
		var highLightFeatures = [];
		highLightFeatures.push({
			id: $scope.directRouteData.inLinkPid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				color: '#21ed25'
			}
		});
		highLightFeatures.push({
			id: $scope.directRouteData.outLinkPid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				size: 5
			}
		});
		highLightFeatures.push({
			id: $scope.directRouteData.nodePid.toString(),
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
		dsEdit.getByPid(parseInt($scope.directRouteData.pid), "RDDIRECTROUTE").then(function (data) {
			if (data) {
				objCtrl.setCurrentObject("RDDIRECTROUTE", data);
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
			"type": "RDDIRECTROUTE",
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
			}
			$scope.refreshData();
		})
	};

	$scope.delete = function () {
		var objId = parseInt($scope.directRouteData.pid);
		var param = {
			"command": "DELETE",
			"type": "RDDIRECTROUTE",
			"dbId": App.Temp.dbId,
			"objId": objId
		};
		dsEdit.save(param).then(function (data) {
			var info = null;
			if (data) {
				$scope.directRouteData = null;
				relationData.redraw();
				highRenderCtrl._cleanHighLight();
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