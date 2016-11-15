/**
 * Created by liuyang on 2016/8/24.
 */
var namesOfLinkApp = angular.module('app');
namesOfLinkApp.controller('crfObjectNameCtrl', ['$scope', '$timeout', 'dsMeta', 'dsEdit', function ($scope, $timeout, dsMeta, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.routeAttOptions = [
        { id: 'CHI', label: '简体中文' },
        { id: 'CHT', label: '繁体中文' },
        { id: 'ENG', label: '英文' },
        { id: 'POR', label: '葡萄牙文' },
        { id: 'ARA', label: '阿拉伯语' },
        { id: 'BUL', label: '保加利亚语' },
        { id: 'CZE', label: '捷克语' },
        { id: 'DAN', label: '丹麦语' },
        { id: 'DUT', label: '荷兰语' },
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

    $scope.objNames = [];
    var index = $scope.subAttributeData;
    $scope.subAttributeData = '';
    $scope.names = objCtrl.data.names;
    $scope.oridiData = $scope.names[index];

    $scope.addRoadName = function () {
        var newName = fastmap.dataApi.rdObjectNames({ pid: objCtrl.data.pid });
        $scope.names.unshift(newName);
    };
    $scope.minusRoadName = function (id) {
        $scope.names.splice(id, 1);
        if ($scope.names.length === 0) {
        }
    };
    $scope.changePinyin = function (name) {
        var param = {
            word: name
        };
        dsMeta.getNamePronunciation(param).then(function (data) {
            if (data != -1) {
                $scope.oridiData.phoneTic = data.data.phonetic;
            }
        });
    };

    $scope.getObjName = function () {
        var param = {};
        param.dbId = App.Temp.dbId;
        param.type = 'RDOBJECTNAME';
        param.data = { pid: objCtrl.data.pid };
        dsEdit.getByCondition(param).then(function (nameData) {
            if (nameData.errcode === -1) { return; }
            $scope.objNames = nameData.data;
            $('.pic-show').show();
        });
    };

    $scope.searchGroupidByNames = function () {
        $('#name').css('display', 'block');
        $scope.inNmae = $scope.oridiData.name;
        $timeout(function () {
            $scope.getObjName();
            if ($.trim($scope.inNmae) == '') {
                $('.pic-show').hide();
            } else {
                $('.pic-show').show();
            }
            // $scope.$apply();
        }, 100);
    };

    $scope.selectNamesId = function (num) {
        $scope.oridiData.nameGroupid = num + 1;
        $scope.oridiData.name = $scope.objNames[num];
        $('.pic-show').hide();
        $scope.changePinyin($scope.oridiData.name);
    };

    /* 点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function (e) {
        $(e.target).parents('.pic-show').hide();
        $('#' + $scope.namesOfFlag).css('display', 'none');
    };
    $scope.changeColor = function (ind) {
        $('#minusNameSpan' + ind).css('color', '#FFF');
    };
    $scope.backColor = function (ind) {
        $('#minusNameSpan' + ind).css('color', 'darkgray');
    };
}]);
