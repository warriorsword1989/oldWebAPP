/**
 * Created by mali on 2016/10/21.
 */

angular.module('app').controller('LuFaceNameCtl', ['$scope', 'dsEdit', 'dsMeta', function ($scope, dsEdit, dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.luFaceNames = objCtrl.namesInfos;
    $scope.selectedLangcodeArr = [];
    var getSelectedLangcode = function () {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.luFaceNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.luFaceNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.luFaceNames[k].langCode);
            }
        }
    };
    getSelectedLangcode();
	/* 名称语音*/
    $scope.namePronunciation = function (nameCn, nameInfo) {
        var param = {
            word: nameCn
        };
        dsMeta.getNamePronunciation(param).then(function (data) {
            if (data.errcode == 0) {
                nameInfo.phonetic = data.data.phonetic;
            } else {
                nameInfo.phonetic = '';
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
        });
    };
	// 增加名称信息
    $scope.addNameInfo = function () {
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            for (var j = 0; j < $scope.luFaceNames.length; j++) {
                var flag = false;
                if ($scope.langCodeOptions[i].id == $scope.luFaceNames[j].langCode) {
                    break;
                }
                if ($scope.langCodeOptions[i].id != $scope.luFaceNames[j].langCode && j == $scope.luFaceNames.length - 1) {
                    $scope.luFaceNames.push(fastmap.dataApi.luFaceName({ nameGroupid: $scope.luFaceNames[0].nameGroupid, langCode: $scope.langCodeOptions[i].id }));
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
//		$scope.tollGateNames.push(fastmap.dataApi.rdTollgateName({nameGroupid:$scope.tollGateNames[0].nameGroupid}));
    };
	// 代码语言字段切换时，判断语言不能重复
    $scope.langCodeChange = function (event, obj) {
        getSelectedLangcode();
    };
	/* 名称来源*/
    $scope.nameSource = [
        { code: 0, label: '未定义' },
        { code: 1, label: '翻译' }
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
