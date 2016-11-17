/**
 * Created by liuyang on 2016/8/24.
 */
var namesOfLinkApp = angular.module('app');
namesOfLinkApp.controller('crfObjectNameCtrl', ['$scope', '$timeout', 'dsMeta', 'dsEdit', function ($scope, $timeout, dsMeta, dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.crfObjectNames = objCtrl.namesInfos;
    $scope.selectedLangcodeArr = [];
    var getSelectedLangcode = function () {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.crfObjectNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.crfObjectNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.crfObjectNames[k].langCode);
            }
        }
    };
    getSelectedLangcode();
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
        $scope.crfObjectNames.unshift(newName);
    };
    // 增加名称信息
    $scope.addNameInfo = function () {
        getSelectedLangcode();
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            if ($scope.selectedLangcodeArr.indexOf($scope.langCodeOptions[i].id) === -1) {
                if (($scope.selectedLangcodeArr.indexOf('CHI') > -1 || $scope.selectedLangcodeArr.indexOf('CHT') > -1) && ($scope.langCodeOptions[i].id === 'CHI' || $scope.langCodeOptions[i].id === 'CHT')) {
                } else {
                    $scope.crfObjectNames.push(fastmap.dataApi.rdObjectNames({
                        nameGroupid: $scope.crfObjectNames[0].nameGroupid,
                        langCode: $scope.langCodeOptions[i].id
                    }));
                    break;
                }
            }
        }
        $scope.refreshNameLangCode();
    };
    // 代码语言字段切换时，判断语言不能重复
    $scope.langCodeChange = function (langCode) {
        // 如果当前所选既不是简体也不是繁体，则控制不允许选择简繁体
        getSelectedLangcode();
        if (langCode != 'CHI' && langCode != 'CHT') {
            if ($scope.selectedLangcodeArr.indexOf('CHI') === -1) {
                $scope.selectedLangcodeArr.push('CHI');
            }
            if ($scope.selectedLangcodeArr.indexOf('CHT') === -1) {
                $scope.selectedLangcodeArr.push('CHT');
            }
        } else if (langCode == 'CHI') { // 如果是简体中文或繁体中文其他语言不可用
            $scope.selectedLangcodeArr = [];
            for (var i = 0; i < $scope.langCodeOptions.length; i++) {
                if ($scope.langCodeOptions[i].id != 'CHT') {
                    $scope.selectedLangcodeArr.push($scope.langCodeOptions[i].id);
                }
            }
        } else if (langCode == 'CHT') {
            $scope.selectedLangcodeArr = [];
            for (var i = 0; i < $scope.langCodeOptions.length; i++) {
                if ($scope.langCodeOptions[i].id != 'CHI') {
                    $scope.selectedLangcodeArr.push($scope.langCodeOptions[i].id);
                }
            }
        }
        $scope.refreshNameLangCode();
        $timeout(function () {
            $scope.$apply();
        });
    };
    // 重新排列名称信息
    $scope.refreshNameLangCode = function () {
        $scope.crfObjectNames.sort(function (a, b) {
            return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
        });
    };
    $scope.minusRoadName = function (id) {
        $scope.crfObjectNames.splice(id, 1);
    };
    $scope.changePinyin = function (num, name) {
        var param = {
            word: name
        };
        dsMeta.getNamePronunciation(param).then(function (data) {
            if (data != -1) {
                $scope.crfObjectNames[num].phonetic = data.data.phonetic;
                $scope.crfObjectNames[num].name = name;
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

    $scope.searchGroupidByNames = function (index) {
        $('#name').css('display', 'block');
        $scope.inNmae = $scope.names[index];
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

    $scope.selectNamesId = function (num,name) {
        $('.pic-show').hide();
        $scope.changePinyin(num,name);
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
}]);
