/**
 * Created by mali on 2016/10/21.
 */

angular.module('app').controller('RdBranchNameCtl', ['$scope', 'dsEdit', 'dsMeta', function ($scope, dsEdit, dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.rdBranchNames = objCtrl.namesInfos;
    if (objCtrl.data) {
        $scope.details = objCtrl.data.details.length > 0 ? objCtrl.data.details : objCtrl.data.signboards;
        $scope.nameGroup = [];
    }
    $scope.selectedLangcodeArr = [];
    var getSelectedLangcode = function () {
        $scope.selectedLangcodeArr.length = 0;
        for (var k in $scope.rdBranchNames) {
            if ($scope.selectedLangcodeArr.indexOf($scope.rdBranchNames[k].langCode) < 0) {
                $scope.selectedLangcodeArr.push($scope.rdBranchNames[k].langCode);
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
                nameInfo.voiceFile = data.data.voicefile;
            } else {
                nameInfo.phonetic = '';
                nameInfo.voiceFile = '';
                swal('查找失败', '可能是服务出错或者输入过长，请重新尝试', 'error');
            }
        });
    };
	// 增加名称信息
    $scope.addNameInfo = function () {
        for (var i = 0; i < $scope.langCodeOptions.length; i++) {
            for (var j = 0; j < $scope.rdBranchNames.length; j++) {
                var flag = false;
                if ($scope.langCodeOptions[i].id == $scope.rdBranchNames[j].langCode) {
                    break;
                }
                if ($scope.langCodeOptions[i].id != $scope.rdBranchNames[j].langCode && j == $scope.rdBranchNames.length - 1) {
                    $scope.rdBranchNames.push(fastmap.dataApi.rdBranchName({ nameGroupid: $scope.rdBranchNames[0].nameGroupid, langCode: $scope.langCodeOptions[i].id }));
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
	// 点击名称分类
    $scope.switchNameClass = function (code, id, index) {
//        $.each($scope.details[0].names,function(i,v){
//            if(id == v.nameGroupid){
//                v.nameClass = code;
//            }
//        });
    	$scope.rdBranchNames[index].nameClass = code;
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
	/* 名称分类*/
    $scope.nameClassType = [
        { code: 0, label: '方向' },
        { code: 1, label: '出口' }
    ];
    /* 点击名称分类*/
    $scope.switchNameClasss = function (code, id) {
        $.each($scope.details[0].names, function (i, v) {
            if (id == v.nameGroupid) {
                v.nameClass = code;
            }
        });
    };
    $scope.codeTypeOptions = [
        { id: 0, label: '0 无' },
        { id: 1, label: '1 普通道路名' },
        { id: 2, label: '2 设施名' },
        { id: 3, label: '3 高速道路名' },
        { id: 4, label: '4 国家高速编号' },
        { id: 5, label: '5 国道编号' },
        { id: 6, label: '6 省道编号' },
        { id: 7, label: '7 县道编号' },
        { id: 8, label: '8 乡道编号' },
        { id: 9, label: '9 专用道编号' },
        { id: 10, label: '10 省级高速编号' }
    ];
    // 名称来源
    $scope.langSourceOptions = [
        { id: 0, label: '未定义' },
        { id: 1, label: '翻译' },
        { id: 2, label: '道路名英文名' },
        { id: 3, label: '行政区划英文名' },
        { id: 4, label: 'Hamlet英文名' },
        { id: 5, label: 'POI英文名' }
    ];
}]);
