/**
 * Created by liwanchong on 2016/2/29.
 */
var namesOfCross = angular.module("app");
namesOfCross.controller("namesController",['$scope','dsMeta',function($scope,dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.rdCrossNames = objCtrl.namesInfos;
    
    $scope.selectedLangcodeArr = []; 
	var getSelectedLangcode = function() {
		$scope.selectedLangcodeArr.length = 0;
		for(var k in $scope.rdCrossNames) {
			if($scope.selectedLangcodeArr.indexOf($scope.rdCrossNames[k].langCode) < 0) {
				$scope.selectedLangcodeArr.push($scope.rdCrossNames[k].langCode);
			}
		}
	};
	getSelectedLangcode();
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
        {"id": "RUM", "label": "罗马尼亚语"},
        {"id": "RUS", "label": "俄语"},
        {"id": "SLO", "label": "斯洛伐克语"},
        {"id": "SPA", "label": "西班牙语"},
        {"id": "SWE", "label": "瑞典语"},
        {"id": "THA", "label": "泰国语"},
        {"id": "TUR", "label": "土耳其语"},
        {"id": "UKR", "label": "乌克兰语"},
        {"id": "SCR", "label": "克罗地亚语"}
    ];

    $scope.names = objCtrl.data.names;
    $scope.realtimeData = objCtrl.data;
    // 增加名称信息
    $scope.addNameInfo = function(){
    	for(var i=0;i<$scope.langCodeOptions.length;i++){
			for(var j=0;j<$scope.rdCrossNames.length;j++){
				var flag = false;
				if($scope.langCodeOptions[i].id == $scope.rdCrossNames[j].langCode){
					break;
				}
				if($scope.langCodeOptions[i].id != $scope.rdCrossNames[j].langCode  && j==$scope.rdCrossNames.length-1){
					$scope.rdCrossNames.push(fastmap.dataApi.rdCrossName({"nameGroupid":$scope.rdCrossNames[0].nameGroupid,"langCode":$scope.langCodeOptions[i].id,"pid": objCtrl.data.pid,"rowId":""}));
//					$scope.rdCrossNames.unshift(fastmap.dataApi.rdCrossName({"nameGroupid":$scope.rdCrossNames[0].nameGroupid,"pid": objCtrl.data.pid,"name":"路口名","rowId":""}));
					flag = true;
					break;
				}
			}
			if(flag){
				break;
			}
		}
//        $scope.rdCrossNames.unshift(fastmap.dataApi.rdCrossName({"nameGroupid":$scope.rdCrossNames[0].nameGroupid,"pid": objCtrl.data.pid,"name":"路口名","rowId":""}));
    };

    for(var i= 0,len=$scope.names.length;i<len;i++) {
        if($scope.names[i]["rowId"]===$scope.realtimeData["oridiRowId"]) {
            $scope.oridiData = $scope.names[i];
        }
    }

    /*名称语音*/
    $scope.namePronunciation = function (nameCn,nameInfo) {
        var param = {
            "word":nameCn
        };
        dsMeta.getNamePronunciation(param).then(function (data) {
            if(data.errcode == 0){
                nameInfo.phonetic = data.data.phonetic;
            }else{
                swal("查找失败", "问题原因："+data.errmsg, "error");
            }
        });
    };
    //限制名称内容个数
    $scope.maxNameContent = function(index){
        if($scope.rdCrossNames[index].name.length > 120){
            $scope.rdCrossNames[index].name = $scope.rdCrossNames[index].name.substr(0,120);
        }
    };
    $scope.changeLanguage = function (index){
    	getSelectedLangcode();
        if( $scope.rdCrossNames[index].langCode == 'ENG'){
            $scope.rdCrossNames[index].srcFlag = 1;
        } else {
            $scope.rdCrossNames[index].srcFlag = 0;
        }
    };

}]);
