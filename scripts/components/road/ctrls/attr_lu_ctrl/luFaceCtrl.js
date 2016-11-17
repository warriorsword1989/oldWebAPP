/**
 * Created by mali on 2016/7/22.
 */
angular.module('app').controller('luFaceCtrl', ['$scope', 'dsEdit', 'appPath', '$filter', function ($scope, dsEdit, appPath, $filter) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var luFace = layerCtrl.getLayerById('luFace');
    var outputCtrl = fastmap.uikit.OutPutController({});
    $scope.kind = [
        { id: 0, label: '未分类' },
        { id: 1, label: '大学' },
        { id: 2, label: '购物中心' },
        { id: 3, label: '医院' },
        { id: 4, label: '体育场' },
        { id: 5, label: '公墓' },
        { id: 6, label: '地上停车场' },
        { id: 7, label: '工业区' },
        { id: 11, label: '机场' },
        { id: 12, label: '机场跑道' },
        { id: 21, label: 'BUA面' },
        { id: 22, label: '邮编面' },
        { id: 23, label: 'FM面' },
        { id: 24, label: '车厂面' },
        { id: 31, label: '休闲娱乐' },
        { id: 31, label: '景区' },
        { id: 32, label: '会展中心' },
        { id: 33, label: '火车站' },
        { id: 34, label: '文化厂区' },
        { id: 35, label: '商务区' },
        { id: 36, label: '商业区' },
        { id: 37, label: '小区' },
        { id: 38, label: '广场' },
        { id: 39, label: '特色区域' },
        { id: 40, label: '地下停车场' },
        { id: 41, label: '地铁出入口面' }
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
    // 刷新luFaceData.faceNames
    $scope.refreshNames = function () {
        $scope.luFaceData.faceNames = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.luFaceData.faceNames.unshift($scope.nameGroup[i][j]);
            }
        }
    };
    // 初始化
    $scope.initializeData = function () {
        $scope.luFaceData = objCtrl.data;// 获取数据
        $scope.isBatch = ($scope.luFaceData.kind == 21) ? true : false;
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 存储原始数据
        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.luFaceForm) {
            $scope.luFaceForm.$setPristine();
        }
        $scope.nameGroup = [];
        initNameInfo();
        // 高亮luface
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.luFaceData.pid.toString(),
            layerid: 'luFace',
            type: 'luFace',
            style: {}
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };
    if (objCtrl.data) {
        $scope.initializeData();
    }
    $scope.save = function () {
    	$scope.refreshNames();
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        // 保存调用方法
        dsEdit.update($scope.luFaceData.pid, 'LUFACE', objCtrl.changedProperty).then(function (data) {
            if (data) {
            	luFace.redraw();
            	dsEdit.getByPid($scope.luFaceData.pid, 'LUFACE').then(function (ret) {
                if (ret) {
                    objCtrl.setCurrentObject('LUFACE', ret);
                    objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                }
            });
//                if($scope.lcLinkForm) {
//                    $scope.lcLinkForm.$setPristine();
//                }
            }
        });
        $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
    };
    /**
     *
     */
    $scope.setUrban = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.luFaceData.pid;
        param.ruleId = 'BATCHBUAURBAN';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('赋Urban批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };
    /**
     *
     */
    $scope.deleteUrban = function () {
        $scope.$emit('showFullLoadingOrNot', true);
        var param = {};
        param.pid = $scope.luFaceData.pid;
        param.ruleId = 'BATCHDELURBAN';
        dsEdit.PolygonBatchWork(param).then(function (data) {
            if (typeof data === 'string') {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('不存在需要批处理的link数据', data, 'warning');
            } else {
                $scope.$emit('showFullLoadingOrNot', false);
                swal('删除Urban批处理成功：', '处理了' + data.log.length + '条数据', 'success');
            }
        });
    };

    // 删除
    $scope.delete = function () {
        dsEdit.delete($scope.luFaceData.pid, 'LUFACE').then(function (data) {
            if (data) {
                luFace.redraw();// 重绘
                $scope.luFaceData = null;
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
    /* 展示详细信息*/
    $scope.showDetail = function (index, nameGroupid) {
//        var tempCtr = '', tempTepl = '';
//        //名称信息
//        tempCtr = appPath.road + 'ctrls/attr_lu_ctrl/nameInfoCtrl';
//        tempTepl = appPath.root + appPath.road + 'tpls/attr_lu_Tpl/nameInfoTpl.html';
//        var detailInfo = {
//            "loadType": "subAttrTplContainer",
//            "propertyCtrl": tempCtr,
//            "propertyHtml": tempTepl,
//            "data":objCtrl.data.faceNames
//        };
//        $scope.$emit("transitCtrlAndTpl", detailInfo);
//        eventController.fire('SHOWNAMEGROUP');
        var showNameInfoObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
    			loadType: 'subAttrTplContainer',
    			propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
    			propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
    			callback: function () {
    				var showNameObj = {
    					loadType: 'subAttrTplContainer',
    					propertyCtrl: 'scripts/components/road/ctrls/attr_lu_ctrl/luFaceNameCtrl',
    					propertyHtml: '../../../scripts/components/road/tpls/attr_lu_tpl/luFaceNameTpl.html'
    				};
    				$scope.$emit('transitCtrlAndTpl', showNameObj);
    			}
    	};
//        objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup,nameGroupid);
        objCtrl.namesInfos = $scope.nameGroup[index];
    	$scope.$emit('transitCtrlAndTpl', showNameInfoObj);
    };
    function initNameInfo() {
        if ($scope.luFaceData.faceNames.length > 0) {
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
            $scope.luFaceData.faceNames.sort(compare('nameGroupid'));
			// 获取所有的nameGroupid
            var nameGroupidArr = [];
            for (var i = 0; i < $scope.luFaceData.faceNames.length; i++) {
            	nameGroupidArr.push($scope.luFaceData.faceNames[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (var i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.luFaceData.faceNames.length; j < le; j++) {
                    if ($scope.luFaceData.faceNames[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.luFaceData.faceNames[j]);
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
    $scope.addItem = function () {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.luFaceData.faceNames.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.luFaceData.faceNames, 'nameGroupid');
        }
        objCtrl.data.faceNames.unshift(fastmap.dataApi.luFaceName({
            nameGroupid: maxNameGroupId + 1,
            pid: $scope.luFaceData.pid
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
