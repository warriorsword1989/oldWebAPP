/**
 * Created by wangmingdong on 2016/8/10.
 */

angular.module('app').controller('TollGateNameCtl', ['$scope', 'dsEdit', 'dsMeta', function ($scope, dsEdit, dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.tollGateNames = objCtrl.namesInfos;
    $scope.selectedLangcodeArr = [];
    var getSelectedLangcode = function () {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.tollGateNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.tollGateNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.tollGateNames[k].langCode);
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
            for (var j = 0; j < $scope.tollGateNames.length; j++) {
                var flag = false;
                if ($scope.langCodeOptions[i].id == $scope.tollGateNames[j].langCode) {
                    break;
                }
                if ($scope.langCodeOptions[i].id != $scope.tollGateNames[j].langCode && j == $scope.tollGateNames.length - 1) {
	                /*if($scope.tollGateNames[j].langCode == 'CHI') {
		                $scope.tollGateNames.push(fastmap.dataApi.rdTollgateName({ nameGroupid: $scope.tollGateNames[0].nameGroupid, langCode: $scope.langCodeOptions[i+1].id }));
	                } else {*/
		                $scope.tollGateNames.push(fastmap.dataApi.rdTollgateName({ nameGroupid: $scope.tollGateNames[0].nameGroupid, langCode: $scope.langCodeOptions[i].id }));
	                // }
                    flag = true;
                    break;
                }
            }
            if (flag) {
                break;
            }
        }
	    $scope.refreshNameLangCode();
//		$scope.tollGateNames.push(fastmap.dataApi.rdTollgateName({nameGroupid:$scope.tollGateNames[0].nameGroupid}));
    };
	// 代码语言字段切换时，判断语言不能重复
    $scope.langCodeChange = function (event, obj) {
        getSelectedLangcode();
	    $scope.refreshNameLangCode();
    };
    //重新排列名称信息
	$scope.refreshNameLangCode = function () {
		$scope.tollGateNames.sort(function( a, b) {
			return $scope.langCodeRelation[a.langCode] - $scope.langCodeRelation[b.langCode];
		});
	};
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
	//语言代码对应关系
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
    $scope.$on('refreshTollgateName', function (data) {
        $scope.tollGateNames = objCtrl.namesInfos;
    });
}]);
