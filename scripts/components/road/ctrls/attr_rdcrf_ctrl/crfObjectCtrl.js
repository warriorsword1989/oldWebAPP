/**
 * Created by liuyang on 2016/8/9.
 */

var rdcrfObjectApp = angular.module('app');
rdcrfObjectApp.controller('crfObjectCtrl', ['$scope', 'dsEdit', function ($scope, dsEdit) {
    var layerCtrl = fastmap.uikit.LayerController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();
    var relationData = layerCtrl.getLayerById('crfData');
    var selectCtrl = fastmap.uikit.SelectController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var featCodeCtrl = fastmap.uikit.FeatCodeController();
    var shapeCtrl = fastmap.uikit.ShapeEditorController();
    var editLayer = layerCtrl.getLayerById('edit');
    $scope.initializeData = function () {
        $scope.crfObjData = objCtrl.data;
        $scope.objData = { links: [], inters: [], roads: [] };// 要创建的对象.
        $scope.crfPids = [];
        $scope.nameGroup = [];
        $scope.selectCRFData = [];
        initNameInfo();
        objCtrl.setOriginalData(objCtrl.data.getIntegrate());
        selectCtrl.onSelected({
            id: $scope.crfObjData.pid
        });
        for (var i = 0; i < $scope.crfObjData.links.length; i++) {
            $scope.objData.links.push($scope.crfObjData.links[i].linkPid);
            highRenderCtrl.highLightFeatures.push({
                id: $scope.crfObjData.links[i].linkPid.toString(),
                layerid: 'rdLink',
                type: 'line',
                style: {}
            });
        }
        highRenderCtrl.drawHighlight();
        for (var i = 0; i < $scope.crfObjData.roads.length; i++) {
            $scope.crfPids.push($scope.crfObjData.roads[i].roadPid);
            $scope.objData.roads.push($scope.crfObjData.roads[i].roadPid);
            dsEdit.getByPid(parseInt($scope.crfObjData.roads[i].roadPid), 'RDROAD').then(function (roadData) {
                var tempData = {
                    pid: roadData.pid,
                    highLightId: []
                };
                var linkArr = roadData.links;
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    tempData.highLightId.push(linkArr[i].linkPid);
                    highRenderCtrl.highLightFeatures.push({
                        id: linkArr[i].linkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                }
                highRenderCtrl.drawHighlight();
                $scope.selectCRFData.push(tempData);
            });
        }
        for (var i = 0; i < $scope.crfObjData.inters.length; i++) {
            $scope.crfPids.push($scope.crfObjData.inters[i].interPid);
            $scope.objData.inters.push($scope.crfObjData.inters[i].interPid);
            dsEdit.getByPid($scope.crfObjData.inters[i].interPid, 'RDINTER').then(function (interData) {
                var tempData = {
                    pid: interData.pid,
                    highLightId: []
                };
                var linkArr = interData.links,
                    points = interData.nodes;
                for (var i = 0, len = linkArr.length; i < len; i++) {
                    tempData.highLightId.push(linkArr[i].linkPid);
                    highRenderCtrl.highLightFeatures.push({
                        id: linkArr[i].linkPid.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {}
                    });
                }
                for (var i = 0, len = points.length; i < len; i++) {
                    tempData.highLightId.push(points[i].nodePid);
                    highRenderCtrl.highLightFeatures.push({
                        id: points[i].nodePid.toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {}
                    });
                }
                highRenderCtrl.drawHighlight();
                $scope.selectCRFData.push(tempData);
            });
        }
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

    // 刷新names
    $scope.refreshNames = function () {
        $scope.crfObjData.names = [];
        for (var i = 0, len = $scope.nameGroup.length; i < len; i++) {
            for (var j = 0, le = $scope.nameGroup[i].length; j < le; j++) {
                $scope.crfObjData.names.unshift($scope.nameGroup[i][j]);
            }
        }
    };
    function initNameInfo() {
        if ($scope.crfObjData.names.length > 0) {
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
            $scope.crfObjData.names.sort(compare('nameGroupid'));
            // 获取所有的nameGroupid
            var nameGroupidArr = [];
            for (var i = 0; i < $scope.crfObjData.names.length; i++) {
                nameGroupidArr.push($scope.crfObjData.names[i].nameGroupid);
            }
            // 去重
            nameGroupidArr = Utils.distinctArr(nameGroupidArr);
            for (var i = 0, len = nameGroupidArr.length; i < len; i++) {
                var tempArr = [];
                for (var j = 0, le = $scope.crfObjData.names.length; j < le; j++) {
                    if ($scope.crfObjData.names[j].nameGroupid == nameGroupidArr[i]) {
                        tempArr.push($scope.crfObjData.names[j]);
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
        setTimeout(function () {
            featCodeCtrl.setFeatCode({
                selectCRFData: $scope.selectCRFData,
                objData: $scope.objData,
                crfPids: $scope.crfPids
            });
        }, 200);
    }
    $scope.showNames = function (nameInfo, nameGroupid) {
        var showBlackObj = { // 这样写的目的是为了解决子ctrl只在第一次加载时执行的问题,解决的办法是每次点击都加载一个空的ctrl，然后在加载namesOfDetailCtrl。
            loadType: 'subAttrTplContainer',
            propertyCtrl: 'scripts/components/road/ctrls/blank_ctrl/blankCtrl',
            propertyHtml: '../../../scripts/components/road/tpls/blank_tpl/blankTpl.html',
            callback: function () {
                var showNamesObj = {
                    loadType: 'subAttrTplContainer',
                    propertyCtrl: 'scripts/components/road/ctrls/attr_rdcrf_ctrl/crfObjectNameCtrl',
                    propertyHtml: '../../../scripts/components/road/tpls/attr_rdcrf_tpl/crfObjectNameTpl.html'
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

    $scope.addRdName = function () {
        /* var newName = fastmap.dataApi.rdObjectNames({ pid: $scope.crfObjData.pid, langCode: 'CHI', nameId: 0 });
        $scope.crfObjData.names.unshift(newName);*/
        $scope.refreshNames();
        var maxNameGroupId = 0;
        if ($scope.crfObjData.names.length > 0) {
            maxNameGroupId = Utils.getArrMax($scope.crfObjData.names, 'nameGroupid');
        }
        objCtrl.data.names.unshift(fastmap.dataApi.rdObjectNames({
            nameGroupid: maxNameGroupId + 1,
            pid: $scope.crfObjData.pid
        }));
        initNameInfo();
    };

    $scope.refreshData = function () {
        dsEdit.getByPid(parseInt($scope.crfObjData.pid), 'RDOBJECT').then(function (data) {
            if (data) {
                objCtrl.setCurrentObject('RDOBJECT', data);
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
            }
        });
    };

    $scope.minusName = function (index, item) {
        // $scope.crfObjData.names.splice(id, 1);
        if (item.langCode === 'CHI' || item.langCode === 'CHT') {
            $scope.nameGroup.splice(index, 1);
        } else {
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
        }
        $scope.refreshNames();
        $scope.$emit('SWITCHCONTAINERSTATE', { subAttrContainerTpl: false });
    };

    $scope.changeColor = function (ind, ord) {
        $('#nameSpan' + ind).css('color', '#FFF');
    };
    $scope.backColor = function (ind, ord) {
        $('#nameSpan' + ind).css('color', 'darkgray');
    };
    $scope.save = function () {
        $scope.refreshNames();
        objCtrl.save();
        if (!objCtrl.changedProperty) {
            swal('操作成功', '属性值没有变化！', 'success');
            return;
        }
        var param = {
            command: 'UPDATE',
            type: 'RDOBJECT',
            dbId: App.Temp.dbId,
            data: objCtrl.changedProperty
        };
        dsEdit.save(param).then(function (data) {
            if (data) {
                objCtrl.setOriginalData(objCtrl.data.getIntegrate());
                relationData.redraw();
                $scope.$emit('SWITCHCONTAINERSTATE', {
                    subAttrContainerTpl: false,
                    attrContainerTpl: true
                });
            }
            $scope.refreshData();
        });
    };

    $scope.delete = function () {
        var objId = parseInt($scope.crfObjData.pid);
        var param = {
            command: 'DELETE',
            type: 'RDOBJECT',
            dbId: App.Temp.dbId,
            objId: objId
        };
        dsEdit.save(param).then(function (data) {
            var info = null;
            if (data) {
                $scope.crfObjData = null;
                relationData.redraw();
                if (map.floatMenu) {
                    map.removeLayer(map.floatMenu);
                    map.floatMenu = null;
                }
                highRenderCtrl._cleanHighLight();
                highRenderCtrl.highLightFeatures = [];
                editLayer.clear();
                $scope.$emit('SWITCHCONTAINERSTATE', { attrContainerTpl: false, subAttrContainerTpl: false });
            }
        });
    };
    $scope.cancel = function () {
    };
    eventController.on(eventController.eventTypes.SAVEPROPERTY, $scope.save);
    eventController.on(eventController.eventTypes.DELETEPROPERTY, $scope.delete);
    eventController.on(eventController.eventTypes.CANCELEVENT, $scope.cancel);
    eventController.on(eventController.eventTypes.SELECTEDFEATURECHANGE, $scope.initializeData);
}]);
