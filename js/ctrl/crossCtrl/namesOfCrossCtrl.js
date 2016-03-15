/**
 * Created by liwanchong on 2016/2/29.
 */
var namesOfCross = angular.module("mapApp", []);
namesOfCross.controller("namesController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
     $scope.names = objCtrl.data.names;
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
        {"id": "SCR", "label": "克罗地亚语"},
    ];
    /*路口名称输入完查询发音和拼音*/
    $scope.diverName = function (id, name) {
        var param = {
            "word": name
        }
        Application.functions.getNamePronunciation(JSON.stringify(param), function (data) {
            $scope.$apply();
            if (data.errcode == 0) {
                $.each( $scope.names, function (i, v) {
                    if (v.nameGroupid == id) {
                        v.phonetic = data.data.phonetic;
                    }
                });
                $scope.$apply();
            } else {
                swal("查找失败", "问题原因：" + data.errmsg, "error");
            }
        });
    }
    $scope.minusrdCrossName = function (id) {
        $scope.names.splice(id, 1);
        if ($scope.names.length === 0) {
        }
    };
    $scope.addrdCrossName = function () {
        var maxNum = -1;
        if ($scope.names.length === 0) {
            maxNum = 0;
        } else {
            for (var i = 0, len = $scope.names.length; i < len; i++) {
                if ($scope.names[i]["nameGroupid"] > maxNum) {
                    maxNum = $scope.names[i]["nameGroupid"];
                }
            }
        }
        var newName = fastmap.dataApi.rdcrossname({nameGroupid: maxNum + 1});
        $scope.names.unshift(newName);
    }
})