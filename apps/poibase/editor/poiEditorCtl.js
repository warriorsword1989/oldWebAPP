angular.module('app', ['oc.lazyLoad', 'ui.layout','ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap','ngSanitize']).controller('PoiEditorCtl', ['$scope', '$ocLazyLoad', '$rootScope', 'dsPoi', 'dsMeta', '$q','$document', function ($scope, $ocLazyLoad, $rootScope, poiDS, meta, $q,$document) {
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

	$scope.show = true;
	$scope.panelFlag = true;
	$scope.suspendFlag = true;
	$scope.selectedTool = 1;
	$scope.dataListType = 1;
	$scope.projectType = 1;
	$scope.outputType = 1;
	$scope.hideConsole = true;
	$scope.hideEditorPanel = false;
	$scope.parentPoi = {};//父POI
	$scope.childrenPoi = []; //子POI
	$scope.controlFlag = {};//用于父Scope控制子Scope


	loadMap();
	/*切换项目平台*/
	$scope.changeProject = function(type){
		$scope.projectType = type;
	}
	/*切换poi列表类型*/
	$scope.changeDataList = function (val) {
		$scope.dataListType = val;
	};
	$scope.changeProperty = function (val) {
		$scope.propertyType = val;
	};
	$scope.changeOutput = function (val) {
		$scope.outputType = val;
	};
	$scope.selectData = function (data,index) {
		changePoi(function (){  //选择POI时需要先判断当前POI有没有编辑过,后续操作需要写在回调方法中

			$scope.$broadcast("clearBaseInfo"); //清除样式
			$scope.hideEditorPanel = true;

			poiDS.getPoiByPid({"dbId":8,"type":"IXPOI","pid":6131753}).then(function (data) {
			//poiDS.getPoiByPid({"dbId":8,"type":"IXPOI","pid":data.pid}).then(function (data) {
				if(data){
					specialDetail(data);//名称组和地址组特殊处理
					$scope.poi = data;
					$scope.origPoi = angular.copy(data);
					$scope.$broadcast('refreshImgsData',$scope.poi.photos);
					initOcll();
					$scope.$broadcast("highlightPoiByPid",data.pid); //高亮poi点位
					/*查询3DIcon*/
					meta.getCiParaIcon(data.poiNum).then(function (data) {
						$scope.poi.poi3DIcon = data;
						console.log(data)
						initTableList();
					});

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
					$scope.itemActive = index;
				}
			});
		});
	};
	
	/*查询poi列表信息*/
	$scope.$on('getPoiListData',function(event,param){
		getPoiList(param);
	});
	function getPoiList(param){
		poiDS.getPoiList(param).then(function (data) {
			$ocLazyLoad.load('scripts/components/poi-new/ctrls/attr-base/poiDataListCtl').then(function () {
				$scope.poiDataListTpl = '../../../scripts/components/poi-new/tpls/attr-base/poiDataListTpl.html';
				$scope.poiList = data.rows;
				$scope.poiListTotal = data.total;
				$scope.$broadcast('getPoiDataResult',data);
			});
		});
	}
	getPoiList({
		dbId: App.Temp.dbId,
		// type: [1,2,3],
		pageNum: 1,
		pageSize: 10
	});
	/*获取检查结果*/
	$scope.$on('getCheckReusltData',function(event,param){
		getCheckResultData(param);
	});
	function getCheckResultData(param){
		poiDS.getCheckData(param).then(function(data){
			$scope.checkResultData = [];
			for(var i=0,len=data.length;i<len;i++){
				$scope.checkResultData.push(new FM.dataApi.IxCheckResult(data[i]));
			}
			console.log(data)
		});
	}
	getCheckResultData({
		dbId: App.Temp.dbId,
		pageNum: 1,
		pageSize: 5,
		grids: App.Temp.meshList
	});
	/*关闭popoverTips状态框*/
	$scope.$on('closePopoverTips', function (event, data) {
		$scope.showPopoverTips = false;
	})
	/*键盘控制poilist切换*/
	$document.bind("keyup", function (event) {
		if ($scope.itemActive<$scope.poiList.length-1 && event.keyCode == 34) {
			$scope.itemActive++;
			refreshData();
		}
		if ($scope.itemActive!=0 && event.keyCode == 33) {
			$scope.itemActive--;
			refreshData();
		}
		/*刷新poi，弹出tips*/
		function refreshData(){
			// refreshPoiData($scope.poiList[$scope.itemActive]);
			$scope.selectData($scope.poiList[$scope.itemActive],$scope.itemActive);
			$scope.$apply();
		}
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
	}
	$scope.doIgnore = function (val) {
		alert(val);
	};
	$scope.showRelatedPoi = function (list) {
		alert(list.length);
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
	}

	var savePoi = function (callback){
		//此处调用接口暂时省略
		if(callback){
			callback();
		}
	}

	$scope.cancel = function (){
		$scope.poi =  angular.copy($scope.origPoi);
		$scope.$broadcast('refreshImgsData',$scope.poi.photos);

		$scope.$broadcast("clearBaseInfo"); //清除样式
	}

	$scope.$on("emitChildren",function (event,childrenPid){
		$scope.$broadcast("highlightPoiByPid",childrenPid);
	});
	$scope.$on("emitParent",function (event,parentPid){
		$scope.$broadcast("highlightPoiByPid",parentPid);
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
	}
	/*检查结果中根据道路id获得道路的详细属性*/
	$scope.$on('getRdObjectById', function (event, param) {
		var rdLink = layerCtrl.getLayerById('referenceLine');
		var workPoint = layerCtrl.getLayerById('workPoint');
		var restrictLayer = layerCtrl.getLayerById("referencePoint");
		highRenderCtrl._cleanHighLight();
		if (highRenderCtrl.highLightFeatures != undefined) {
			highRenderCtrl.highLightFeatures.length = 0;
		}
		//线高亮
		if (param.type == 'RDLINK') {
			poiDS.getRdObjectById(param.id, param.type).then(function (data) {
				var highlightFeatures = [];
				var linkArr = data.geometry.coordinates, points = [];
				for (var i = 0, len = linkArr.length; i < len; i++) {
					var point = L.latLng(linkArr[i][1], linkArr[i][0]);
					points.push(point);
				}
				var line = new L.polyline(points);
				var bounds = line.getBounds();
				map.fitBounds(bounds, {"maxZoom": 19});

				highlightFeatures.push({
					id: param.id.toString(),
					layerid: 'referenceLine',
					type: 'line',
					style: {}
				});
				highRenderCtrl.highLightFeatures = highlightFeatures;
				highRenderCtrl.drawHighlight();
			});
		} else if (type == "RDRESTRICTION") {//交限高亮
			var limitPicArr = [];
			layerCtrl.pushLayerFront('referencePoint');
			poiDS.getRdObjectById(param.id, param.type).then(function (data) {
				objectCtrl.setCurrentObject("RDRESTRICTION", data);

				////高亮进入线和退出线
				var hightlightFeatures = [];
				hightlightFeatures.push({
					id: data.pid.toString(),
					layerid: 'restriction',
					type: 'restriction',
					style: {}
				})
				hightlightFeatures.push({
					id: objectCtrl.data["inLinkPid"].toString(),
					layerid: 'referenceLine',
					type: 'line',
					style: {}
				})

				for (var i = 0, len = (objectCtrl.data.details).length; i < len; i++) {

					hightlightFeatures.push({
						id: objectCtrl.data.details[i].outLinkPid.toString(),
						layerid: 'referenceLine',
						type: 'line',
						style: {}
					})
				}
				highRenderCtrl.highLightFeatures = highlightFeatures;
				highRenderCtrl.drawHighlight();
			});
		} else {//其他tips高亮
			layerCtrl.pushLayerFront("workPoint");
			Application.functions.getTipsResult(id, function (data) {
				map.setView([data.g_location.coordinates[1], data.g_location.coordinates[0]], 20);

				var highlightFeatures = [];
				highlightFeatures.push({
					id: data.rowkey,
					layerid: 'workPoint',
					type: 'workPoint',
					style: {}
				});
				highRenderCtrl.highLightFeatures = highlightFeatures;
				highRenderCtrl.drawHighlight();
			});
		}
	});
	/*修改状态*/
	$scope.$on('updateCheckType', function (event, param) {
		poiDS.updateCheckType(param.id, param.type).then(function (data) {
			console.log('修改成功')
		});
	});
	/*显示同位点poi详细信息*/
	$scope.showSelectedSamePoiInfo = function (poi, index) {
		$scope.$broadcast('highlightChildInMap', $scope.refFt.refList[index].fid);
	};
	/*获取关联poi数据——检查结果*/
	$scope.$on('getRefFtInMap', function (event, data) {
		for (var i = 0, len = data.length; i < len; i++) {
			data[i].kindInfo = $scope.metaData.kindFormat[data[i].kindCode];
		}
		$scope.refFt = {
			title: '检查结果关联POI',
			refList: data
		};
		$scope.$broadcast('showPoisInMap', {
			data: data,
			layerId: "checkResultLayer"
		});
		$scope.showRelatedPoiInfo = true;
		$scope.$broadcast('showPoiListData', data);
	});
	/*隐藏关联POI界面*/
	$scope.infoStyle = {
		'display': 'block'
	};
	/*显示关联poi详细信息*/
	$scope.showPoiDetailInfo = function (poi, index) {
		$scope.poiDetail = {
			poi: poi,
			kindName: $scope.refFt.refList[index].kindInfo.kindName
		};
		$scope.$broadcast('highlightChildInMap', $scope.refFt.refList[index].fid);
	};
	/*显示地图上poi数组*/
	function loadPoiInfoPopover(data, title) {
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
			$scope.poiInfoTpl = '../../../scripts/components/poi-new/tpls/edit-tools/poiInfoPopover.html';
			$scope.drawPois = data;
			var _fid = $scope.poi.fid;
			var fidList;
			meta.getParentFidList().then(function (list) {
				fidList = list;
				for (var i = 0, len = data.data.length; i < len; i++) {
					data.data[i].kindInfo = $scope.metaData.kindFormat[data.data[i].kindCode];
					if (_fid && _fid == data.data[i].fid) {
						data.data[i].ifParent = 1;
						data.data[i].labelRemark = {
							labelClass: 'primary',
							text: '当前父'
						}
					} else {
						switch (data.data[i].kindInfo.parentFlag) {
							case 0:
								if (!data.data[i].ifParent) {
									if (fidList.indexOf(data.data[i].fid) >= 0 && data.data[i].lifecycle != 1) { //可为父
										data.data[i].ifParent = 2;
										data.data[i].labelRemark = {
											labelClass: "success",
											text: "可为父"
										}
									} else { //不可为父
										data.data[i].ifParent = 3;
										data.data[i].labelRemark = {
											labelClass: 'default',
											text: '不可为父'
										}
									}
								}
								break;
							case 1:
								data.data[i].ifParent = 2;
								data.data[i].labelRemark = {
									labelClass: 'success',
									text: '可为父'
								}
								break;
							case 2:
								if ($scope.poi.indoor.type == 3) {
									data.data[i].ifParent = 2;
									data.data[i].labelRemark = {
										labelClass: "warning",
										text: "可为父"
									};
								} else {
									data.data[i].ifParent = 3;
									data.data[i].labelRemark = {
										labelClass: "default",
										text: "不可为父"
									};
								}
								break;
							default:
								break;
						}
					}
				}
				$scope.refFt = {
					title: title,
					refList: data.data
				};
				$scope.showRelatedPoiInfo = true;
				$scope.layerName = data.layerId;
				// $scope.$broadcast('showPoisInMap',{data:$scope.refFt.refList,layerId:"parentPoiLayer"});
			});
		});
	}

	/*接收框选点信息*/
	$scope.$on('drawPois', function (event, data) {
		loadPoiInfoPopover(data, '框选区域内关联POI');
		$scope.$broadcast('showPoiListData', data);
	});
	/*接收周边查询点信息*/
	$scope.$on('searchPois', function (event, data) {
		loadPoiInfoPopover(data, '周边1KM范围内的POI');
		$scope.$broadcast('showPoiListData', data);
	});
	/*接收同位点信息*/
	$scope.$on('samePois', function (event, data) {
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/poiInfoPopoverCtl').then(function () {
			$scope.poiInfoTpl = '../../../scripts/components/poi-new/tpls/edit-tools/poiInfoPopover.html';
			// $scope.samePois = data;
			$scope.refFt = {
				title: '同位点POI',
				refList: data.data
			};
			$scope.showRelatedPoiInfo = true;
			$scope.layerName = data.layerId;
		});
	});
	/*检查结果忽略请求*/
	$scope.$on('ignoreItem', function (event, data) {
		poi.ignoreCheck(data, $scope.poi.fid).then(function () {
			$scope.poi.ckException.push({
				errorCode: data.errorCode,
				description: data.errorMsg
			});
			for (var i = 0; i < $scope.poi.checkResults.length; i++) {
				if ($scope.poi.checkResults[i].errorCode == data.errorCode && $scope.poi.checkResults[i].errorMsg == data.errorMsg) {
					$scope.poi.checkResults.splice(i, 1);
					break;
				}
			}
			if ($scope.poi.checkResultNum > 0) {
				$scope.poi.checkResultNum = $scope.poi.checkResultNum - 1;
			}
			/*操作成功后刷新poi数据*/
			$scope.$broadcast('initOptionData', data);
		});
	});
	/*查找FIDlist*/
	meta.getParentFidList().then(function (list) {
		$scope.fidList = list;
	});
	/*接收layerName*/
	$scope.$on('getLayerName', function (event, data) {
		$scope.layerName = data;
	});
	/*关闭关联poi数据*/
	$scope.closeRelatedPoiInfo = function () {
		$scope.showRelatedPoiInfo = false;
		$scope.$broadcast('closePopover', $scope.layerName);
	};
	/*锁定检查结果数据*/
	$scope.$on('lockSingleData', function (event, data) {
		poi.lockSingleData(data).then(function (res) {
			refreshPoiData('0010060815LML01353');
		});
	});
	/*关闭关联poi数据——冲突检测弹框*/
	$scope.closeConflictInfo = function () {
		$scope.showConflictInfo = false;
	};
	/*获取关联poi数据——冲突检测*/
	$scope.$on('getConflictInMap', function (event, data) {
		$scope.optionData = {};
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/edit-tools/confusionDataCtl').then(function () {
			$scope.confusionDataTpl = '../../../scripts/components/poi-new/tpls/edit-tools/confusionDataTpl.html';
			$scope.showConflictPoiInfo = true;
			data.refData.duppoi.kindName = $scope.metaData.kindFormat[data.refData.duppoi.kindCode].kindName;
			data.refData.duppoi.brandList = $scope.metaData.allChain[data.refData.duppoi.kindCode];
			$scope.optionData.confusionData = data;
			$scope.showConflictInfo = true;
		});
		/*地图上高亮*/
		$scope.$broadcast('showPoisInMap', {
			data: data.refData,
			layerId: "checkResultLayer"
		});
	});
	/*显示冲突检测面板*/
	$scope.$on('showConflictInMap', function (event, data) {
		$scope.showConflictInfo = data;
	});
	/*接收新上传的图片数据*/
	$scope.$on('getImgItems', function (event, data) {
		for (var i = 0; i < data.length; i++) {
			$scope.poi.photos.push(data[i]);
			$scope.poi.tempPhotos.push(data[i]);
		}
		$scope.$broadcast('refreshImgsData',$scope.poi.photos);
	});

	$scope.$on("SWITCHCONTAINERSTATE", function (event, data) {//在此处写属性栏的控制
		// if (data.hasOwnProperty("attrContainerTpl")) {
		// $scope.attrTplContainerSwitch(data["attrContainerTpl"]);
		// } else if (data.hasOwnProperty("subAttrContainerTpl")) {
		//     $scope.subAttrTplContainerSwitch(data["subAttrContainerTpl"]);
		// }
	});
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
	/*获取检查规则*/
	promises.push(meta.queryRule().then(function (data) {
		$scope.checkRuleList = data;
	}));
	/*临时数据*/
	// promises.push(poiDS.getPoiDetailByFid("0010060815LML01353").then(function(data) {
	//     $scope.poi = data;
	// }));

	// promises.push(poiDS.getPoiByPid({"dbId":8,"type":"IXPOI","pid":29137}).then(function (data) {
	// 	if(data){
	// 		specialDetail(data);//名称组和地址组特殊处理
	// 		$scope.poi = data;
	// 		$scope.origPoi = angular.copy(data);
	// 	}
	// }));
	/*查询3DIcon*/
	// promises.push(meta.getCiParaIcon("0010060815LML01353").then(function (data) {
	// 	$scope.poi3DIcon = data;
	// }));
	// $q.all(promises).then(function () {
		//initParentAndChildren();
		// initTableList();
		// setTimeout(function () {
		// 	$scope.$broadcast("highlightPoiInMap", {});
		// },5000)
	// });
	/**
	 * 名称组可地址组特殊处理（暂时只做了大陆的控制）
	 * 如果名称组不存在12CHI的名称，则增加一组12CHI的名称
	 * 如果地址组不存在CHI的地址，则增加一组CHI的地址
	 * @param data
     */
	function specialDetail(data){
		var flag = true;
		for (var i = 0 ,len = data.names.length;i < len ; i++){
			if(data.names[i].nameClass == 1 && data.names[i].nameType == 2 && data.names[i].langCode == "CHI"){
				flag = false;
			}
		}
		if(flag){
			var name = {
				langCode : "CHI",
				nameClass : data['nameClass'] || 1,
				nameType : data['nameType'] || 2
			}
			data.names.push(new FM.dataApi.IxPoiName(name));
		}
		flag = true;
		for (var i = 0 ,len = data.addresses.length;i < len ; i++){
			if(data.addresses[i].langCode == "CHI"){
				flag = false;
			}
		}
		if(flag){
			var address = {
				langCode : "CHI"
			}
			data.addresses.push(new FM.dataApi.IxPoiAddress(address));
		}
	}

	/*刷新poi数据*/
	function refreshPoiData(fid){
		poiDS.getPoiDetailByFid(fid).then(function(data) {
			$scope.poi = data;
		})
	}
	/*初始化列表*/
	function initTableList(){
		$scope.itemActive = -1;
	}
	/*初始化tpl加载*/
	function initOcll() {
		$ocLazyLoad.load('scripts/components/poi-new/ctrls/toolBar_cru_ctrl/selectPoiCtrl').then(function () {
			$scope.selectPoiURL = '../../../scripts/components/poi-new/tpls/toolBar_cru_tpl/selectPoiTpl.html';
		});
	}

	// var map = null;
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
	}

}]);