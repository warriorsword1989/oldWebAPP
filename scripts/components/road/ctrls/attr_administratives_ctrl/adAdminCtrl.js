/**
 * Created by zhaohang on 2016/4/5.
 */
var adAdminZone = angular.module('app');
adAdminZone.controller('adAdminController', ['$scope', 'appPath', 'dsEdit', function ($scope, appPath, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var layerCtrl = fastmap.uikit.LayerController();
    var outputCtrl = fastmap.uikit.OutPutController({});
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    var adAdmin = layerCtrl.getLayerById('adAdmin');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var toolTipsCtrl = fastmap.uikit.ToolTipsController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    $scope.isbase = true;

    // 行政类型
    $scope.adminType = [
        { id: 0, label: '国家地区级' },
        { id: 1, label: '省/直辖市/自治区' },
        { id: 2, label: '地级市/自治州/省直辖县' },
        { id: 2.5, label: 'DUMMY 地级市' },
        { id: 3, label: '地级市市区(GCZone)' },
        { id: 3.5, label: '地级市市区(未作区界)' },
        { id: 4, label: '区县/自治县' },
        { id: 4.5, label: 'DUMMY 区县' },
        { id: 4.8, label: 'DUMMY 区县(地级市下无区县)' },
        { id: 5, label: '区中心部' },
        { id: 6, label: '城镇/街道' },
        { id: 7, label: '飞地' },
        { id: 8, label: 'KDZone' },
        { id: 9, label: 'AOI' }
    ];
    // 代表点标识
    $scope.capital = [
        { id: 0, label: '未定义' },
        { id: 1, label: '首都' },
        { id: 2, label: '省会/直辖市' },
        { id: 3, label: '地级市' }
    ];

    /**
     * 初始化数据
     */
    $scope.initializeData = function () {
        $scope.adAdminData = objCtrl.data;// 获取数据
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());// 记录原始数据值
        $scope.nameGroup = [];
        initNameInfo();
        var linkArr = $scope.adAdminData.geometry.coordinates;
        var points = fastmap.mapApi.point(linkArr[0], linkArr[1]);
        selectCtrl.onSelected({// 记录选中点信息
            geometry: points,
            id: $scope.adAdminData.pid
        });

        // 高亮行政区划代表点
        var highLightFeatures = [];
        highLightFeatures.push({
            id: $scope.adAdminData.pid.toString(),
            layerid: 'adAdmin',
            type: 'adadmin',
            style: { src: '../../images/road/img/heightStar.svg' }
        });
        highRenderCtrl.highLightFeatures = highLightFeatures;
        dsEdit.getByPid(parseInt($scope.adAdminData.linkPid), 'RDLINK').then(function(data){
            selectCtrl.selectedFeatures.linkcapturePoint = data.geometry.coordinates[1];
            highRenderCtrl.drawHighlight(data);
        })

        // 回到初始状态（修改数据后样式会改变，新数据时让它回到初始的样式）
        if ($scope.adAdminForm) {
            $scope.adAdminForm.$setPristine();
        }
    };

    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.adAdminData.pid), 'ADADMIN').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('ADADMIN', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };
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
    // adAdminData.names
    $scope.refreshNames = function () {
        $scope.adAdminData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.adAdminData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    };

    function initNameInfo() {
        if ($scope.adAdminData.names.length > 0) {
            $scope.nameGroup = [];
            /* 根据数据中对象某一属性值排序*/
            function compare(propertyName) {
                return function (object1, object2) {
                    var value1 = object1[propertyName];
                    var value2 = object2[propertyName];
                    if (value1 < value2) {
                        return -1;
                    } else if (value1 > value2) {
                        return 1;
                    } else {
                        return 0;
                    }
                };
            }
            $scope.adAdminData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            for (var i = 0; i < $scope.adAdminData.names.length; i++) {
                nameGroupidArr.push($scope.adAdminData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (var i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.adAdminData.names.length; j < le; j++) {
                    if ($scope.adAdminData.names[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.adAdminData.names[j]);
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
    if (objCtrl.data) {
        $scope.initializeData();
    }

    $scope.cancel = function () {

    };


    /**
     * 名称属性页面
     */
    $scope.otherAdminName = function (nameInfo, nameGroupid) {
        var showBlackObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showNamesObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: appPath.road + 'ctrls/attr_administratives_ctrl/adAdminNameCtrl',
                    propertyHtml: appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminNameTpl.html'
                };
                $scope.$emit('transitCtrlAndTpl', showNamesObj);
            }
        };
        objCtrl.namesInfos = $scope.getItemByNameGroupid($scope.nameGroup, nameGroupid);
        $scope.$emit('transitCtrlAndTpl', showBlackObj);
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
    /* 增加item*/
    $scope.addItem = function () {
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.adAdminData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.adAdminData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.adAdminName({
            nameGroupid: maxNameGroupId + 1
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
    };
    /**
     * 层级属性页面
     * @param boolValue
     */
    $scope.clickBasic = function (boolValue) {
        $scope.isbase = boolValue;
        if (!$scope.isbase) {
            var showOrdinaryObj = {
                loadType: 'subAttrTplContainer',
                propertyCtrl: appPath.road + 'ctrls/attr_administratives_ctrl/adAdminOfLevelCtrl',
                propertyHtml: appPath.root + appPath.road + 'tpls/attr_adminstratives_tpl/adAdminOfLevelTpl.html'
            };
            $scope.$emit('transitCtrlAndTpl', showOrdinaryObj);
        }
    };

    // 保存
    $scope.save = function () {
        $scope.refreshNames();
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        dsEdit.update($scope.adAdminData.pid, 'ADADMIN', objectEditCtrl.changedProperty).then(function (data) {
            if (data) {
                if (shapeCtrl.shapeEditorResult.getFinalGeometry() !== null) {
                    if (typeof map.currentTool.cleanHeight === 'function') {
                        map.currentTool.cleanHeight();
                    }
                    if (toolTipsCtrl.getCurrentTooltip()) {
                        toolTipsCtrl.onRemoveTooltip();
                    }
                    editLayer.drawGeometry = null;
                    editLayer.clear();
                    shapeCtrl.stopEditing();
                    editLayer.bringToBack();
                    $(editLayer.options._div).unbind();
                }
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    subAttrContainerTpl: false,
                    attrContainerTpl: true
                });
            }
            $scope.refreshData();
        });
    };

    // 删除
    $scope.delete = function () {
        dsEdit.delete($scope.adAdminData.pid, 'ADADMIN').then(function (data) {
            if (data) {
                adAdmin.redraw();
                $scope.adAdminData = null;
                highRenderCtrl._cleanHighLight(); // 清空高亮
            }
            $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
        });
    };
    // 监听保存 删除 取消 初始化
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
