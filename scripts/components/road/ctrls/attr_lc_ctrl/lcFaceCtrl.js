/**
 * Created by linglong on 2016/7/22.
 */
angular.module('app').controller('lcFaceCtrl', ['$scope', 'dsEdit', 'appPath', function ($scope, dsEdit, appPath) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var lcFace = layerCtrl.getLayerById('lcFace');
    $scope.kind = [
	       { id: 0, label: '未分类' },
	       { id: 1, label: '海域' },
	       { id: 2, label: '河川域' },
	       { id: 3, label: '湖沼池' },
	       { id: 4, label: '水库' },
	       { id: 5, label: '港湾' },
	       { id: 6, label: '运河' },
	       { id: 11, label: '公园' },
	       { id: 12, label: '高尔夫球场' },
	       { id: 13, label: '滑雪场' },
	       { id: 14, label: '树林林地' },
	       { id: 15, label: '草地' },
	       { id: 16, label: '绿化带' },
	       { id: 17, label: '岛屿' }
	   ];
    $scope.form = [
        { id: 0, label: '无' },
        { id: 1, label: '暗沙' },
        { id: 2, label: '浅滩' },
        { id: 3, label: '珊瑚礁' },
        { id: 4, label: '礁' },
        { id: 8, label: '湖泊(国界内)' },
        { id: 9, label: '湖泊(国界外)' },
        { id: 10, label: '界河' }
    ];
    $scope.displayClass = [
        { id: 0, label: '默认值' },
        { id: 1, label: '1级' },
        { id: 2, label: '2级' },
        { id: 3, label: '3级' },
        { id: 4, label: '4级' },
        { id: 5, label: '5级' },
        { id: 6, label: '6级' },
        { id: 7, label: '7级' },
        { id: 7, label: '8级' }
    ];
    $scope.scale = [
        { id: 0, label: '2.5万' },
        { id: 1, label: '20万' },
        { id: 2, label: '100万' }
    ];
    $scope.detailFlag = [
        { id: 0, label: '不应用' },
        { id: 1, label: '只存在于详细区域' },
        { id: 2, label: '只存在于广域区域' },
        { id: 3, label: '存在于详细和广域区域' }
    ];
	// 语言代码对应关系
	$scope.langCodeRelation = {
		CHI: 1,
		CHT: 2,
		ENG: 3,
		POR: 4,
		ARA: 5,
		BUL: 6,
		CZE: 7,
		DAN: 8,
		DUT: 9,
		EST: 10,
		FIN: 11,
		FRE: 12,
		GER: 13,
		HIN: 14,
		HUN: 15,
		ICE: 16,
		IND: 17,
		ITA: 18,
		JPN: 19,
		KOR: 20,
		LIT: 21,
		NOR: 22,
		POL: 23,
		RUM: 24,
		RUS: 25,
		SLO: 26,
		SPA: 27,
		SWE: 28,
		THA: 29,
		TUR: 30,
		UKR: 31,
		SCR: 32
	};
    // 刷新lcFaceData.names
    $scope.refreshNames = function () {
        $scope.lcFaceData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.lcFaceData.names.push($scope.nameGroup[i][j]);
            }
        }
    };
    // 初始化
    $scope.initializeData = function () {
        $scope.lcFaceData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.lcFaceForm) {
            $scope.lcFaceForm.$setPristine();
        }
        $scope.nameGroup = [];
        initNameInfo();
        // 高亮lcface
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.lcFaceData.pid.toString(),
            layerid: 'lcFace',
            type: 'lcFace',
            style: {}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    $scope.save = function () {
    	$scope.refreshNames();
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        // 保存调用方法
        dsEdit.update($scope.lcFaceData.pid, 'LCFACE', objCtrl.changedProperty).then(function (data) {
            if (data) {
            	lcFace.redraw();
            	dsEdit.getByPid($scope.lcFaceData.pid, 'LCFACE').then(function (ret) {
                if (ret) {
                    objCtrl.setCurrentObject('LCFACE', ret);
                    objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                }
            });
                // objCtrl.setOriginalData(objCtrl.data.getIntegrate());
//                if($scope.lcLinkForm) {
//                    $scope.lcLinkForm.$setPristine();
//                }
            }
        });
        $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
//        $scope.$emit("SWITCHCONTAINERSTATE", {"attrContainerTpl": false, "subAttrContainerTpl": false})
    };

    // 删除
    $scope.delete = function () {
        dsEdit.delete($scope.lcFaceData.pid, 'LCFACE').then(function (data) {
            if (data) {
                lcFace.redraw();// 重绘
                $scope.lcFaceData = null;
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures.length = 0;
                var editorLayer = layerCtrl.getLayerById('edit');
                editorLayer.clear();
                $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
            }
        });
    };
    $scope.cancel = function () {

    };

    $scope.kindChange = function (event, obj) {
    	if (obj.lcFaceData.kind == 1 || obj.lcFaceData.kind == 2 || obj.lcFaceData.kind == 3 || obj.lcFaceData.kind == 4 || obj.lcFaceData.kind == 5 || obj.lcFaceData.kind == 6 || obj.lcFaceData.kind == 17) {
    		obj.lcFaceData.detailFlag = 3;
    	} else if (obj.lcFaceData.kind == 11 || obj.lcFaceData.kind == 12 || obj.lcFaceData.kind == 13 || obj.lcFaceData.kind == 14 || obj.lcFaceData.kind == 15 || obj.lcFaceData.kind == 16) {
    		obj.lcFaceData.detailFlag = 1;
    	} else if (obj.lcFaceData.kind == 0) {
    		obj.lcFaceData.detailFlag = 0;
    	}
    };

    /* 展示详细信息*/
    $scope.showDetail = function (index, nameInfo, nameGroupid) {
        var showNameInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
    			loadType: 'subAttrTplContainer',
    			propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
    			propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
    			callback: function () {
    				var showNameObj = {
    					loadType: 'subAttrTplContainer',
    					propertyCtrl: 'scripts/components/road/ctrls/attr_lc_ctrl/lcFaceNameCtrl',
    					propertyHtml: '../../../scripts/components/road/tpls/attr_lc_tpl/lcFaceNameTpl.html'
    				};
    				$scope.$emit('transitCtrlAndTpl', showNameObj);
    			}
    	};
        objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup, nameGroupid);
    	$scope.$emit('transitCtrlAndTpl', showNameInfoObj);
    };
    /** **
     * 根据nameGroupid获取对应的数据
     */
    $scope.getItemByNameGroupid = function (arr, nameGroupid) {
    	var index = -1;
    	var item;
    	for (var i = 0; i < arr.length; i++) {
    		for (var j = 0; j < arr[i].length; j++) {
    			if (arr[i][j].nameGroupid == nameGroupid) {
    				index = i;
    				break;
    			}
    		}
    		if (index >= 0) {
    			item = arr[i];
    			break;
    		}
    	}
    	return item;
    };
    // 初始化;
    if (objCtrl.data) {
        $scope.initializeData();
    }
    $scope.$watch($scope.nameGroup, function (newValue, oldValue, scope) {
        $scope.refreshNames();
    });
    function initNameInfo() {
        if ($scope.lcFaceData.names.length > 0) {
            $scope.nameGroup = [];
			/* 根据数据中对象某一属性值排序*/
            function compare(propertyName) {
                return function (object1, object2) {
                    var value1 = object1[propertyName];
                    var value2 = object2[propertyName];
                    if (value2 < value1) {
                        return -1;
                    } else if (value2 > value1) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
            }
            $scope.lcFaceData.names.sort(compare('nameGroupid'));
			// 获取所有的nameGroupid
            var nameGroupidArr = [];
            for (var i = 0; i < $scope.lcFaceData.names.length; i++) {
            	nameGroupidArr.push($scope.lcFaceData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (var i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.lcFaceData.names.length; j < le; j++) {
                    if ($scope.lcFaceData.names[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.lcFaceData.names[j]);
	                    tempArr.sort(function (a, b) {
		                    return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
	                    });
                    }
                }
                $scope.nameGroup.push(tempArr);
            }
            $scope.refreshNames();
        }
    }
    /* 增加item*/
    $scope.addItem = function (type) {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.lcFaceData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.lcFaceData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.lcFaceName({
            nameGroupid: maxNameGroupId + 1,
            pid: $scope.lcFaceData.pid
        }));
        initNameInfo();
    };
	/* 移除item*/
    $scope.removeItem = function (index, item) {
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            if ($scope.nameGroup[i]) {
                for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                    if ($scope.nameGroup[i][j] === item) {
                        if ($scope.nameGroup[i].length == 1) {
                            $scope.nameGroup.splice(i, 1);
                            for (var n = 0, nu = $scope.nameGroup.length; n < nu; n++) {
                                if (n >= i) {
                                    for (var m = 0, num = $scope.nameGroup[n].length; m < num; m++) {
                                        $scope.nameGroup[n][m].nameGroupid--;
                                    }
                                }
                            }
                        } else {
                            $scope.nameGroup[i].splice(index, 1);
                        }
                    }
                }
            }
        }
        $scope.refreshNames();
        $scope.$emit('SWITCHCONTAINERSTATE', {
            subAttrContainerTpl: false,
            attrContainerTpl: true
        });
    };
    // 监听保存，修改,删除，取消，和初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
