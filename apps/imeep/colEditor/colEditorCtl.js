angular.module('app', ['oc.lazyLoad', 'fastmap.uikit', 'ui.layout', 'ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap', 'ngSanitize']).constant("appPath", {
	root: App.Util.getAppPath() + "/",
	meta: "scripts/components/meta/",
	road: "scripts/components/road/",
	poi: "scripts/components/poi/",
	column: "scripts/components/column/",
	tool: "scripts/components/tools/"
}).controller('ColEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsMeta', 'dsFcc', 'dsEdit', 'dsManage', '$q', 'appPath', '$timeout',
	function ($scope, $ocLazyLoad, $rootScope, dsMeta, dsFcc, dsEdit, dsManage, $q, appPath, $timeout) {
		var eventCtrl = new fastmap.uikit.EventController();
		$scope.showLoading = true;
		$timeout(function (){
			$scope.showLoading = false;
		},1000);

		$scope.appPath = appPath;
		$scope.metaData = {}; //存放元数据
		$scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};
		
		$scope.menus = {
			'chinaName':'中文名称',
			'chinaAddress':'中文地址',
			'englishName':'英文名称',
			'englishAddress':'英文地址'
		};
		$scope.names = {
			"chinaName":[{'text':'中文名称统一','worked':20,'count':30,'id':'nameUnify'},
				{'text':'中文简称作业','worked':20,'count':30,'id':'shortName'},
				{'text':'中文拼音作业','worked':10,'count':20,'id':'namePinyin'}],
			"chinaAddress":[{'text':'中文地址','worked':20,'count':30,'id':'addrSplit'},
				{'text':'中文拼音作业','worked':20,'count':30,'id':'addrPinyin'}],
			"englishName":[{'text':'照片录入英文名','worked':20,'count':30,'id':'photoEngName'},
				{'text':'中文即是英文','worked':20,'count':30,'id':'chiEngName'},
				{'text':'人工确认英文名','worked':10,'count':20,'id':'confirmEngName'},
				{'text':'官方标准英文名','worked':20,'count':30,'id':'officalStandardEngName'},
				{'text':'非重要分类英文超长','worked':10,'count':20,'id':'nonImportantLongEngName'}
			],
			"englishAddress":[{'text':'重要分类地址英文作业','worked':20,'count':30,'id':'engMapAddress'},
				{'text':'非重要分类地址英文超长作业','worked':20,'count':30,'id':'nonImportantLongEngAddress'}]
		};
//		$scope.nameType = 'chinaAddress'; //默认显示中文地址
//		$scope.menuSelectedId = 'addrSplit';
		$scope.nameType = App.Util.getUrlParam("workItem");
		if($scope.nameType == 'chinaAddress'){
			$scope.menuSelectedId = 'addrSplit';
		}else if($scope.nameType == 'chinaName'){
			$scope.menuSelectedId = 'nameUnify';
		}


		$scope.changeMenu = function (id){
			$scope.menuSelectedId = id;
			if($scope.menuSelectedId == 'nameUnify'){
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaName/nameUnifyCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaName/nameUnifyTpl.html';
					$scope.showLoading = false;
				});
			} else if($scope.menuSelectedId == 'addrSplit') {
				$ocLazyLoad.load(appPath.column + 'ctrls/chinaAddressCtl').then(function () {
					$scope.columnListTpl = appPath.root + appPath.column + 'tpls/chinaAddressTpl.html';
					$scope.showLoading = false;
				});
			}
		};

		$scope.initPage = function (){
			$scope.changeMenu($scope.menuSelectedId);
		};
		$scope.initPage();






		/*切换项目平台*/
		$scope.changeProject = function (type) {
			$scope.showLoading = true;
			$scope.showPopoverTips = false;
			$scope.tipsPanelOpened = false;
			if (type == 1) { //poi
				$ocLazyLoad.load(appPath.poi + 'ctrls/attr-base/poiDataListCtl').then(function () {
					$scope.dataListTpl = appPath.root + appPath.poi + 'tpls/attr-base/poiDataListTpl.html';
					$scope.showLoading = false;
				});
			} else { //道路
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/filedsResultCtrl').then(function () {
					$scope.dataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/filedsResultTpl.html';
					$scope.showLoading = false;
				});
			}
			$scope.projectType = type;
		};
		$scope.selectedTool = 1;
		//切换成果-场景栏中的显示内容
		$scope.changeEditTool = function (id) {
			if (id === "tipsPanel") {
				$scope.showTab = true;
				$scope.selectedTool = 1;
				$scope.changeProject($scope.projectType);
			} else if (id === "scenePanel") {
				$scope.showTab = false;
				$scope.selectedTool = 2;
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/sceneLayersCtrl').then(function () {
					$scope.dataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/sceneLayers.html';
				});
			}
		};
		//属性栏开关逻辑控制
		$scope.attrTplContainerSwitch = function (flag) {
			if (flag) {
				$scope.editorPanelOpened = flag;
			} else {
				$scope.editorPanelOpened = 'none';
			}
		};
		//次属性开关逻辑控制
		$scope.subAttrTplContainerSwitch = function (flag) {
			$scope.suspendPanelOpened = flag;
		}
		$scope.changeProperty = function (val) {
			$scope.propertyType = val;
		};
		$scope.changeOutput = function (val) {
			$scope.outputType = val;
		};
		/*关闭全屏查看*/
		$scope.closeFullScreen = function () {
			$scope.showFullScreen = false;
		};
		/*隐藏tips图片*/
		$scope.hideFullPic = function () {
			$scope.roadFullScreen = false;
		};
		/**
		 * 工具按钮控制
		 */
		$scope.classArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; //按钮样式的变化
		$scope.changeBtnClass = function (id) {
			$scope.$broadcast("resetButtons", {});
			$timeout(function () { //为了解决按esc键后工具条按钮不能恢复的bug
				$scope.$apply();
			}, 1);
		};


		// 加载元数据
		var loadMetaData = function () {
			var promises = [];
			// 查询全部的小分类数据
			var param = {
				mediumId: "",
				region: 0
			};
			promises.push(dsMeta.getKindList(param).then(function (kindData) {
				//在数组最前面增加
				kindData.unshift({
					"id": "0",
					"kindCode": "0",
					"kindName": "--请选择--"
				});
				/*解析分类，组成select-chosen需要的数据格式*/
				for (var i = 0; i < kindData.length; i++) {
					/**
					 * 需要排除充电桩、充电站,中分类需要查询再定
					 **/
					$scope.metaData.kindFormat[kindData[i].kindCode] = {
						kindId: kindData[i].id,
						kindName: kindData[i].kindName,
						level: kindData[i].level,
						extend: kindData[i].extend,
						parentFlag: kindData[i].parent,
						chainFlag: kindData[i].chainFlag,
						dispOnLink: kindData[i].dispOnLink,
						mediumId: kindData[i].mediumId
					};
					$scope.metaData.kindList.push({
						value: kindData[i].kindCode,
						text: kindData[i].kindName,
						mediumId: kindData[i].mediumId
					});
				}
			}));
			// 查询全部的品牌数据
			param = {
				kindCode: ""
			};
			promises.push(dsMeta.getChainList(param).then(function (chainData) {
				$scope.metaData.allChain = chainData;
			}));
			return promises;
		};
		var loadToolsPanel = function (callback) {
			$ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar-map/toolbarCtrl.js').then(function () {
				$scope.mapToolbar = appPath.root + 'scripts/components/tools/tpls/toolbar-map/toolbarTpl.htm';
				if (callback) {
					callback();
				}
			});
			$ocLazyLoad.load(appPath.poi + 'ctrls/edit-tools/optionBarCtl').then(function () {
				$scope.consoleDeskTpl = appPath.root + appPath.poi + 'tpls/edit-tools/optionBarTpl.html';
			});
		};
		//页面初始化方法调用
		var initPage = function () {
			//$scope.changeProject(1);
			// var subtaskId = App.Util.getUrlParam("subtaskId");
			// App.Temp.subTaskId = subtaskId;
			// dsManage.getSubtaskById(subtaskId).then(function (data) {
			// 	if (data) {
			// 		// 暂时注释
			// 		App.Temp.dbId = data.dbId;
			// 		App.Temp.gridList = data.gridIds;
			// 		if (data.stage == 1) { // 日编
			// 			App.Temp.mdFlag = "d";
			// 		} else if (data.stage == 2) { // 月编
			// 			App.Temp.mdFlag = "m";
			// 		} else { // 默认：日编
			// 			App.Temp.mdFlag = "d";
			// 		}
			// 		var promises = loadMetaData();
			// 		$q.all(promises).then(function () {
			// 			loadToolsPanel(function () {
			// 				if (data.type == 0) { // POI任务
			// 					$scope.changeProject(1);
			// 				} else { // 一体化、道路、专项任务
			// 					$scope.changeProject(2);
			// 				}
			// 				//bindHotKeys($ocLazyLoad, $scope, dsEdit, appPath); //注册快捷键
			// 			});
			// 		});
			// 	}
			// });
		};

		/**
		 * 页面初始化方法调用
		 */
		initPage();
		/**
		 * 保存数据
		 */
		$scope.doSave = function () {
			eventCtrl.fire(eventCtrl.eventTypes.SAVEPROPERTY);
		};
		/**
		 * 删除数据
		 */
		$scope.doDelete = function () {
			swal({
				title: "确认删除？",
				type: "warning",
				animation: 'slide-from-top',
				showCancelButton: true,
				closeOnConfirm: true,
				confirmButtonText: "是的，我要删除",
				cancelButtonText: "取消"
			}, function (f) {
				if (f) {
					eventCtrl.fire(eventCtrl.eventTypes.DELETEPROPERTY);
				}
			});
		};
		/**
		 * 取消编辑
		 */
		$scope.doCancel = function () {
			$scope.tipsPanelOpened = false;
			$scope.attrTplContainerSwitch(false);
		};
		$scope.goback = function () {
			window.location.href = appPath.root + "apps/imeep/task/taskSelection.html?access_token=" + App.Temp.accessToken;
		};
		$scope.advancedTool = null;
		/*监听弹窗*/
		$scope.$on('openModelEvent', function (event, data) {
			$scope.openAdvancedToolsPanel(data);
		});
		$scope.openAdvancedToolsPanel = function (toolType) {
			if ($scope.advancedTool == toolType) {
				return;
			}
			switch (toolType) {
				case 'search':
					$ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/searchPanelCtrl').then(function () {
						$scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
					});
					// $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
					break;
			}
			$scope.advancedTool = toolType;
		};
		$scope.closeAdvancedToolsPanel = function () {
			$scope.advancedTool = null;
		};
		/*start 事件监听*******************************************************************/
		//响应选择要素类型变化事件，清除要素页面的监听事件
		eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURETYPECHANGE, function (data) {
			if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY]) {
				for (var i = 0, len = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY].length; i < len; i++) {
					eventCtrl.off(eventCtrl.eventTypes.SAVEPROPERTY, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY][i]);
				}
			}
			if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.DELETEPROPERTY]) {
				for (var j = 0, lenJ = eventCtrl.eventTypesMap[eventCtrl.eventTypes.DELETEPROPERTY].length; j < lenJ; j++) {
					eventCtrl.off(eventCtrl.eventTypes.DELETEPROPERTY, eventCtrl.eventTypesMap[eventCtrl.eventTypes.DELETEPROPERTY][j]);
				}
			}
			if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.CANCELEVENT]) {
				for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SAVEPROPERTY].length; k < lenK; k++) {
					eventCtrl.off(eventCtrl.eventTypes.CANCELEVENT, eventCtrl.eventTypesMap[eventCtrl.eventTypes.CANCELEVENT][k]);
				}
			}
			if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTEDFEATURECHANGE]) {
				for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTEDFEATURECHANGE].length; k < lenK; k++) {
					eventCtrl.off(eventCtrl.eventTypes.SELECTEDFEATURECHANGE, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTEDFEATURECHANGE][k]);
				}
			}
		});
		/**
		 * 监听要素类型切换事件
		 */
		$scope.$on("SWITCHCONTAINERSTATE", function (event, data) {
			if (data.hasOwnProperty("attrContainerTpl")) {
				$scope.attrTplContainerSwitch(data["attrContainerTpl"]);
			}
			if (data.hasOwnProperty("subAttrContainerTpl")) {
				$scope.subAttrTplContainerSwitch(data["subAttrContainerTpl"]);
			}
		});
		/**
		 * 监听组件加载请求事件
		 */
		$scope.$on("transitCtrlAndTpl", function (event, data) {
			if (data["loadType"] === "subAttrTplContainer") {
				$scope.subAttrTplContainerSwitch(true);
				// $scope.subAttrTplContainer = "";
			} else if (data["loadType"] === "attrTplContainer") { //右边属性面板
				$scope.attrTplContainerSwitch(true);
				// $scope.attrTplContainer = "";
			} else if (data["loadType"] === "tipsTplContainer") {
				if ($scope["tipsTplContainer"] != data["propertyHtml"]) { // tips页面切换，取消原来的SELECTBYATTRIBUTE事件绑定
					if (eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE]) {
						for (var k = 0, lenK = eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE].length; k < lenK; k++) {
							eventCtrl.off(eventCtrl.eventTypes.SELECTBYATTRIBUTE, eventCtrl.eventTypesMap[eventCtrl.eventTypes.SELECTBYATTRIBUTE][k]);
						}
					}
				}
				// $scope.attrTplContainer = "";
				$scope.tipsPanelOpened = true;
			} else if (data["loadType"] === "tipsPitureContainer") {
				if ($scope[data["loadType"]]) {
					$scope.$broadcast("TRANSITTIPSPICTURE", {})
					return;
				}
			} else if (data["loadType"] === "tipsVideoContainer") {
				if ($scope[data["loadType"]]) {
					$scope.$broadcast("TRANSITTIPSVIDEO", {})
					return;
				}
			} else if (data["loadType"] === 'sameRelationShapTplContainer') {

			}
			if (data["data"]) {
				$scope.subAttributeData = data["data"];
			}
			$ocLazyLoad.load(data["propertyCtrl"]).then(function () {
				$scope[data["loadType"]] = data["propertyHtml"];
				if (data["callback"]) {
					data["callback"]();
				}
			});
			if (data['data'] && data['data'].geoLiveType == 'RDTOLLGATENAME') {
				$scope.$broadcast('refreshTollgateName', {});
			}
			if (data['data'] && data['data'].geoLiveType == 'RDTOLLGATEPASSAGE') {
				$scope.$broadcast('refreshTollgatePassage', {});
			}
			//刷新二级菜单
			if (data["type"] == "refreshPage") {
				$scope.$broadcast('refreshPage', {});
			}
		});
		//清除表单修改后的样式
		$scope.$on("clearAttrStyleUp", function (event, data) {
			$scope.$broadcast("clearAttrStyleDown");
		});
	}
]);
