/**
 * Created by wuzhen on 2016/8/10.
 */
var mainSameLinkApp = angular.module('app', []);
mainSameLinkApp.controller('MainSameLinkController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', '$timeout', function ($scope, $ocLazyLoad, appPath, dsEdit, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdSameLayer = layerCtrl.getLayerById('rdSame');
    var rdLinkLayer = layerCtrl.getLayerById('rdLink');
    // var rwLinkLayer = layerCtrl.getLayerById('rwLink');
    var adLinkLayer = layerCtrl.getLayerById('adLink');
    var zoneLinkLayer = layerCtrl.getLayerById('zoneLink');
    var luLinkLayer = layerCtrl.getLayerById('luLink');

    $scope.sameRelationshap = objCtrl.data;
    $scope.same = {};
    $scope.same.sameRelationShapShow = false; // 用于控制同一关系制作面板是否显示

    $scope.$on('showSameRelationshap', function (data) {
        $scope.initializeData();
    });
    /**
     * 取消
     */
    $scope.clearSame = function () {
        $scope.same = {};
        $scope.same.sameRelationShapShow = false;

        highRenderCtrl.highLightFeatures.length = 0;
        highRenderCtrl._cleanHighLight();
    };
    /**
     * 初始化方法
     */
    $scope.initializeData = function () {
        $scope.sameRelationshap = objCtrl.data;
        $scope.same.sameRelationShapShow = true;
        $scope.same.sameDisabledIndex = -1;
        $scope.same.sameLinkList = $scope.sameRelationshap;
    };

    $scope.changeSame = function () {
        highRenderCtrl.highLightFeatures.length = 0;
        highRenderCtrl._cleanHighLight();

        var highLightFeatures = [];
        var data = $scope.same.sameLinkList;
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].checked) {
                if (data[i].featType === 'RDLINK') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'rdLink',
                        type: 'line',
                        style: {
                            color: 'black',
                            strokeWidth: 5
                        }
                    });
                } else if (data[i].featType === 'ADLINK') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'adLink',
                        type: 'line',
                        style: {
                            color: 'red',
                            strokeWidth: 5
                        }
                    });
                } else if (data[i].featType === 'ZONELINK') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'zoneLink',
                        type: 'line',
                        style: {
                            color: 'Blue',
                            strokeWidth: 5
                        }
                    });
                } else if (data[i].featType === 'LULINK') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'luLink',
                        type: 'line',
                        style: {
                            color: 'Green',
                            strokeWidth: 5
                        }
                    });
                }
            }
        }

        highRenderCtrl.highLightFeatures = highLightFeatures;
        highRenderCtrl.drawHighlight();
    };

    /**
     * 保存
     */
    $scope.saveSame = function () {
        var data = $scope.same.sameLinkList,
            types = {},
            rdLink = 0,
            adLink = 0,
            zoneLink = 0,
            luLink = 0,
            resultArr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].checked) {
                var obj = {};
                obj.linkPid = data[i].id;
                obj.type = data[i].featType;
                resultArr.push(obj);
                obj.isMain = 0;// 非主要素
                types[data[i].featType] = '';// 用户记录node的类型
                if (data[i].featType === 'RDLINK') {
                    rdLink++;
                } else if (data[i].featType === 'ADLINK') {
                    adLink++;
                } else if (data[i].featType === 'ZONELINK') {
                    zoneLink++;
                } else if (data[i].featType === 'LULINK') {
                    luLink++;
                }
            }
        }

        if (Object.keys(types).length < 2) {
            swal('提示', '同一线关系中,至少需要两种要素！', 'warning');
            return;
        }
        if (rdLink > 1) {
            swal('提示', '同一线关系中,rdLink不能超过3个！', 'warning');
            return;
        }
        if (adLink > 1) {
            swal('提示', '同一线关系中,adLink不能超过1个！', 'warning');
            return;
        }
        if (zoneLink > 1) {
            swal('提示', '同一线关系中,zoneLink不能超过10个！', 'warning');
            return;
        }
        if (luLink > 2) {
            swal('提示', '同一线关系中,luLink不能超过2个！', 'warning');
            return;
        }

        resultArr[0].isMain = 1;// 默认第一个为主要素


        // 清除高亮
        highRenderCtrl.highLightFeatures.length = 0;
        highRenderCtrl._cleanHighLight();


        dsEdit.create('RDSAMELINK', { links: resultArr }).then(function (callData) {
            if (callData) {
                $scope.clearSame();
                rdSameLayer.redraw();
                rdLinkLayer.redraw();
                adLinkLayer.redraw();
                zoneLinkLayer.redraw();
                luLinkLayer.redraw();
                dsEdit.getByPid(callData.pid, 'RDSAMELINK').then(function (data) {
                    objCtrl.setCurrentObject('RDSAMELINK', data);
                    var changedDirectObj = {
                        loadType: 'attrTplContainer',
                        propertyCtrl: appPath.road + 'ctrls/attr_same_ctrl/rdSameLinkCtrl',
                        propertyHtml: appPath.root + appPath.road + 'tpls/attr_same_tpl/rdSameLinkTpl.html'
                    };
                    $scope.$emit('transitCtrlAndTpl', changedDirectObj);
                });
            }
        });
    };

    $scope.initializeData();
}]);
