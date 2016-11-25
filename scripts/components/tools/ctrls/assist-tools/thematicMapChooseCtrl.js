/**
 * Created by zhaohang on 2016/11/14.
 */
angular.module('app').controller('ThematicMap', ['$scope',
    function ($scope) {
        $scope.ThematicMapArray = [{
            type: 'rdLinkLimitTruck',
            name: '卡车限制信息',
            minZoom: 10
        }, {
            type: 'rdLinkLimit',
            name: 'link限制信息数量（普通限制信息）',
            minZoom: 10
        }, {
            type: 'rdlinkSpeedlimitSpeedClass',
            name: '普通线限速限速等级',
            minZoom: 10
        }, {
            type: 'rdlinkSpeedlimitSpeedClassWork',
            name: '普通线限速限速等级赋值标识',
            minZoom: 10
        }, {
            type: 'rdlinkSpeedlimitSpeedLimitSrc',
            name: '普通线限速限速来源',
            minZoom: 10
        }, {
            type: 'rdLinkLaneClass',
            name: 'link车道等级',
            minZoom: 10
        }, {
            type: 'rdLinkFunctionClass',
            name: 'link功能等级',
            minZoom: 10
        }, {
            type: 'rdLinkLaneNum',
            name: '车道数（总数）',
            minZoom: 10
        }, {
            type: 'rdLinkDevelopState',
            name: '开发状态',
            minZoom: 10
        }, {
            type: 'rdLinkMultiDigitized',
            name: '上下线分离',
            minZoom: 10
        }, {
            type: 'rdLinkPaveStatus',
            name: '铺设状态',
            minZoom: 10
        }, {
            type: 'rdLinkTollInfo',
            name: '收费信息',
            minZoom: 13
        }, {
            type: 'rdLinkSpecialTraffic',
            name: '特殊交通',
            minZoom: 10
        }, {
            type: 'rdLinkIsViaduct',
            name: '高架',
            minZoom: 10
        }, {
            type: 'rdLinkAppInfo',
            name: '供用信息',
            minZoom: 10
        }, {
            type: 'rdLinkForm50',
            name: '交叉口内道路',
            minZoom: 10
        },
        //    {
        //    type: 'rdLinkNameContent',
        //    name: '道路名内容'
        //},
            {
            type: 'rdLinkNameGroupid',
            name: '道路名组数',
            minZoom: 10
        }, {
            type: 'rdLinkNameType',
            name: '名称类型',
            minZoom: 13
        }, {
            type: 'rdlinkSpeedlimitConditionCount',
            name: '条件线限速个数',
            minZoom: 10
        }, {
            type: 'rdLinkLimitType3',
            name: '禁止穿行',
            minZoom: 10
        }];
        $scope.selectThematicMap = function (data, $event) {
            var layerCtrl = fastmap.uikit.LayerController();
            var layer = layerCtrl.getLayerById('thematicLink');
            if (data.type === 'close') {
                layerCtrl.setLayerVisibleOrNot('rdLink', true);
                layerCtrl.setLayerVisibleOrNot('thematicLink', false);
            } else {
                layerCtrl.setLayerVisibleOrNot('rdLink', false);
                layerCtrl.setLayerVisibleOrNot('thematicLink', true);
                layer.options.minZoom = data.minZoom;
                layer.url.parameter.type = (data.type);
                layer.redraw();
            }
        };
    }
]);
