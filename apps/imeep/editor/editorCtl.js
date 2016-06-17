angular.module('app', ['oc.lazyLoad', 'ui.layout','ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap','ngSanitize'])
	.constant("appPath",{
		root : App.Util.getAppPath()+"/",
		meta : "scripts/components/meta/",
		road : "scripts/components/road3/",
		poi : "scripts/components/poi3/",
		tool : "scripts/components/tools/"
	}).constant('tipsType',fastmap.dataApi.TipsType)
	.controller('EditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', 'dsMeta', '$q', 'appPath',function ($scope, $ocLazyLoad, $rootScope, dsPoi, dsMeta, $q, appPath) {
	//属性编辑ctrl(解析对比各个数据类型)
	var layerCtrl = new fastmap.uikit.LayerController({config: App.layersConfig});
	var shapeCtrl = new fastmap.uikit.ShapeEditorController();
	var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
	var eventCtrl = new fastmap.uikit.EventController();
	var objectCtrl = fastmap.uikit.ObjectEditController();
	//高亮ctrl
	var highRenderCtrl = fastmap.uikit.HighRenderController();
	$scope.metaData = {}; //存放元数据
	$scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {};

	//$scope.show = true;
	//$scope.panelFlag = true;
	$scope.showLoading = true;
	$scope.suspendFlag = true;
	$scope.selectedTool = 1;
	$scope.dataListType = 1;
	$scope.projectType = 1;
	$scope.outputType = 1;
	$scope.hideConsole = true;
	$scope.hideEditorPanel = false;
	$scope.disappearEditorPanel = true;
	$scope.controlFlag = {};//用于父Scope控制子Scope
	$scope.outErrorArr = [false, true, true, false];//输出框样式控制
	$scope.outputResult = [];//输出结果




	/*切换项目平台*/
	$scope.changeProject = function(type){
		$scope.showLoading = true;
		if(type == 1){  //poi
			$ocLazyLoad.load(appPath.poi + 'ctrls/attr-base/poiDataListCtl').then(function () {
				$scope.poiDataListTpl =  appPath.root + appPath.poi + 'tpls/attr-base/poiDataListTpl.html';
				$scope.showLoading = false;
			});
		}else{      //道路
			$scope.poiDataListTpl = '';
			$ocLazyLoad.load( appPath.road + 'ctrls/layers_switch_ctrl/filedsResultCtrl').then(function () {
				$scope.poiDataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/filedsResultTpl.html';
				$scope.showLoading = false;
			});
		}
		$scope.projectType = type;
	};

	$scope.selectedTool = 1;
	//切换成果-场景栏中的显示内容
	$scope.changeEditTool = function (id) {
		changePoi(function () {
			if (id === "tipsPanel") {
				$scope.selectedTool = 1;
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/filedsResultCtrl').then(function () {
					$scope.poiDataListTpl =  appPath.root + appPath.road + 'tpls/layers_switch_tpl/fieldsResult.html';
				});
			} else if (id === "scenePanel") {
				$scope.selectedTool = 2;
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/sceneLayersCtrl').then(function () {
					$scope.poiDataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/sceneLayers.html';
				});
			} else if (id === "layerPanel") {
				$scope.selectedTool = 3;
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/referenceLayersCtrl').then(function () {
						$scope.poiDataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/referenceLayers.html';
					}
				);
			}
		})
	};
	$scope.$on("SWITCHCONTAINERSTATE", function (event, data) {
		if (data.hasOwnProperty("attrContainerTpl")) {
			$scope.attrTplContainerSwitch(data["attrContainerTpl"]);
		} else if (data.hasOwnProperty("subAttrContainerTpl")) {
			$scope.subAttrTplContainerSwitch(data["subAttrContainerTpl"]);
		}
	});
	//属性栏开关逻辑控制
	$scope.attrTplContainerSwitch = function (flag) {
		$scope.objectFlag = flag;
		if(flag){ //打开右边属性栏
			$scope.disappearEditorPanel = false;
			$scope.hideEditorPanel = true;
		}

		// if ($scope.panelFlag) {
        //
		// 	$scope.outErrorArr[3] = true;
		// 	$scope.outErrorArr[2] = false;
		// }
		// else {
		// 	$scope.attrTplContainer = "";
		// 	$scope.suspendFlag = false;
		// 	$scope.outErrorArr[2] = true;
		// 	$scope.outErrorArr[3] = false;
		// }
	};
	//次属性开关逻辑控制
	$scope.subAttrTplContainerSwitch = function (flag) {
		$scope.suspendFlag = flag;
	}

	$scope.changeProperty = function (val) {
		$scope.propertyType = val;
	};
	$scope.changeOutput = function (val) {
		$scope.outputType = val;
	};
	/**
	 * 显示poi基本信息，tips信息等
     */
	var showPoiInfo = function (data){
		$scope.$broadcast("clearBaseInfo"); //清除样式
		$scope.hideEditorPanel = true; //打开右侧面板

		specialDetail(data);//名称组和地址组特殊处理
		$scope.poi = data;
		$scope.origPoi = angular.copy(data);
		// $scope.$broadcast('initPoiPopoverTipsCtl');  //调用poiPopoverTipsCtl.js初始化方法
		// $scope.$broadcast('refreshImgsData',$scope.poi.photos);
		// /*查询3DIcon*/
		// dsMeta.getCiParaIcon(data.poiNum).then(function (data) {
		// 	$scope.poi.poi3DIcon = data;
		// });

		initOcll();
	}
	/*获取所选poi信息*/
	$scope.$on('getPoiList',function(event,data){
		$scope.poiList = data;
	});
	/*关闭tips*/
	$scope.$on('closePopoverTips',function(event,data){
		$scope.showPopoverTips = false;
	});
	/*获取输出结果信息*/
	$scope.$on('getConsoleInfo',function(event,data){
		$scope.outputResult.push(new FM.dataApi.IxOutput(data));
	});
	// $scope.checkPageNow = 1;
	/*高亮检查结果poi点*/
	$scope.$on('getHighlightData',function(event,data){
		$scope.$broadcast('highlightPoiInMap',data);
	});
	/*翻页时初始化itemActive*/
	$scope.$on('initItemActive',function(event,data){
		initTableList();
	});
	/*全屏显示*/
	$scope.$on('showFullScreen',function(event,img){
		$scope.pImageNow = img;
		$scope.showFullScreen = true;
	});
	/*关闭全屏查看*/
	$scope.closeFullScreen = function(){
		$scope.showFullScreen = false;
	};

	/**
	 * 删除poi
	 */
	$scope.delete = function (){
		swal({
			title: "确认删除？",
			type: "warning",
			animation:'slide-from-top',
			showCancelButton: true,
			closeOnConfirm: true,
			confirmButtonText: "是的，我要删除",
			cancelButtonText: "取消"
		}, function(f) {
			if (f) {
				data = {type:'RDLINK',pid:100004343,childPid:"",op:"道路link删除成功"};
				$scope.$broadcast('getConsoleInfo', data); //显示输出结果
			}

		});
	};
	/**
	 * 保存前数据校验及准备
	 */
	$scope.save = function () {
		console.log("poi:", $scope.poi);
		console.info("poi.getIntegrate", $scope.poi.getIntegrate());
		console.info("poi.getChanges", $scope.poi.getChanges());
		//判断电话是否符合规则
		if($scope.controlFlag.isTelEmptyArr){
			var flag = false ;
			for(var i = 0 , len = $scope.controlFlag.isTelEmptyArr.length ;i < len ; i ++){
				if($scope.controlFlag.isTelEmptyArr[i]){
					flag = true;
					break;
				}
			}
			if(flag){
				swal({
				    title: "电话格式有误，请重新输入!",
				    type: "warning",
				    timer: 1000,
				    showConfirmButton: false
				});
				return ;
			}
		}
		var change = $scope.poi.getChanges();
		savePoi(function (data){
			if (FM.Util.isEmptyObject(change)){
				swal("操作成功!", "属性值没有发生变化", "success");
			} else {
				swal("操作成功!", "属性值发生了变化", "success");
			}
			data = {type:'RDLINK',pid:100004343,childPid:"",op:"道路link修改成功"};
			$scope.$broadcast('getConsoleInfo', data); //显示输出结果
		});
	};
	/*切换POI时进行保存提醒*/
	var changePoi = function (callback){
		if($scope.poi){
			var change = $scope.poi.getChanges();
			console.info("change:",change);
			if (!FM.Util.isEmptyObject(change)){
				swal({
					title: "数据发生了修改是否保存？",
					type: "warning",
					animation:'slide-from-top',
					showCancelButton: true,
					closeOnConfirm: true,
					confirmButtonText: "保存",
					cancelButtonText: "不保存"
				}, function(f) {
					if (f) {
						savePoi(callback);
					} else {
						if(callback){
							callback();
						}
					}
				});
			} else {
				if(callback){
					callback();
				}
			}
		}else {
			if(callback){
				callback();
			}
		}
	};
	/**
	 * 调用保存接口
	 * @param callback
     */
	var savePoi = function (callback){
		//此处调用接口暂时省略
		if(callback){
			callback();
		}
	};

	/**
	 * 页面取消功能
	 */
	$scope.cancel = function (){
		$scope.poi =  angular.copy($scope.origPoi);
		$scope.$broadcast('refreshImgsData',$scope.poi.photos);

		$scope.$broadcast("clearBaseInfo"); //清除样式
	};
	/**
	 * 接收父子关系中点击子事件
	 */
	$scope.$on("emitChildren",function (event,childrenPid){
		$scope.$broadcast("highlightPoiByPid",childrenPid);
	});
	/**
	 * 接收父子关系中点击父事件
	 */
	$scope.$on("emitParent",function (event,parentPid){
		$scope.$broadcast("highlightPoiByPid",parentPid);
	});
	/**
	 * 接收其他子片段切换导致数据发生变化之前触发的事件
	 */
	$scope.$on("changeData",function (event,data){
		$scope.disappearEditorPanel = false; //不隐藏右边的属性面板

		changePoi(function (){
			$scope.$broadcast("changeDataRes");
		});
	});

	/**
	 * 查询POI数据
	 */
	$scope.$on("getObjectById",function (event,data){
		console.info("getObjectById");
		dsPoi.getPoiByPid({"dbId":App.Temp.dbId,"type":"IXPOI","pid":data.pid}).then(function (da) {
			if(da){
				showPoiInfo(da);
				$scope.$broadcast("getObjectByIdRes");
			}
		});
	});



	/*弹出/弹入面板*/
	$scope.changePanelShow = function (type) {
		switch (type) {
			case 'bottom':
				$scope.hideConsole = !$scope.hideConsole;
				break;
			case 'left':
				break;
			case 'right':
				if($scope.hideEditorPanel){
					$scope.hideEditorPanel = false;
					$scope.wholeWidth = true;
				} else {
					$scope.hideEditorPanel = true;
					$scope.wholeWidth = false;
				}
				break;
			default:
				break;
		}
	};

	/**
	 * 工具按钮控制
     */
	$scope.classArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];//按钮样式的变化
	$scope.changeBtnClass = function (id) {
		for (var claFlag = 0, claLen = $scope.classArr.length; claFlag < claLen; claFlag++) {
			if (claFlag === id) {
				$scope.classArr[claFlag] = !$scope.classArr[claFlag];
			} else {
				$scope.classArr[claFlag] = false;
			}
		}
	};
	/*解析分类，组成select-chosen需要的数据格式*/
	var initKindFormat = function (kindData) {
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
	};

	/**
	 * 元数据接口联调测试
	 * @type {Array}
     */
	//metaTest();
	function metaTest(){
		// //大分类
		// dsMeta.getTopKind().then(function (kindData) {
		// 	console.info("大分类：",kindData);
		// });
		// //中分类
		// dsMeta.getMediumKind().then(function (data) {
		// 	console.info("中分类：",data);
		// });
		//小分类
		var param = {
			mediumId:"",
			region:0
		};
		dsMeta.getKindListNew(param).then(function (kindData) {
			console.info("==============",kindData);
		});
		//
		// dsMeta.getFocus().then(function (data) {
		// 	console.info("focus:",data);
		// });
	}


	/**
	 * 名称组可地址组特殊处理（暂时只做了大陆的控制）
	 * 将名称组中的21CHI的名称放置在name中，如果不存在21CHI的数据，则给name赋值默认数据
	 * 将地址组中CHI的地址放置在address中，如果不存在CHI的数据，则给address赋值默认数据
	 * @param data
     */
	function specialDetail(data){
		var flag = true;
		for (var i = 0 ,len = data.names.length;i < len ; i++){
			if(data.names[i].nameClass == 1 && data.names[i].nameType == 2 && data.names[i].langCode == "CHI"){
				flag = false;
				data.name = data.names[i];
				break;
			}
		}
		if(flag){
			var name = new FM.dataApi.IxPoiName({
				langCode : "CHI",
				nameClass : 1,
				nameType : 2,
				name : ""
			});
			data.name = name;
		}

		flag = true;
		for (var i = 0 ,len = data.addresses.length;i < len ; i++){
			if(data.addresses[i].langCode == "CHI"){
				flag = false;
				data.address = data.addresses[i];
				break;
			}
		}
		if(flag){
			var address = new FM.dataApi.IxPoiAddress({
				langCode : "CHI",
				fullname : ""
			});
			data.address = address;
		}
	}

	function loadMap() {
		map = L.map('map', {
			attributionControl: false,
			doubleClickZoom: false,
			zoomControl: false
		}).setView([40.012834, 116.476293], 17);
		tooltipsCtrl.setMap(map, 'tooltip');
		shapeCtrl.setMap(map);
		layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function (event) {
			if (event.flag == true) {
				map.addLayer(event.layer);
			} else {
				map.removeLayer(event.layer);
			}
		})
		for (var layer in layerCtrl.getVisibleLayers()) {
			map.addLayer(layerCtrl.getVisibleLayers()[layer]);
		}

		document.getElementById('zoomLevelBar').innerHTML = "缩放等级:17";

		map.on("zoomend", function(e) {
			document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + map.getZoom();
		});
	}

	function initOcll() {
		/*弹出tips*/
		//appPath.root + appPath.road +
		$ocLazyLoad.load( appPath.poi + 'ctrls/attr-tips/poiPopoverTipsCtl').then(function () {
			$scope.poiPopoverTipsTpl = appPath.root + appPath.poi + 'tpls/attr-tips/poiPopoverTips.html';
			$scope.showPopoverTips = true;
		});
		$ocLazyLoad.load( appPath.poi + 'ctrls/attr-base/generalBaseCtl').then(function () {
			$scope.generalBaseTpl = appPath.root + appPath.poi + 'tpls/attr-base/generalBaseTpl.html';
		});
	}
	var initData = function(){
		var promises = [];
		// promises.push(dsMeta.getKindList().then(function (kindData) {
		// 	kindData.unshift({"id":"0","kindCode":"0","kindName":"--请选择--"});//在数组最前面增加
		// 	initKindFormat(kindData);
		// }));

		var param = {
			mediumId:"",
			region:0
		};
		promises.push(dsMeta.getKindListNew(param).then(function (kindData) {
			kindData.unshift({"id":"0","kindCode":"0","kindName":"--请选择--"});//在数组最前面增加
			initKindFormat(kindData);
		}));

		param = {kindCode:""};
		//promises.push(dsMeta.getAllBrandList().then(function (chainData) {
		promises.push(dsMeta.getChainList(param).then(function (chainData) {
			$scope.metaData.allChain = chainData;
		}));
	};
	/**
	 * 接收点击地图上要素的监听事件
	 */
	$scope.$on("transitCtrlAndTpl",function (event, data){
		if (data["loadType"] === "subAttrTplContainer") {
			$scope.subAttrTplContainerSwitch(true);
			$scope.subAttrTplContainer = "";
		} else if (data["loadType"] === "generalBaseTpl") { //右边属性面板
			if (!$scope.panelFlag) {
				$scope.attrTplContainerSwitch(true);
			}
		} else if (data["loadType"] === "tipsTplContainer") {

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
		}

		$ocLazyLoad.load(data["propertyCtrl"]).then(function () {
			$scope[data["loadType"]] = data["propertyHtml"];
			if (data["callback"]) {
				data["callback"]();
			}
		})
	});

	//页面初始化方法调用
	var initPage = function (){
		initData();
		loadMap();



		//选择道路要素的工具栏
		// $ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectAdShapeCtrl').then(function () {
		// 	$scope.selectShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectAdShapeTpl.html';
		// });

		//选择道路要素的工具栏
		$ocLazyLoad.load(appPath.road + 'ctrls/toolBar_cru_ctrl/selectShapeCtrl').then(function () {
			$scope.selectShapeURL = appPath.root + appPath.road + 'tpls/toolBar_cru_tpl/selectShapeTpl.html';
			$ocLazyLoad.load(appPath.poi + 'ctrls/toolBar_cru_ctrl/selectPoiCtrl').then(function () {
				$scope.selectPoiURL = appPath.root + appPath.poi + 'tpls/toolBar_cru_tpl/selectPoiTpl.html';
				$ocLazyLoad.load(appPath.poi + 'ctrls/edit-tools/optionBarCtl').then(function () {
					$scope.consoleDeskTpl = appPath.root + appPath.poi + 'tpls/edit-tools/optionBarTpl.html';
					/*默认显示poi作业平台*/
					$scope.changeProject(2);

					keyEvent($ocLazyLoad, $scope);//注册快捷键
				});
			});
		});
	};


	/**
	 * 页面初始化方法调用
	 */
	initPage();

}]);