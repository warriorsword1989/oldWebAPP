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
    /* 名称标识 */
    $scope.nameFlagOptions = [
        { id: 0, label: '0 道路名称' },
        { id: 1, label: '1 第一名称（或起点名称）' },
        { id: 2, label: '2 第二名称（或终点名称）' }
    ];
    $scope.langCodeOptions = [
        { id: 'CHI', label: '简体中文' },
        { id: 'CHT', label: '繁体中文' },
        { id: 'ENG', label: '英文' },
        { id: 'POR', label: '葡萄牙文' },
        { id: 'ARA', label: '阿拉伯语' },
        { id: 'BUL', label: '保加利亚语' },
        { id: 'CZE', label: '捷克语' },
        { id: 'DAN', label: '丹麦语' },
        { id: 'DUT', label: '荷兰语' },
        { id: 'EST', label: '爱沙尼亚语' },
        { id: 'FIN', label: '芬兰语' },
        { id: 'FRE', label: '法语' },
        { id: 'GER', label: '德语' },
        { id: 'HIN', label: '印地语' },
        { id: 'HUN', label: '匈牙利语' },
        { id: 'ICE', label: '冰岛语' },
        { id: 'IND', label: '印度尼西亚语' },
        { id: 'ITA', label: '意大利语' },
        { id: 'JPN', label: '日语' },
        { id: 'KOR', label: '韩语' },
        { id: 'LIT', label: '立陶宛语' },
        { id: 'NOR', label: '挪威语' },
        { id: 'POL', label: '波兰语' },
        { id: 'RUM', label: '罗马尼亚语' },
        { id: 'RUS', label: '俄语' },
        { id: 'SLO', label: '斯洛伐克语' },
        { id: 'SPA', label: '西班牙语' },
        { id: 'SWE', label: '瑞典语' },
        { id: 'THA', label: '泰国语' },
        { id: 'TUR', label: '土耳其语' },
        { id: 'UKR', label: '乌克兰语' },
        { id: 'SCR', label: '克罗地亚语' }
    ];
}]);
