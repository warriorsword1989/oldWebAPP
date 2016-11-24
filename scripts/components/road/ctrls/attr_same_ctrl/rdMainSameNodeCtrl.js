/**
 * Created by wuzhen on 2016/8/10.
 */
var sameRelationshapApp = angular.module('app', []);
sameRelationshapApp.controller('SameRelationshapController', ['$scope', '$ocLazyLoad', 'appPath', 'dsEdit', '$timeout', function ($scope, $ocLazyLoad, appPath, dsEdit, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var highRenderCtrl = fastmap.uikit.HighRenderController();
    var layerCtrl = fastmap.uikit.LayerController();
    var rdSameLayer = layerCtrl.getLayerById('rdSame');
    var rdNodeLayer = layerCtrl.getLayerById('rdNode');
    // var rwNodeLayer = layerCtrl.getLayerById('rwNode');
    var adNodeLayer = layerCtrl.getLayerById('adNode');
    var zoneNodeLayer = layerCtrl.getLayerById('zoneNode');
    var luNodeLayer = layerCtrl.getLayerById('luNode');

    var rdLinkLayer = layerCtrl.getLayerById('rdLink');
    var adLinkLayer = layerCtrl.getLayerById('adLink');
    var zoneLinkLayer = layerCtrl.getLayerById('zoneLink');
    var luLinkLayer = layerCtrl.getLayerById('luLink');

    $scope.sameRelationshap = objCtrl.data;
    $scope.same = {};
    $scope.same.sameRelationShapShow = false; // 用于控制同一关系制作面板是否显示
    $scope.same.isRdSameNode = true;

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
        $scope.same.sameNodeList = $scope.sameRelationshap;
    };
    /**
     * 切换主要素
     * @param index
     */
    $scope.changeSameMain = function (index) {
        // 全部设置为非主要素
        for (var i = 0, len = $scope.same.sameNodeList.length; i < len; i++) {
            $scope.same.sameNodeList[i].isMain = 0;
        }

        $scope.same.sameNodeList[index].isMain = 1; // 主要素
        $scope.same.sameNodeList[index].checked = true;
        $scope.same.sameDisabledIndex = index;
    };

    $scope.changeSame = function () {
        highRenderCtrl.highLightFeatures.length = 0;
        highRenderCtrl._cleanHighLight();

        var highLightFeatures = [];
        var data = $scope.same.sameNodeList;
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].checked) {
                if (data[i].featType === 'RDNODE') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'rdLink',
                        type: 'node',
                        style: {
                            color: 'black',
                            radius: 4
                        }
                    });
                } else if (data[i].featType === 'ADNODE') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'adLink',
                        type: 'node',
                        style: {
                            color: 'red',
                            radius: 4
                        }
                    });
                } else if (data[i].featType === 'ZONENODE') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'zoneLink',
                        type: 'node',
                        style: {
                            color: 'Blue',
                            radius: 4
                        }
                    });
                } else if (data[i].featType === 'LUNODE') {
                    highLightFeatures.push({
                        id: data[i].id.toString(),
                        layerid: 'luLink',
                        type: 'node',
                        style: {
                            color: 'Green',
                            radius: 4
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
        var data = $scope.same.sameNodeList;
        var types = {},
            rdNode = 0,
            adNode = 0,
            zoneNode = 0,
            luNode = 0;
        var resultArr = [];
        for (var i = 0, len = data.length; i < len; i++) {
            if (data[i].checked) {
                var obj = {};
                obj.nodePid = data[i].id;
                obj.type = data[i].featType;
                obj.isMain = data[i].isMain;
                resultArr.push(obj);

                types[data[i].featType] = '';// 用户记录node的类型
                if (data[i].featType === 'RDNODE') {
                    rdNode++;
                } else if (data[i].featType === 'ADNODE') {
                    adNode++;
                } else if (data[i].featType === 'ZONENODE') {
                    zoneNode++;
                } else if (data[i].featType === 'LUNODE') {
                    luNode++;
                }
            }
        }

        if (!($scope.same.sameDisabledIndex >= 0)) {
            swal('提示', '必须选择主要素！', 'warning');
            return;
        }
        if (Object.keys(types).length < 2) {
            if (!(resultArr[0].type === 'LUNODE')) { // 有一种特殊情况排除在外，就只当值选择了luNode，并且符合后面代码的规则时，也是可以做同一点的
                swal('提示', '同一点关系中,至少需要两种要素！', 'warning');
                return;
            }
        }
        if (rdNode > 5) {
            swal('提示', '同一点关系中,rdNode不能超过5个！', 'warning');
            return;
        }
        if (adNode > 1) {
            swal('提示', '同一点关系中,adNode不能超过1个！', 'warning');
            return;
        }
        if (zoneNode > 10) {
            swal('提示', '同一点关系中,zoneNode不能超过10个！', 'warning');
            return;
        }
        if (luNode > 2) {
            swal('提示', '同一点关系中,luNode不能超过2个！', 'warning');
            return;
        }

        // 清除高亮
        highRenderCtrl.highLightFeatures.length = 0;
        highRenderCtrl._cleanHighLight();


        dsEdit.create('RDSAMENODE', { nodes: resultArr }).then(function (callData) {
            if (callData) {
                $scope.clearSame();
                rdSameLayer.redraw();
                rdNodeLayer.redraw();
                adNodeLayer.redraw();
                zoneNodeLayer.redraw();
                luNodeLayer.redraw();

                rdLinkLayer.redraw();
                adLinkLayer.redraw();
                zoneLinkLayer.redraw();
                luLinkLayer.redraw();

                dsEdit.getByPid(callData.pid, 'RDSAMENODE').then(function (res) {
                    objCtrl.setCurrentObject('RDSAMENODE', res);
                    var changedDirectObj = {
                        loadType: 'attrTplContainer',
                        propertyCtrl: appPath.road + 'ctrls/attr_same_ctrl/rdSameNodeCtrl',
                        propertyHtml: appPath.root + appPath.road + 'tpls/attr_same_tpl/rdSameNodeTpl.html'
                    };
                    $scope.$emit('transitCtrlAndTpl', changedDirectObj);
                });
            }
        });
    };

    $scope.initializeData();
}]);
