angular.module('app', ['ngCookies', 'oc.lazyLoad', 'fastmap.uikit', 'ui.layout', 'ngTable', 'localytics.directives', 'dataService', 'angularFileUpload', 'angular-drag', 'ui.bootstrap', 'ngSanitize']).constant("appPath", {
	root: App.Util.getAppPath() + "/",
	meta: "scripts/components/meta/",
	road: "scripts/components/road/",
	poi: "scripts/components/poi/",
	tool: "scripts/components/tools/"
}).controller('EditorCtl', ['$scope', '$cookies', '$ocLazyLoad', '$rootScope', 'dsMeta', 'dsFcc', 'dsEdit', 'dsManage', '$q', 'appPath', '$timeout', '$interval',
	function($scope, $cookies, $ocLazyLoad, $rootScope, dsMeta, dsFcc, dsEdit, dsManage, $q, appPath, $timeout, $interval) {
		// var layerCtrl = new fastmap.uikit.LayerController({
		//  config: App.layersConfig
		// });
		var objectCtrl = fastmap.uikit.ObjectEditController();
		var featCodeCtrl = fastmap.uikit.FeatCodeController();
		var eventCtrl = new fastmap.uikit.EventController();
		var logMsgCtrl = fastmap.uikit.LogMsgController($scope);
		$scope.logMessage = logMsgCtrl.messages;
		$scope.appPath = appPath;
		$scope.metaData = {}; //存放元数据
		$scope.metaData.kindFormat = {}, $scope.metaData.kindList = [], $scope.metaData.allChain = {}, $scope.topKind = {}, $scope.mediumKind = {};
		$scope.metaData.kindFormatPart = {}, $scope.metaData.kindListPart = [];
		$scope.showLoading = {
			flag: true
		};
		// 将页面loading动画的开关引用赋给dsEdit的本地变量，以便在dsEdit中进行控制
		// 注意：这里利用了对象引用的特性，变量必须是个对象，不能是字符串、bool、数字等
		dsEdit.referenceLoadingSwitch($scope.showLoading);
		$scope.showTab = true;
		$scope.selectedTool = 1;
		$scope.dataListType = 1;
		$scope.projectType = 1; //1--POI作业，其他为道路作业
		$scope.outputType = 1;
		$scope.rootCommonTemp = {}; //用于保存需要全局控制的变量
		$scope.rootCommonTemp.selectPoiInMap = false; //false表示从poi列表选择，true表示从地图上选择
		$scope.thematicMapShow = false;
		//面板显示控制开关
		$scope.editorPanelOpened = 'none';
		$scope.suspendPanelOpened = false;
		$scope.consolePanelOpened = false;
		$scope.workPanelOpened = false;
		$scope.rdLaneOpened = false;
		//$scope.selectPoiInMap = false; //false表示从poi列表选择，true表示从地图上选择
		//$scope.controlFlag = {}; //用于父Scope控制子Scope
		$scope.outErrorArr = [false, true, true, false]; //输出框样式控制
		// $scope.outputResult = []; //输出结果
		$scope.specialWork = false;
		$rootScope.isSpecialOperation = false;
		/*切换项目平台*/
		$scope.changeProject = function(type) {
			$scope.showLoading.flag = true;
			$scope.showPopoverTips = false;
			$scope.tipsPanelOpened = false;
			if (type == 1) { //poi
				if ($scope.specialWork) {
					$ocLazyLoad.load(appPath.poi + 'ctrls/attr-base/specialWorkListCtl').then(function() {
						$scope.dataListTpl = appPath.root + appPath.poi + 'tpls/attr-base/specialWorkListTpl.html';
						$scope.showLoading.flag = false;
					});
				} else {
					$ocLazyLoad.load(appPath.poi + 'ctrls/attr-base/poiDataListCtl').then(function() {
						$scope.dataListTpl = appPath.root + appPath.poi + 'tpls/attr-base/poiDataListTpl.html';
						$scope.showLoading.flag = false;
					});
				}
			} else { //道路
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/filedsResultCtrl').then(function() {
					$scope.dataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/filedsResultTpl.html';
					$scope.showLoading.flag = false;
				});
			}
			$scope.projectType = type;
		};
		$scope.selectedTool = 1;
		//切换成果-场景栏中的显示内容
		$scope.changeEditTool = function(id) {
			if (id === "tipsPanel") {
				$scope.showTab = true;
				$scope.selectedTool = 1;
				$scope.changeProject($scope.projectType);
			} else if (id === "scenePanel") {
				$scope.showTab = false;
				$scope.selectedTool = 2;
				$ocLazyLoad.load(appPath.road + 'ctrls/layers_switch_ctrl/sceneLayersCtrl').then(function() {
					$scope.dataListTpl = appPath.root + appPath.road + 'tpls/layers_switch_tpl/sceneLayers.html';
				});
			}
		};
		//属性栏开关逻辑控制
		$scope.attrTplContainerSwitch = function(flag) {
			if (flag) {
				$scope.editorPanelOpened = flag;
			} else {
				$scope.editorPanelOpened = 'none';
			}
		};
		//次属性开关逻辑控制
		$scope.subAttrTplContainerSwitch = function(flag) {
			$scope.suspendPanelOpened = flag;
		}
		$scope.changeProperty = function(val) {
			$scope.propertyType = val;
		};
		$scope.changeOutput = function(val) {
			$scope.outputType = val;
		};
		/*关闭全屏查看*/
		$scope.closeFullScreen = function() {
			$scope.showFullScreen = false;
		};
		/*隐藏tips图片*/
		$scope.hideFullPic = function() {
			$scope.roadFullScreen = false;
		};
		/**
		 * 工具按钮控制
		 */
		$scope.classArr = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; //按钮样式的变化
		$scope.changeBtnClass = function(id) {
			$scope.$broadcast("resetButtons", {});
			$timeout(function() { //为了解决按esc键后工具条按钮不能恢复的bug
				$scope.$apply();
			}, 1);
		};

		function loadMap(data) {
			var layerCtrl = new fastmap.uikit.LayerController({
				config: App.layersConfig
			});
			map = L.map('map', {
				attributionControl: false,
				doubleClickZoom: false,
				zoomControl: false
			});
			//高亮作业区域
			var substaskGeomotry = data.geometry;
			var pointsArray = hightLightWorkArea(substaskGeomotry);
			var lineLayer = L.multiPolygon(pointsArray, {
				fillOpacity: 0
			});
			map.addLayer(lineLayer);
			map.on("zoomend", function(e) {
				document.getElementById('zoomLevelBar').innerHTML = "缩放等级:" + map.getZoom();
			});
			map.on('resize', function() {
				setTimeout(function() {
					map.invalidateSize()
				}, 400);
			});
			map.on("moveend", function(e) {
				var c = map.getCenter();
				$cookies.put('IMEEP_EDITOR_MAP_ZOOM', map.getZoom(), {
					path: '/'
				});
				$cookies.put('IMEEP_EDITOR_MAP_CENTER', JSON.stringify([c.lat, c.lng]), {
					path: '/'
				});
			});
			if ($cookies.get('IMEEP_EDITOR_MAP_ZOOM') && $cookies.get('IMEEP_EDITOR_MAP_CENTER')) {
				map.setView(JSON.parse($cookies.get('IMEEP_EDITOR_MAP_CENTER')), $cookies.get('IMEEP_EDITOR_MAP_ZOOM'));
			} else {
				map.fitBounds(lineLayer.getBounds());
			}
			// L.control.scale({position:'bottomleft',imperial:false}).addTo(map);
			// map.setView([40.012834, 116.476293], 17);
			/**
			 * 右键点击地图位置居中
			 * 由于任务圈使用的是MultiPolygon，contextmenu、click等事件在MultiPolygon中不起作用了
			 * 目前使用的方案是使用mousedown事件，并用event.originalEvent.button来判断是左键、中键、右键的点击
			 * 另一种经验证可行方案是把任务圈的multipolygon改为polygon，用click事件来监听左键、中键的点击事件，用contextmenu来监听右键事件
			 * contextmenu事件在polygon中不起作用了，因此使用mousedown进行补充
			 */
			map.on("contextmenu", function(e) { // 右键
				map.setView(e.latlng);
			});
			map.on("mousedown", function(e) {
				if (e.originalEvent.button == 2) { // 右键
					map.setView(e.latlng);
				}
			});
			// map.on("click", function(e) {
			//     console.log('click');
			// });
			// map.on("mousedown", function(e) {
			//     console.log(e.originalEvent.button);
			// });
			//属性编辑ctrl(解析对比各个数据类型)
			var shapeCtrl = new fastmap.uikit.ShapeEditorController();
			var tooltipsCtrl = new fastmap.uikit.ToolTipsController();
			tooltipsCtrl.setMap(map, 'tooltip');
			shapeCtrl.setMap(map);
			layerCtrl.eventController.on(eventCtrl.eventTypes.LAYERONSHOW, function(event) {
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
		// 加载元数据
		var loadMetaData = function() {
			var promises = [];
			// 查询全部的小分类数据
			var param = {
				mediumId: "",
				region: 0
			};
			promises.push(dsMeta.getKindList(param).then(function(kindData) {
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
				$scope.allKindList = kindData; //存储所有的分类
				//在数组最前面增加
				$scope.allKindList.unshift({
					"id": "0",
					"kindCode": "0",
					"kindName": "--请选择--"
				});
			}));
			// 查询全部的品牌数据
			param = {
				kindCode: ""
			};
			promises.push(dsMeta.getChainList(param).then(function(chainData) {
				$scope.metaData.allChain = chainData;
			}));
			return promises;
		};
		//获取当前小分类所对应的大分类下的所有小分类
		$scope.getCurrentKindByLittle = function(data) {
			var poiKindCode = data.kindCode;
			var state = data.state;
			$scope.metaData.kindFormatPart = [];
			$scope.metaData.kindListPart = [];
			/*解析分类，组成select-chosen需要的数据格式*/
			for (var i = 0; i < $scope.allKindList.length; i++) {
				if (state == 1 || state == 0 || poiKindCode == "") { //新增 or 无 or 种别为空
					$scope.metaData.kindFormatPart[$scope.allKindList[i].kindCode] = {
						kindId: $scope.allKindList[i].id,
						kindName: $scope.allKindList[i].kindName,
						level: $scope.allKindList[i].level,
						extend: $scope.allKindList[i].extend,
						parentFlag: $scope.allKindList[i].parent,
						chainFlag: $scope.allKindList[i].chainFlag,
						dispOnLink: $scope.allKindList[i].dispOnLink,
						mediumId: $scope.allKindList[i].mediumId
					};
					$scope.metaData.kindListPart.push({
						value: $scope.allKindList[i].kindCode,
						text: $scope.allKindList[i].kindName,
						mediumId: $scope.allKindList[i].mediumId
					});
				} else { //删除or修改
					if (poiKindCode.substr(0, 2) == $scope.allKindList[i].kindCode.substr(0, 2)) {
						$scope.metaData.kindFormatPart[$scope.allKindList[i].kindCode] = {
							kindId: $scope.allKindList[i].id,
							kindName: $scope.allKindList[i].kindName,
							level: $scope.allKindList[i].level,
							extend: $scope.allKindList[i].extend,
							parentFlag: $scope.allKindList[i].parent,
							chainFlag: $scope.allKindList[i].chainFlag,
							dispOnLink: $scope.allKindList[i].dispOnLink,
							mediumId: $scope.allKindList[i].mediumId
						};
						$scope.metaData.kindListPart.push({
							value: $scope.allKindList[i].kindCode,
							text: $scope.allKindList[i].kindName,
							mediumId: $scope.allKindList[i].mediumId
						});
					}
				}
			}
		};
		var loadToolsPanel = function() {
			$ocLazyLoad.load(appPath.root + 'scripts/components/tools/ctrls/toolbar/toolbarPanelCtrl.js').then(function() {
				$scope.editorToolbarTpl = appPath.root + 'scripts/components/tools/tpls/toolbar/toolbarPanelTpl.htm';
			});
			$ocLazyLoad.load(appPath.poi + 'ctrls/edit-tools/optionBarCtl').then(function() {
				$scope.consoleDeskTpl = appPath.root + appPath.poi + 'tpls/edit-tools/optionBarTpl.html';
			});
		};
		/*//我的消息
		 $scope.historyMsg = function(){
		 var param = {
		 userId:parseInt(document.cookie.split(';')[0].split('=')[1]),
		 pageNum:5,
		 pageSize:1
		 };
		 dsFcc.getReadMsg(param).then(function(data){
		 console.log(data)
		 });
		 };
		 //查看详细消息
		 $scope.showDetailMsg = function(){
		 var param = {
		 userId:parseInt(document.cookie.split(';')[0].split('=')[1]),
		 msgId:116
		 };
		 dsFcc.getDetailCheck(param).then(function(data){
		 console.log(data)
		 });
		 };*/
		// 消息推送
		$scope.msgNotify = function() {
			// 创建一个Socket实例
			var sock = new WebSocket('ws://' + App.Util.getFullUrl('sys/sysMsg/webSocketServer').substr(5)),
				msgCount = 0;
			sock.onopen = function() {
				console.log('已经建立websocket连接...');
			};
			sock.onmessage = function(e) {
				console.log('message', JSON.parse(e.data));
				if (JSON.parse(e.data).length == 1) {
					$scope.systemMsg.unshift(JSON.parse(e.data)[0]);
				} else if (JSON.parse(e.data).length > 1) {
					$scope.systemMsg = JSON.parse(e.data);
				}
				$scope.sysMsgItem = $scope.systemMsg;
				if (msgCount > 0) {
					logMsgCtrl.pushMsg($scope, $scope.sysMsgItem[0].msgContent);
				}
				msgCount++;
				$scope.$apply();
			};
			sock.onclose = function() {
				console.log('关闭websocket连接...');
			};
			window.onbeforeunload = function() {
				sock.close();
			};
			// sock.close();
			/*if(App.Config.msgNotify){
			 var timer = $interval(function() {
			 dsEdit.getMsgNotify().then(function(data) {
			 if (data.errcode == 0) {
			 // data.data = [{"msgId":22,"msgType":1,"msgContent":"CCC","createTime":1473414246000,"targetUserId":1664}];
			 if (data.data.length > 0) {
			 // $interval.cancel(timer);
			 for(var i=0,len=data.data.length;i<len;i++){
			 logMsgCtrl.pushMsg($scope,data.data[i].msgContent);
			 }
			 }
			 }else{
			 logMsgCtrl.pushMsg($scope,data.errmsg);
			 }
			 });
			 }, App.Config.msgNotify);
			 }*/
		};
		//消息类型切换
		$scope.switchMsgType = function(type) {
			$scope.sysMsgItem = [];
			if (type == 'new') {
				$scope.sysMsgItem = $scope.systemMsg;
			} else {
				var param = {
					userId: parseInt(document.cookie.split(';')[0].split('=')[1]),
					pageNum: $scope.currentPage,
					pageSize: 5
				};
				dsFcc.getReadMsg(param).then(function(data) {
					if (data) {
						$scope.sysMsgItem = data.result;
						$scope.totalItems = data.totalCount;
					}
				});
			}
			$scope.sysMsgType = type;
		};
		//历史消息翻页
		$scope.pageChanged = function(pageNow) {
			var param = {
				userId: parseInt(document.cookie.split(';')[0].split('=')[1]),
				pageNum: pageNow,
				pageSize: 5
			};
			dsFcc.getReadMsg(param).then(function(data) {
				if (data) {
					$scope.sysMsgItem = data.result;
					$scope.totalItems = data.totalCount;
					$scope.currentPage = pageNow;
				}
			});
		};
		//查看详细信息
		$scope.showDetailMsg = function(id) {
			if (id == -1) {
				$scope.showMsgDetail = false;
			} else {
				var param = {
					// userId:parseInt(document.cookie.split(';')[0].split('=')[1]),
					msgId: id
				};
				if ($scope.sysMsgType == 'new') {
					dsFcc.getReadCheck(param).then(function(data) {
						$scope.sysMsgObj = data[0];
						for (var i = 0; i < $scope.systemMsg.length; i++) {
							if ($scope.systemMsg[i].msgId == id) {
								$scope.systemMsg.splice(i, 1);
								return;
							}
						}
					});
				} else {
					dsFcc.getDetailCheck(param).then(function(data) {
						$scope.sysMsgObj = data[0];
					});
				}
				$scope.showMsgDetail = true;
			}
		};
		//页面初始化方法调用
		var initPage = function() {
			var subtaskId = App.Util.getUrlParam("subtaskId");
			$scope.specialWork = App.Util.getUrlParam("specialWork") || false; //专项作业
			App.Temp.subTaskId = subtaskId;
			dsManage.getSubtaskById(subtaskId).then(function(data) {
				if (data) {
					// 暂时注释
					App.Temp.dbId = data.dbId;
                    App.Temp.taskType = data.type;
					App.Temp.gridList = data.gridIds;
                    $scope.currentSubTaskType = data.type;
					if (data.stage == 1) { // 日编
						App.Temp.mdFlag = "d";
					} else if (data.stage == 2) { // 月编
						App.Temp.mdFlag = "m";
					} else { // 默认：日编
						App.Temp.mdFlag = "d";
					}
					loadMap(data);
					var promises = loadMetaData();
					$q.all(promises).then(function() {
						loadToolsPanel();
						if (data.type == 0) { // POI任务
							$scope.changeProject(1);
						} else { // 一体化、道路、专项任务
							$scope.changeProject(2);
						}
						bindHotKeys($ocLazyLoad, $scope, dsEdit, appPath, $rootScope); //注册快捷键
					});
				}
			});
			if ($scope.specialWork) {
				/*判断是否为专项作业，如果是则其他tab不能编辑*/
				$scope.isSpecialOperation = true;
			}
			$scope.logMsgStyle = {
				'display': 'block'
			};
			$scope.msgNotify();
			//默认显示新消息
			$scope.sysMsgType = 'new';
			//未读消息
			$scope.systemMsg = [];
			//系统消息详细信息
			$scope.sysMsgObj = {
				msgContent: '',
				msgId: 0,
				msgTitle: ''
			};
			$scope.showMsgDetail = false;
			//历史消息当前页1
			$scope.currentPage = 1;
		};
		//高亮作业区域方法;
		function hightLightWorkArea(substaskGeomotry) {
			var wkt = new Wkt.Wkt();
			var pointsArr = new Array();
			//读取wkt格式的集合对象;
			try {
				var polygon = wkt.read(substaskGeomotry);
				var coords = polygon.components;
				var points = [];
				var point = [];
				var poly = [];
				for (var i = 0; i < coords.length; i++) {
					for (var j = 0; j < coords[i].length; j++) {
						if (polygon.type == 'multipolygon') {
							for (var k = 0; k < coords[i][j].length; k++) {
								point.push(new L.latLng(coords[i][j][k].y, coords[i][j][k].x));
							}
						} else {
							point.push(new L.latLng(coords[i][j].y, coords[i][j].x));
						}
					}
					points.push(point);
					point = [];
				}
				return points;
			} catch (e1) {
				try {
					wkt.read(substaskGeomotry.replace('\n', '').replace('\r', '').replace('\t', ''));
				} catch (e2) {
					if (e2.name === 'WKTError') {
						swal("错误", 'WKT数据有误，请检查！', "error");
						return;
					}
				}
			}
		}
		/**
		 * 页面初始化方法调用
		 */
		initPage();
		/**
		 * 保存数据
		 */
		$scope.doSave = function() {
			eventCtrl.fire(eventCtrl.eventTypes.SAVEPROPERTY);
		};
		/**
		 * 删除数据
		 */
		$scope.doDelete = function() {
			swal({
				title: "确认删除？",
				type: "warning",
				animation: 'slide-from-top',
				showCancelButton: true,
				confirmButtonText: "是的，我要删除",
				confirmButtonColor: "#ec6c62"
			}, function(f) {
				if (f) {
					eventCtrl.fire(eventCtrl.eventTypes.DELETEPROPERTY);
				}
			});
		};
		/**
		 * 取消编辑
		 */
		$scope.doCancel = function() {
			$scope.tipsPanelOpened = false;
			//$scope.attrTplContainer = "";
			$scope.attrTplContainerSwitch(false);
			//$scope.subAttrTplContainerSwitch(false);
			//eventCtrl.fire(eventCtrl.eventTypes.CANCELEVENT)
		};
		$scope.goback = function() {
			window.location.href = appPath.root + "apps/imeep/task/taskPage.html?access_token=" + App.Temp.accessToken;
		};
		$scope.advancedTool = null;
		/*监听弹窗*/
		$scope.$on('openModelEvent', function(event, data) {
			$scope.openAdvancedToolsPanel(data);
		});
		$scope.openAdvancedToolsPanel = function(toolType) {
			if ($scope.advancedTool == toolType) {
				return;
			}
			switch (toolType) {
				case 'search':
					$ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/searchPanelCtrl').then(function() {
						$scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
					});
					// $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/searchPanelTpl.html';
					break;
				case 'auto':
					$ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/autofillJobPanelCtrl').then(function() {
						$scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/autofillJobPanelTpl.html';
					});
					// $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/autofillJobPanelTpl.html';
					break;
				case 'batch':
					$ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/batchJobPanelNewCtrl').then(function() {
						$scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/batchJobPanelNewTpl.html';
					});
					// $scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/batchJobPanelTpl.html';
					break;
				case 'check':
					$ocLazyLoad.load(appPath.tool + 'ctrls/assist-tools/beginCheckPanelCtrl').then(function() {
						$scope.advancedToolPanelTpl = appPath.root + appPath.tool + 'tpls/assist-tools/beginCheckPanelTpl.html';
					});
					break;
			}
			$scope.advancedTool = toolType;
		};
		$scope.closeSpecialWorkPanelTpl = function() {
			$scope.workPanelOpened = false;
		};
		$scope.openSpecialWorkPanelTpl = function() {
			$scope.workPanelOpened = true;
			$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameCtl.js').then(function() {
				$scope.specialWorkPanelTpl = appPath.root + 'scripts/components/road/tpls/specialwork/roadNameTpl.htm';
			});
		};
		$scope.thematicMapChange = function() {
			var layerCtrl = fastmap.uikit.LayerController();
			var rdLink = layerCtrl.getLayerById('rdLink');
			App.Temp.thematicMapFlag = !$scope.thematicMapShow;
			$scope.thematicMapShow = !$scope.thematicMapShow;
			rdLink.redraw();
		};
		$scope.closeAdvancedToolsPanel = function() {
			$scope.advancedTool = null;
		};
		$scope.$on('closeAdvancedTools', function(event, data) {
			$scope.closeAdvancedToolsPanel();
		});
		/*start 事件监听*******************************************************************/
		//响应选择要素类型变化事件，清除要素页面的监听事件
		eventCtrl.on(eventCtrl.eventTypes.SELECTEDFEATURETYPECHANGE, function(data) {
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
		$scope.$on("SWITCHCONTAINERSTATE", function(event, data) {
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
		$scope.$on("transitCtrlAndTpl", function(event, data) {
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
				if (data["rectData"]) {
					featCodeCtrl.setFeatCode({
						"data": data["rectData"],
						"meta": $scope.metaData
					});
				}
			}
			if (data["data"]) {
				$scope.subAttributeData = data["data"];
			}
			$ocLazyLoad.load(data["propertyCtrl"]).then(function() {
				$scope[data["loadType"]] = data["propertyHtml"];
				if (data["callback"]) {
					data["callback"]();
				}
			});
			if (data['data'] && data['data'].length && data['data'][0].geoLiveType == 'RDTOLLGATENAME') {
				$scope.$broadcast('refreshTollgateName', {});
			}
			if (data['data'] && data['data'].geoLiveType == 'RDTOLLGATEPASSAGE') {
				$scope.$broadcast('refreshTollgatePassage', {});
			}
			if (data['data'] && data['data'].geoLiveType == 'RDLANECONDITION') {
				$scope.$broadcast('refreshLaneCondition', {});
			}
			//刷新二级菜单
			if (data["type"] == "refreshPage") {
				$scope.$broadcast('refreshPage', {});
			}
		});
		$scope.$on("refreshPhoto", function(event, data) {
			$scope.$broadcast('refreshImgsData', true);
		});
		$scope.$on("highLightPoi", function(event, pid) {
			$scope.$broadcast("highlightPoiByPid", pid);
			$scope.$broadcast("clearQueueItem", pid); //当文件上传组件加载完成之后，就需要通过此方法修改pid的值，具体查看 接收clearQueueItem的方法
			$scope.selectPoi = pid; //这样写的目的是为了在文件上传组件第一次加载的时候能取到pid
		});
		// $scope.checkPageNow = 1;
		/*高亮检查结果poi点*/
		$scope.$on('getHighlightData', function(event, data) {
			$scope.showOnMap(data.pid, data.type);
		});
		/*关闭Tips面板*/
		$scope.$on('closePopoverTips', function(event, img) {
			$scope.tipsPanelOpened = false;
		});
		/*全屏显示*/
		$scope.$on('showFullScreen', function(event, img) {
			$scope.pImageNow = img;
			$scope.showFullScreen = true;
		});
		/*接收全屏请求*/
		$scope.$on('showRoadFullScreen', function(event, data) {
			$scope.roadFullScreen = true;
		});
		/*弹出控制台*/
		$scope.$on('openConsole', function(event, data) {
			if (data.type == 'searchResult') {
				$scope.$broadcast('getSearchResult', data.data);
				$scope.searchResultParam = data.param;
				$scope.consolePanelOpened = true;
			}
		});
		$scope.$on('job-autofill', function(event, data) {
			if (data.status == 'begin') {
				$scope.autofillRunning = true;
			} else if (data.status == 'end') {
				$scope.autofillRunning = false;
				// $scope.closeAdvancedToolsPanel();
			}
		});
		/*批处理*/
		$scope.$on('job-batch', function(event, data) {
			if (data.status == 'begin') {
				$scope.batchRunning = true;
			} else if (data.status == 'end') {
				$scope.batchRunning = false;
				// $scope.closeAdvancedToolsPanel();
			}
		});
		/*执行检查*/
		$scope.$on('job-check', function(event, data) {
			if (data.status == 'begin') {
				$scope.checkRunning = true;
			} else if (data.status == 'end') {
				$scope.checkRunning = false;
			}
		});
		$scope.$on('job-search', function(event, data) {
			if (data.status == 'begin') {
				$scope.searching = true;
			} else if (data.status == 'end') {
				$scope.searching = false;
				// $scope.closeAdvancedToolsPanel();
			}
		});
		//清除表单修改后的样式
		$scope.$on("clearAttrStyleUp", function(event, data) {
			$scope.$broadcast("clearAttrStyleDown");
		});
		//场景切换
		// $scope.$on("changeScene", function (event, data) {
		//  $scope.$broadcast("changeSceneLayers",data);
		// });
		//道路作业面板是否展开
		$scope.$on("WORKPANELOPENCLOSE", function(event, data) {
			$scope.workPanelOpened = !$scope.workPanelOpened;
			$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/specialwork/roadNameCtl.js').then(function() {
				$scope.specialWorkPanelTpl = appPath.root + 'scripts/components/road/tpls/specialwork/roadNameTpl.htm';
			});
		});
		//道路作业面板是否展开
		$scope.$on("OPENRDLANETOPO", function(event, data) {
			$scope.workPanelOpened = !$scope.workPanelOpened;
			$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/attr_lane_ctrl/rdLaneTopoCtrl.js').then(function() {
				$scope.rdLaneTopoPanelTpl = appPath.root + 'scripts/components/road/tpls/attr_lane_tpl/rdLaneTopoTpl.html';
			});
		});
		//道路作业面板是否展开
		$scope.$on("CLOSERDLANETOPO", function(event, data) {
			$ocLazyLoad.load(appPath.root + 'scripts/components/road/ctrls/blank_ctrl/blankCtrl.js').then(function() {
				$scope.rdLaneTopoPanelTpl = appPath.root + 'scripts/components/road/tpls/blank_tpl/blankTpl.html';
			});
			$scope.workPanelOpened = !$scope.workPanelOpened;
		});
		/**
		 * 为了解决多次点击保存子表重复新增的问题，增加此方法，保存完成之后重新调用查询方法
		 */
		$scope.$on("reQueryByPid", function(event, data) {
			if (data.type == "IXPOI") {
				dsEdit.getByPid(data.pid, "IXPOI").then(function(rest) {
					if (rest) {
						$scope.getCurrentKindByLittle(rest); //获取当前小分类所对应的大分类下的所有小分类

						objectCtrl.setCurrentObject('IXPOI', rest);
						objectCtrl.setOriginalData(objectCtrl.data.getIntegrate());
						eventCtrl.fire(eventCtrl.eventTypes.SELECTBYATTRIBUTE, { //重新执行图片显示
							feature: rest
						});
						$scope.$emit("transitCtrlAndTpl", {
							"loadType": "tipsTplContainer",
							"propertyCtrl": appPath.poi + "ctrls/attr-tips/poiPopoverTipsCtl",
							"propertyHtml": appPath.root + appPath.poi + "tpls/attr-tips/poiPopoverTips.html"
						});
						$scope.$emit("transitCtrlAndTpl", {
							"loadType": "attrTplContainer",
							"propertyCtrl": appPath.poi + "ctrls/attr-base/generalBaseCtl",
							"propertyHtml": appPath.root + appPath.poi + "tpls/attr-base/generalBaseTpl.html"
						});
						//$scope.highlightPoi(rest.pid);
						//$scope.$emit("highLightPoi", rest.pid);
						$scope.$emit("refreshPhoto", true);
						$scope.$broadcast("clearAttrStyleDown"); //父向子
						//$scope.$emit("clearAttrStyleUp");//清除属性样式-子向父
					}
				});
			}
		});
		/**
		 * 接收地图上框选同一点线事件
		 */
		$scope.$on("showSameNodeOrLink", function(event, data) {
			$scope.$broadcast("showSameRelationshap");
		});
		/**
		 * 接收地图上框选同一POI事件
		 */
		$scope.$on("showSamePoi", function(event, data) {
			$scope.$broadcast("showSamePoishap");
		});
		/**
		 /**
		 * 接收刷新检查结果事件
		 */
		$scope.$on("refreshCheckResultToMainPage", function(event, data) {
			$scope.$broadcast("refreshCheckResult");
		});
		/*修改收费站通道信息，刷新ETC code*/
		$scope.$on("tollGateCardType", function(event, data) {
			$scope.$broadcast('refreshEtcCode', true);
		});
		/*调loading*/
		$scope.$on("showFullLoadingOrNot", function(event, data) {
			$scope.showLoading.flag = data;
		});
		// $ocLazyLoad.load(appPath.road + "ctrls/attr_lane_ctrl/rdLaneCtrl").then(function () {
		//  $scope.attrTplContainer = appPath.root + appPath.road + "tpls/attr_lane_tpl/rdLaneTpl.html";
		// });
		// $scope.attrTplContainerSwitch(true);
	}
]);