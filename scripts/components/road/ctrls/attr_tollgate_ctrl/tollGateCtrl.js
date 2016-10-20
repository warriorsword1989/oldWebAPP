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
		$scope.nameGroup = [];
		$scope.deleteNames = [];
		initNameInfo();
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
	// 刷新tollGateData.names
	$scope.refreshNames = function(){
		$scope.tollGateData.names = [];
		for(var i=0,len=$scope.nameGroup.length;i<len;i++){
			for(var j=0,le=$scope.nameGroup[i].length;j<le;j++){
				$scope.tollGateData.names.push($scope.nameGroup[i][j]);
			}
		}

	};
	function initNameInfo(){
		if($scope.tollGateData.names.length > 0){
			$scope.nameGroup = [];
			/*根据数据中对象某一属性值排序*/
			function compare(propertyName) {
				return function (object1, object2) {
					var value1 = object1[propertyName];
					var value2 = object2[propertyName];
					if (value2 < value1) {
						return -1;
					}
					else if (value2 > value1) {
						return 1;
					}
					else {
						return 0;
					}
				}
			}
			$scope.tollGateData.names.sort(compare('nameGroupid'));
			//获取所有的nameGroupid
            var nameGroupidArr = [];
            for(var i = 0;i< $scope.tollGateData.names.length;i++){
            	nameGroupidArr.push($scope.tollGateData.names[i].nameGroupid);
            }
            //去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
			for(var i=0,len=nameGroupidArr.length;i<len;i++){
				var tempArr = [];
				for(var j=0,le=$scope.tollGateData.names.length;j<le;j++){
					if($scope.tollGateData.names[j].nameGroupid == nameGroupidArr[i]){
						tempArr.push($scope.tollGateData.names[j]);
					}
				}
				$scope.nameGroup.push(tempArr);
			}
//			for(var i=0,len=$scope.tollGateData.names[0].nameGroupid;i<len;i++){
//				var tempArr = [];
//				for(var j=0,le=$scope.tollGateData.names.length;j<le;j++){
//					if($scope.tollGateData.names[j].nameGroupid == i+1){
//						tempArr.push($scope.tollGateData.names[j]);
//					}
//				}
//				if(tempArr.length !=0){
//					$scope.nameGroup.push(tempArr);
//				}
//			}
			$scope.refreshNames();
		}
	}
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
				$scope.tollGateData.passages[i]['tollForm'] = 2;
			}
		} else if ($scope.tollGateData.type == 0) {
			for (var i = 0, len = $scope.tollGateData.passages.length; i < len; i++) {
				$scope.tollGateData.passages[i]['cardType'] = 0;
				$scope.tollGateData.passages[i]['tollForm'] = 0;
			}
		}
		$scope.changeEtcCode();
		$scope.$emit('SWITCHCONTAINERSTATE', {
			'subAttrContainerTpl': false,
			'attrContainerTpl': true
		});
	};
	$scope.$watch($scope.nameGroup,function(newValue,oldValue,scope){
		$scope.refreshNames();
	});
	/*查看详情*/
	$scope.showDetail = function (type, index ,nameInfo,nameGroupid) {
		var tempCtr = '', tempTepl = '', detailInfo = {};
		if (type == 'name') {
//			tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollGateNameCtrl';
//			tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_tpl/tollGateNameTpl.html';
//			detailInfo = {
//				"loadType": "subAttrTplContainer",
//				"propertyCtrl": tempCtr,
//				"propertyHtml": tempTepl,
//				"data": $scope.nameGroup[nameGroupid-1]
//			};
			var showNameInfoObj = { //这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
				"loadType": "subAttrTplContainer",
				"propertyCtrl": 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
				"propertyHtml": '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
				"callback": function () {
					var showNameObj = {
						"loadType": "subAttrTplContainer",
						"propertyCtrl": 'scripts/components/road/ctrls/attr_tollgate_ctrl/tollGateNameCtrl',
						"propertyHtml": '../../../scripts/components/road/tpls/attr_tollgate_tpl/tollGateNameTpl.html'
					};
					$scope.$emit("transitCtrlAndTpl", showNameObj);
				}
			};
			objCtrl.namesInfos = $scope.nameGroup[nameGroupid-1];
			$scope.$emit("transitCtrlAndTpl", showNameInfoObj);
		} else {
			tempCtr = appPath.road + 'ctrls/attr_tollgate_ctrl/tollGatePassageCtrl';
			tempTepl = appPath.root + appPath.road + 'tpls/attr_tollgate_tpl/tollGatePassageTpl.html';
			detailInfo = {
                "loadType": "subAttrTplContainer",
                "propertyCtrl": tempCtr,
                "propertyHtml": tempTepl,
                "data": $scope.tollGateData.passages[index]
            };
			objCtrl.passageInfo = $scope.tollGateData.passages[index];
			$scope.$emit("transitCtrlAndTpl", detailInfo);
		}
		$scope.tollGateNameData = detailInfo;
		// objCtrl.setOriginalData(objCtrl.data.getIntegrate());
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
					if ($scope.tollGateData.passages[i]['tollForm'] == 1) {
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
							if($scope.tollGateData.passages[j-1]['tollForm'] == 1){
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
							if($scope.tollGateData.passages[i-1]['tollForm'] == 1){
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
							if($scope.tollGateData.passages[i-1]['tollForm'] == 1){
								if(i<_times+2){
									_left = 1;
								}else if(i < ((passageLen+1)/3)*2 ){
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
			$scope.refreshNames();
			var maxNameGroupId = 0;
			if($scope.tollGateData.names.length>0){
				maxNameGroupId = Utils.getArrMax($scope.tollGateData.names,'nameGroupid');
			}
			objCtrl.data.names.push(fastmap.dataApi.rdTollgateName({nameGroupid:maxNameGroupId+1}));
			initNameInfo();
		} else {
			if (objCtrl.data.passages.length < 32) {
				if($scope.tollGateData.type == 1 || $scope.tollGateData.type == 8 || $scope.tollGateData.type == 9 || $scope.tollGateData.type == 10){
					objCtrl.data.passages.push(fastmap.dataApi.rdTollgatePassage({cardType:2,tollForm:0,seqNum:$scope.tollGateData.passages.length+1}));
				}else if($scope.tollGateData.type == 2 || $scope.tollGateData.type == 3 || $scope.tollGateData.type == 4 || $scope.tollGateData.type == 5 || $scope.tollGateData.type == 6 || $scope.tollGateData.type == 7){
					objCtrl.data.passages.push(fastmap.dataApi.rdTollgatePassage({cardType:0,tollForm:2,seqNum:$scope.tollGateData.passages.length+1}));
				}else if($scope.tollGateData.type == 0){
					objCtrl.data.passages.push(fastmap.dataApi.rdTollgatePassage({seqNum:$scope.tollGateData.passages.length+1}));
				}
				$scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
				$scope.showDetail('passage',0);
			}
		}
		$scope.tollGateData.passageNum = $scope.tollGateData.passages.length;
	};
	/*移除item*/
	$scope.removeItem = function (index, type ,item) {
		if (type == 'name') {
			for(var i=0,len=$scope.nameGroup.length;i<len;i++){
				if($scope.nameGroup[i]){
					for(var j=0,le=$scope.nameGroup[i].length;j<le;j++){
						if($scope.nameGroup[i][j] === item){
							if(item.nameId != 0){
								var tempDel = {
									rowId:item.rowId,
									objStatus:'DELETE'
								};
								$scope.deleteNames.push(tempDel);
							}
							if($scope.nameGroup[i].length == 1){
								$scope.nameGroup.splice(i,1);
								for(var n=0,nu=$scope.nameGroup.length;n<nu;n++){
									if(n >= i){
										for(var m=0,num=$scope.nameGroup[n].length;m<num;m++){
											$scope.nameGroup[n][m].nameGroupid--;
										}
									}
								}
							}else{
								$scope.nameGroup[i].splice(index,1);
							}
						}
					}
				}
			}
			$scope.refreshNames();
		} else {
			$scope.tollGateData.passages.splice(index, 1);
			$scope.tollGateData.etcFigureCode = $scope.changeEtcCode();
			for(var i=index,len=$scope.tollGateData.passages.length;i<len;i++){
				$scope.tollGateData.passages[i].seqNum--;
			}
		}
		$scope.tollGateData.passageNum = $scope.tollGateData.passages.length;
		$scope.$emit('SWITCHCONTAINERSTATE', {
			'subAttrContainerTpl': false,
			'attrContainerTpl': true
		});
	};
	// 保存前把nameId为0的状态改为INSERT
	$scope.beforeSave = function(obj){
		var newObj = obj;
		for (var i = 0; i < newObj.names.length; i++) {
			if(newObj.names[i].nameId === 0){
				newObj.names[i].objStatus = 'INSERT';
			}
			if(!newObj.names[i].objStatus){
				newObj.names[i].objStatus = 'UPDATE';
			}
			delete newObj.names[i]['$$hashKey'];
			delete newObj.names[i]['_initHooksCalled'];
			delete newObj.names[i]['geoLiveType'];
		}
		return newObj;
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
		{id: 8, label: '持卡打标识不收费'},
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
		{"id": "EST", "label": "爱沙尼亚语"},
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
		{"id": "RUM", "label": "罗马尼亚语"},
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
		$scope.refreshNames();
		objCtrl.save();
		if (!objCtrl.changedProperty) {
			swal("操作成功", '属性值没有变化！', "success");
			return;
		}
		objCtrl.changedProperty.names = objCtrl.data.names.concat($scope.deleteNames);
		var param = {
			"command": "UPDATE",
			"type": "RDTOLLGATE",
			"dbId": App.Temp.dbId,
			"data": $scope.beforeSave(objCtrl.changedProperty)
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
				// swal("操作成功", "修改收费站成功！", "success");
				$('body .carTypeTip:last').hide();
				$scope.$emit('SWITCHCONTAINERSTATE', {
					'subAttrContainerTpl': false,
					'attrContainerTpl': true
				});
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
