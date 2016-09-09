/**
 * Created by wangmingdong on 2016/8/10.
 */

angular.module("app").controller("TollGateNameCtl", ['$scope', 'dsEdit' ,'dsMeta', function ($scope, dsEdit,dsMeta) {
	var objCtrl = fastmap.uikit.ObjectEditController();
	$scope.tollGateName = objCtrl.namesInfo;
	$scope.tollGateNames = objCtrl.namesInfos;

	/*名称语音*/
	$scope.namePronunciation = function (nameCn) {
		var param = {
			"word":nameCn
		};
		dsMeta.getNamePronunciation(param).then(function (data) {
			if(data.errcode == 0){
				$scope.tollGateName.phonetic = data.data.phonetic;
			}else{
				swal("查找失败", "问题原因："+data.errmsg, "error");
			}
		});
	};
	// 增加名称信息
	$scope.addNameInfo = function(){
		$scope.tollGateNames.push(fastmap.dataApi.rdTollgateName({nameGroupid:$scope.tollGateNames[0].nameGroupid}));
	};
	$scope.langCodeOptions = [
		{"id": "CHI", "label": "简体中文"},
		{"id": "CHT", "label": "繁体中文"},
		{"id": "ENG", "label": "英文"},
		{"id": "POR", "label": "葡萄牙文"},
		{"id": "ARA", "label": "阿拉伯语"},
		{"id": "BUL", "label": "保加利亚语"},
		{"id": "CZE", "label": "捷克语"},
		{"id": "DAN", "label": "丹麦语"},
		{"id": "DUT", "label": "荷兰语"},
		{"id": "FIN", "label": "芬兰语"},
		{"id": "FRE", "label": "法语"},
		{"id": "GER", "label": "德语"},
		{"id": "HIN", "label": "印地语"},
		{"id": "HUN", "label": "匈牙利语"},
		{"id": "ICE", "label": "冰岛语"},
		{"id": "IND", "label": "印度尼西亚语"},
		{"id": "ITA", "label": "意大利语"},
		{"id": "JPN", "label": "日语"},
		{"id": "KOR", "label": "韩语"},
		{"id": "LIT", "label": "立陶宛语"},
		{"id": "NOR", "label": "挪威语"},
		{"id": "POL", "label": "波兰语"},
		{"id": "RUM", "label": "罗马尼西亚语"},
		{"id": "RUS", "label": "俄语"},
		{"id": "SLO", "label": "斯洛伐克语"},
		{"id": "SPA", "label": "西班牙语"},
		{"id": "SWE", "label": "瑞典语"},
		{"id": "THA", "label": "泰国语"},
		{"id": "TUR", "label": "土耳其语"},
		{"id": "UKR", "label": "乌克兰语"},
		{"id": "SCR", "label": "克罗地亚语"}
	];
	$scope.$on('refreshTollgateName',function(data){
		$scope.tollGateName = objCtrl.namesInfo;
		$scope.tollGateNames = objCtrl.namesInfos;
	});
}]);
