/**
 * Created by wangmingdong on 2016/8/5.
 */
angular.module("app").controller("TollGateCtl", ['$scope', 'dsEdit', 'appPath', function ($scope, dsEdit, appPath) {
	var layerCtrl = fastmap.uikit.LayerController();
	var objCtrl = fastmap.uikit.ObjectEditController();
	var eventController = fastmap.uikit.EventController();
	var relationData = layerCtrl.getLayerById('relationData');
	var selectCtrl = fastmap.uikit.SelectController();
	var highRenderCtrl = fastmap.uikit.HighRenderController();

	$scope.initializeData = function () {
		objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		$scope.tollGateData = objCtrl.data;
		var highLightFeatures = [];
		highLightFeatures.push({
			id: $scope.tollGateData.inLinkPid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				color: '#21ed25'
			}
		});
		highLightFeatures.push({
			id: $scope.tollGateData.outLinkPid.toString(),
			layerid: 'rdLink',
			type: 'line',
			style: {
				size: 5
			}
		});
		highLightFeatures.push({
			id: $scope.tollGateData.nodePid.toString(),
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
		dsEdit.getByPid(parseInt($scope.tollGateData.pid), "RDTOLLGATE").then(function (data) {
			if (data) {
				objCtrl.setCurrentObject("RDTOLLGATE", data);
				$scope.initializeData();
			}
		});
	};

	/*切换收费类型*/
	$scope.changeChargeType = function () {
		if ($scope.tollGateData.type == 1 || $scope.tollGateData.type == 8 || $scope.tollGateData.type == 9 || $scope.tollGateData.type == 10) {
			for (var i = 0, len = $scope.tollGateData.passages.length; i < len; i++) {
				$scope.tollGateData.passages[i]['cardType'] = 2;
				$scope.tollGateData.passages[i]['tollForm'] = 0;
			}
		} else if ($scope.tollGateData.type == 2 || $scope.tollGateData.type == 3 || $scope.tollGateData.type == 4 || $scope.tollGateData.type == 5 || $scope.tollGateData.type == 6 || $scope.tollGateData.type == 7) {
			for (var i = 0, len = $scope.tollGateData.passages.length; i < len; i++) {
				$scope.tollGateData.passages[i]['cardType'] = 0;
				$scope.tollGateData.passages[i]['tollForm'] = 1;
			}
		}
		$scope.$emit('SWITCHCONTAINERSTATE', {
			'subAttrContainerTpl': false,
			'attrContainerTpl': true
		});
	};
	/*查看详情*/
	$scope.showDetail = function (type, index) {
		var tempCtr = '', tempTepl = '', detailInfo = {};
		if (type == 'name') {
			tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollgateNameCtrl';
			tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_Tpl/tollgateNameTpl.html';
			detailInfo = {
				"loadType": "subAttrTplContainer",
				"propertyCtrl": tempCtr,
				"propertyHtml": tempTepl,
				"data": $scope.tollGateData.names[index]
			};
			objCtrl.namesInfo = $scope.tollGateData.names[index];
		} else {
			tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollgatePassageCtrl';
			tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_Tpl/tollgatePassageTpl.html';
			detailInfo = {
				"loadType": "subAttrTplContainer",
				"propertyCtrl": tempCtr,
				"propertyHtml": tempTepl,
				"data": $scope.tollGateData.passages[index]
			};
			objCtrl.passageInfo = $scope.tollGateData.passages[index];
			objCtrl.tollGateType = $scope.tollGateData.type;
		}
		// objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		$scope.tollGateNameData = detailInfo;
		$scope.$emit("transitCtrlAndTpl", detailInfo);
	};
	/*自动计算ETC代码*/
	$scope.changeEtcCode = function () {
		var _code = '',
				passageLen = $scope.tollGateData.passages.length;
		if (passageLen == 0) {
			return _code;
		} else {
			if (passageLen < 6) {
				_code = 'T0' + passageLen;
				for (var i = 0, len = passageLen; i < len; i++) {
					if ($scope.tollGateData.passages[i]['cardType'] == 1) {
						_code += '1';
					} else {
						_code += '0';
					}
				}
				if (_code.length < 8) {
					for (var i = 0, len = 8 - _code.length; i < len; i++) {
						_code += '0';
					}
				}
				return _code;
			} else {
				_code = 'T00';
				var _times = Math.floor(passageLen/3),
						_left = 0,
						_middle = 0,
						_right = 0;
				if(passageLen%3 == 0){
					for (var i = 1; i <= passageLen; i+=_times) {
						for(var j=i;j<i+_times;j++){
							if($scope.tollGateData.passages[j-1]['cardType'] == 1){
								if(i < _times+1){
									_left = 1;
								}else if(i < passageLen-_times+1 ){
									_middle = 1;
								}else {
									_right = 1;
								}
							}
						}
					}
				}else if(passageLen%3 == 1){
					for(var i=1;i<=passageLen;i++){
							if($scope.tollGateData.passages[i-1]['cardType'] == 1){
								if(i<_times+1){
									_left = 1;
								}else if(i < passageLen-_times+1 ){
									_middle = 1;
								}else{
									_right = 1;
								}
							}
					}
				}else if(passageLen%3 == 2){
					for(var i=1;i<=passageLen;i++){
							if($scope.tollGateData.passages[i-1]['cardType'] == 1){
								if(i<_times+2){
									_left = 1;
								}else if(i < passageLen-_times+1 ){
									_middle = 1;
								}else{
									_right = 1;
								}
							}
					}
				}
				_code = _code + _left + _middle + _right + '00';
				return _code;
			}
		}
	};
	/*增加item*/
	$scope.addItem = function (type) {
		if (type == 'name') {
			objCtrl.data.names.push(fastmap.dataApi.rdTollgateName({}));
		} else {
			if (objCtrl.data.passages.length < 32) {
				objCtrl.data.passages.push(fastmap.dataApi.rdTollgatePassage({}));
				$scope.tollGateData.passageNum++;
				$scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
			}
		}
	};
	/*移除item*/
	$scope.removeItem = function (index, type) {
		if (type == 'name') {
			$scope.tollGateData.names.splice(index, 1);
		} else {
			$scope.tollGateData.passages.splice(index, 1);
			$scope.tollGateData.passageNum--;
			$scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
		}
		$scope.$emit('SWITCHCONTAINERSTATE', {
			'subAttrContainerTpl': false,
			'attrContainerTpl': true
		});
	};
	/*监听刷新ETC代码*/
	$scope.$on('refreshEtcCode', function (event, data) {
		$scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
	});
	/*收费站类型*/
	$scope.tollTypeObj = [
		{id: 0, label: '未调查'},
		{id: 1, label: '领卡'},
		{id: 2, label: '交卡付费'},
		{id: 3, label: '固定收费（次费）'},
		{id: 4, label: '交卡付费后再领卡'},
		{id: 5, label: '交卡付费并代收固定费用'},
		{id: 6, label: '验票（无票收费）值先保留'},
		{id: 7, label: '领卡并代收固定费用'},
		{id: 8, label: '持卡达标识不收费'},
		{id: 9, label: '验票领卡'},
		{id: 10, label: '交卡不收费'}
	];

	/*是否跨省*/
	$scope.locationFlagObj = {
		0: '未调查',
		1: '本省',
		2: '跨省'
	};

	/*领卡类型*/
	$scope.cardTypeObj = [
		{id: 0, label: '未调查', name: '未调查'},
		{id: 1, label: 'ETC', name: 'ETC通道'},
		{id: 2, label: '人工', name: '人工通道'},
		{id: 3, label: '自助', name: '自助通道'}
	];

	$scope.langCodeOptions = [
		{"id": "CHI", "label": "简体中文"},
		{"id": "CHT", "label": "繁体中文"},
		{"id": "ENG", "label": "英文"},
		{"id": "POR", "label": "葡萄牙文"},
		{"id": "ARA", "label": "阿拉伯语"},
		{"id": "BUL", "label": "保加利亚语"},
		{"id": "CZE", "label": "捷克语"},
		{"id": "DAN", "label": "丹麦语"},
		{"id": "DUT", "label": "荷兰语"},
		{"id": "FIN", "label": "芬兰语"},
		{"id": "FRE", "label": "法语"},
		{"id": "GER", "label": "德语"},
		{"id": "HIN", "label": "印地语"},
		{"id": "HUN", "label": "匈牙利语"},
		{"id": "ICE", "label": "冰岛语"},
		{"id": "IND", "label": "印度尼西亚语"},
		{"id": "ITA", "label": "意大利语"},
		{"id": "JPN", "label": "日语"},
		{"id": "KOR", "label": "韩语"},
		{"id": "LIT", "label": "立陶宛语"},
		{"id": "NOR", "label": "挪威语"},
		{"id": "POL", "label": "波兰语"},
		{"id": "RUM", "label": "罗马尼西亚语"},
		{"id": "RUS", "label": "俄语"},
		{"id": "SLO", "label": "斯洛伐克语"},
		{"id": "SPA", "label": "西班牙语"},
		{"id": "SWE", "label": "瑞典语"},
		{"id": "THA", "label": "泰国语"},
		{"id": "TUR", "label": "土耳其语"},
		{"id": "UKR", "label": "乌克兰语"},
		{"id": "SCR", "label": "克罗地亚语"}
	];

	$scope.save = function () {
		objCtrl.save();
		if (!objCtrl.changedProperty) {
			swal("操作成功", '属性值没有变化！', "success");
			return;
		}
		var param = {
			"command": "UPDATE",
			"type": "RDTOLLGATE",
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
				swal("操作成功", "修改收费站成功！", "success");
			}
			$scope.refreshData();
		})
	};

	$scope.delete = function () {
		var objId = parseInt($scope.tollGateData.pid);
		var param = {
			"command": "DELETE",
			"type": "RDTOLLGATE",
			"dbId": App.Temp.dbId,
			"objId": objId
		};
		dsEdit.save(param).then(function (data) {
			var info = null;
			if (data) {
				$scope.tollGateData = null;
				relationData.redraw();
				highRenderCtrl._cleanHighLight();
				$scope.$emit('SWITCHCONTAINERSTATE', {
					'subAttrContainerTpl': false,
					'attrContainerTpl': false
				});
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
