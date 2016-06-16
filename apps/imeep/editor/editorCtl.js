angular.module('app', ['oc.lazyLoad', 'ui.layout','ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap','ngSanitize']).controller('EditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', 'dsMeta', '$q', function ($scope, $ocLazyLoad, $rootScope, poiDS, meta, $q) {
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
	//$scope.parentPoi = {};//父POI
	//$scope.childrenPoi = []; //子POI
	$scope.controlFlag = {};//用于父Scope控制子Scope


	/*切换项目平台*/
	$scope.changeProject = function(type){
		if(type == 1){  //poi
			$ocLazyLoad.load('scripts/components/poi-new/ctrls/attr-base/poiDataListCtl').then(function () {
				$scope.poiDataListTpl = '../../../scripts/components/poi-new/tpls/attr-base/poiDataListTpl.html';
				$scope.showLoading = false;
			});
		}else{      //道路
			$scope.poiDataListTpl = '';
			/*$ocLazyLoad.load('scripts/components/poi-new/ctrls/attr-base/poiDataListCtl').then(function () {
				$scope.poiDataListTpl = '../../../scripts/components/poi-new/tpls/attr-base/poiDataListTpl.html';
			});*/
		}
		$scope.projectType = type;
	};

	$scope.isTipsPanel = 1;
	//切换成果-场景栏中的显示内容
	$scope.changeEditTool = function (id) {
		changePoi(function () {
			if (id === "tipsPanel") {
				$scope.isTipsPanel = 1;
				$ocLazyLoad.load('scripts/components/road/ctrls/layers_switch_ctrl/filedsResultCtrl').then(function () {
					$scope.poiDataListTpl = '../../../scripts/components/road/tpls/layers_switch_tpl/fieldsResult.html';
				});
			} else if (id === "scenePanel") {
				$scope.isTipsPanel = 2;
				$ocLazyLoad.load('scripts/components/road/ctrls/layers_switch_ctrl/sceneLayersCtrl').then(function () {
					$scope.poiDataListTpl = '../../../scripts/components/road/tpls/layers_switch_tpl/sceneLayers.html';
				});
			} else if (id === "layerPanel") {
				$scope.isTipsPanel = 3;
				$ocLazyLoad.load('scripts/components/road/ctrls/layers_switch_ctrl/referenceLayersCtrl').then(function () {
						$scope.poiDataListTpl = '../../../scripts/components/road/tpls/layers_switch_tpl/referenceLayers.html';
					}
				);
			}
		})
	};

	$scope.changeProperty = function (val) {
		$scope.propertyType = val;
	};
	$scope.changeOutput = function (val) {
		$scope.outputType = val;
	};
	/*选中poi列表查询poi详细信息*/
	$scope.$on('getObjectById',function(event,param){
		changePoi(function (){  //选择POI时需要先判断当前POI有没有编辑过,后续操作需要写在回调方法中
			poiDS.getPoiByPid(param).then(function (data) {
				if(data){
					showPoiInfo(data);
					$scope.$broadcast("highlightPoiByPid",{}); //高亮poi点位
					initOcll();
				}
			});
		});
	});

	/**
	 * 显示poi基本信息，tips信息等
     */
	var showPoiInfo = function (data){
		$scope.$broadcast("clearBaseInfo"); //清除样式
		$scope.hideEditorPanel = true; //打开右侧面板
		
		specialDetail(data);//名称组和地址组特殊处理
		$scope.poi = data;
		$scope.origPoi = angular.copy(data);
		$scope.$broadcast('initPoiPopoverTipsCtl');  //调用poiPopoverTipsCtl.js初始化方法
		$scope.$broadcast('refreshImgsData',$scope.poi.photos);
		/*查询3DIcon*/
		meta.getCiParaIcon(data.poiNum).then(function (data) {
			$scope.poi.poi3DIcon = data;
		});

		initOcll();
	}
	/*获取所选poi信息*/
	$scope.$on('getPoiList',function(event,data){
		$scope.poiList = data;
	});
	/*获取检查结果*/
	// $scope.checkPageNow = 1;
	/*刷新检查结果*/
	$scope.$on('refreshCheckReusltData',function(event,param){
		initCheckResultData();
	});
	/*查找检查结果*/
	function getCheckResultData(num){
		poiDS.getCheckData(num).then(function(data){
			$scope.checkResultData = [];
			for(var i=0,len=data.length;i<len;i++){
				$scope.checkResultData.push(new FM.dataApi.IxCheckResult(data[i]));
			}
		});
	}
	// getCheckResultData($scope.checkPageNow);
	initCheckResultData();
	/*查找检查结果总数*/
	poiDS.getCheckDataCount().then(function(data){
		$scope.checkResultTotal = data;
		$scope.checkPageTotal = Math.ceil(data/5);
	});
	/*初始化检查结果数据*/
	function initCheckResultData(){
		$scope.checkPageNow = 1;//检查结果当前页
		getCheckResultData(1);
	}
	/*检查结果翻页*/
	$scope.$on('trunPaging',function(event,type){
		if(type == 'prev'){     //上一页
			getCheckResultData($scope.checkPageNow-1);
			$scope.checkPageNow--;
		}else{      //  下一页
			getCheckResultData($scope.checkPageNow+1);
			$scope.checkPageNow++;
		}
	});
	/*高亮检查结果poi点*/
	$scope.$on('poiHeighLight',function(event,data){
		$scope.$broadcast('highlightPoiInMap',data);
	});
	/*关闭popoverTips状态框*/
	$scope.$on('closePopoverTips', function (event, data) {
		$scope.showPopoverTips = false;
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
	 * 接收地图上点击POI之前的事件
	 */
	$scope.$on("changeData",function (event,data){
		changePoi(function (){
			poiDS.getPoiByPid({"dbId":8,"type":"IXPOI","pid":data.id}).then(function (da) {
				if(da){
					showPoiInfo(da);

					$scope.$broadcast("clickSelectedPoi",data);
				}
			});


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
				$scope.hideEditorPanel = !$scope.hideEditorPanel;
				$scope.wholeWidth = !$scope.wholeWidth;
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
	metaTest();
	function metaTest(){
		//大分类
		meta.getTopKind().then(function (kindData) {
			console.info("大分类：",kindData);
		});
		//中分类
		meta.getMediumKind().then(function (data) {
			console.info("中分类：",data);
		});
		//小分类
		var param = {
			mediumId:"",
			region:0
		};
		meta.getKindListNew().then(function (kindData) {
			console.info("==============",kindData);
		});
		//
		meta.getFocus().then(function (data) {
			console.info("focus:",data);
		});
	}


	var promises = [];
	promises.push(poiDS.queryChargeChain("230218").then(function (data) {
		$scope.chargeChain = data;
	}));
	promises.push(meta.getKindList().then(function (kindData) {
		initKindFormat(kindData);
	}));
	promises.push(meta.getAllBrandList().then(function (chainData) {
		$scope.metaData.allChain = chainData;
	}));

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
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/attr-tips/poiPopoverTipsCtl').then(function () {
			$scope.poiPopoverTipsTpl = '../../../scripts/components/poi-new/tpls/attr-tips/poiPopoverTips.html';
			$scope.showPopoverTips = true;
		});
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/attr-base/generalBaseCtl').then(function () {
			$scope.generalBaseTpl = '../../../scripts/components/poi-new/tpls/attr-base/generalBaseTpl.html';
		});
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/optionBarCtl').then(function () {
			$scope.consoleDeskTpl = '../../../scripts/components/poi-new/tpls/edit-tools/optionBarTpl.html';
		});
	}
	//页面初始化方法调用
	var initPage = function (){

		loadMap();

		$ocLazyLoad.load('scripts/components/poi-new/ctrls/toolBar_cru_ctrl/selectPoiCtrl').then(function () {
			$scope.selectPoiURL = '../../../scripts/components/poi-new/tpls/toolBar_cru_tpl/selectPoiTpl.html';

		});
		/*默认显示poi作业平台*/
		$scope.changeProject(1);

		keyEvent($ocLazyLoad, $scope);//注册快捷键


	};


	/**
	 * 页面初始化方法调用
	 */
	initPage();

}]);