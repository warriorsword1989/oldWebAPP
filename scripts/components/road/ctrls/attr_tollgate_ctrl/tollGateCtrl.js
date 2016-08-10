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
	var json = {
		pid:123,
		inLinkPid:123,
		outLinkPid:123,
		nodePid:123,
		type:3,
		passageNum:2,
		etcFigureCode:32433,
		locationFlag:1,
		passages:[{
			pid:12345,
			seqNum:1234,
			tollForm:3,
			cardType:1,
			vehicle:5
		},{
			pid:123456,
			seqNum:1234,
			tollForm:2,
			cardType:3,
			vehicle:5
		},{
			pid:1234567,
			seqNum:1234,
			tollForm:4,
			cardType:2,
			vehicle:5
		}],
		names:[{
			nameId:10004,
			pid:10004,
			nameGroupid:18,
			langCode:'CHI',
			name:'收费站1',
			phonetic:'Shou Fei Zhan'
		},{
			nameId:10005,
			pid:10005,
			nameGroupid:18,
			langCode:'CHI',
			name:'收费站2',
			phonetic:'Shou Fei Zhan'
		},{
			nameId:10005,
			pid:10005,
			nameGroupid:18,
			langCode:'CHI',
			name:'收费站3',
			phonetic:'Shou Fei Zhan'
		}]
	};
	$scope.initializeData = function () {
		// objCtrl.setOriginalData(objCtrl.data.getIntegrate());
		// $scope.tollGateData = objCtrl.data;
		objCtrl.setOriginalData(fastmap.dataApi.rdTollgate(json));
		$scope.tollGateData = fastmap.dataApi.rdTollgate(json);
		objCtrl.setCurrentObject("RDTOLLGATE", fastmap.dataApi.rdTollgate(json));
		var highLightFeatures = [];
		/*highLightFeatures.push({
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
		});*/
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

	/*查看详情*/
	$scope.showDetail = function(type,index) {
		var tempCtr = '', tempTepl = '',detailInfo = {};
		if(type == 'name') {
			tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollgateNameCtrl';
			tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_Tpl/tollgateNameTpl.html';
			detailInfo = {
				"loadType": "subAttrTplContainer",
				"propertyCtrl": tempCtr,
				"propertyHtml": tempTepl,
				"data":$scope.tollGateData.names[index]
			};
			objCtrl.namesInfo = $scope.tollGateData.names[index];
		} else {
			tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollgatePassageCtrl';
			tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_Tpl/tollgatePassageTpl.html';
			detailInfo = {
				"loadType": "subAttrTplContainer",
				"propertyCtrl": tempCtr,
				"propertyHtml": tempTepl,
				"data":$scope.tollGateData.passages[index]
			};
			objCtrl.passageInfo = $scope.tollGateData.passages[index];
		}
		$scope.tollGateNameData = detailInfo;
		$scope.$emit("transitCtrlAndTpl", detailInfo);
	};
	/*收费站类型*/
	$scope.tollTypeObj = [
		{id:0,label:'未调查'},
		{id:1,label:'领卡'},
		{id:2,label:'交卡付费'},
		{id:3,label:'固定收费（次费）'},
		{id:4,label:'交卡付费后再领卡'},
		{id:5,label:'交卡付费并代收固定费用'},
		{id:6,label:'验票（无票收费）值先保留'},
		{id:7,label:'领卡并代收固定费用'},
		{id:8,label:'持卡达标识不收费'},
		{id:9,label:'验票领卡'},
		{id:10,label:'交卡不收费'}
	];
	
	/*是否跨省*/
	$scope.locationFlagObj = {
		0:'未调查',
		1:'本省',
		2:'跨省'
	};

	/*领卡类型*/
	$scope.cardTypeObj = [
		{id:0,label:'未调查',name:'未调查'},
		{id:1,label:'ETC',name:'ETC通道'},
		{id:2,label:'人工',name:'人工通道'},
		{id:3,label:'自助',name:'自助通道'}
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

	$scope.vehicleOptions = [
		{"id": 0, "label": "客车(小汽车)","checked":false},
		{"id": 1, "label": "配送卡车","checked":false},
		{"id": 2, "label": "运输卡车","checked":false},
		{"id": 3, "label": "步行车","checked":false},
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
		{"id": 20, "label": "载有其他污染品的车辆","checked":false},
		{"id": 21, "label": "电车","checked":false},
		{"id": 22, "label": "轻轨","checked":false},
		{"id": 23, "label": "校车","checked":false},
		{"id": 24, "label": "四轮驱动车","checked":false},
		{"id": 25, "label": "装有防雪链的车","checked":false},
		{"id": 26, "label": "邮政车","checked":false},
		{"id": 27, "label": "槽罐车","checked":false},
		{"id": 28, "label": "残疾人车","checked":false}
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