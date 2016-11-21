/**
 * Created by wangmingdong on 2016/11/21.
 */

angular.module('app').controller('TmcLineCtl', ['$scope', 'dsEdit', 'dsMeta', '$timeout', function ($scope, dsEdit, dsMeta, $timeout) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.tmcLineData = objCtrl.tmcInfos;
    /* 类型代码值域 */
    $scope.typeCodeOptions = [
        { id: 'L1.0', label: 'L1.0 道路' },
        { id: 'L1.1', label: 'L1.1 高速' },
        { id: 'L1.2', label: 'L1.2 一级公路' },
        { id: 'L1.3', label: 'L1.3 二级公路' },
        { id: 'L1.4', label: 'L1.4 三级公路' },
        { id: 'L2.0', label: 'L2.0 环路' },
        { id: 'L2.1', label: 'L2.1 高速环路' },
        { id: 'L2.2', label: 'L2.2 其他环路' },
        { id: 'L3.0', label: 'L3.0 一级路段' },
        { id: 'L4.0', label: 'L4.0 二级路段' },
        { id: 'L5.0', label: 'L5.0 地方街道' },
        { id: 'L6.0', label: 'L6.0 渡运连接线' },
        { id: 'L6.1', label: 'L6.1 轮渡' },
        { id: 'L6.2', label: 'L6.2 铁路运输' },
        { id: 'L7.0', label: 'L7.0 匝道/出入口' }
    ];
}]);
