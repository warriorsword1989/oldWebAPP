/**
 * Created by zhaohang on 2016/4/6.
 */

var otherApp = angular.module("mapApp");
otherApp.controller("adAdminNameController", function ($scope, $timeout, $ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var objectEditCtrl = fastmap.uikit.ObjectEditController();
    $scope.indexName=0;
    //获取数据
    $scope.names = objCtrl.data.names?objCtrl.data.names:0;
    $scope.nameGroup = [];
    /*根据nameGroupId排序*/
    $scope.names.sort(function(a,b){
        return b.nameGroupId >= a.nameGroupId;
    });
    /*重组源数据用新建变量nameGroup显示*/
    $scope.sortNameGroup = function(arr){
        $scope.nameGroup = [];
        for (var i = 0; i <= arr.length - 1; i++) {
            var tempArr = [];
            if (arr[i+1] && arr[i].nameGroupId == arr[i + 1].nameGroupId) {
                if($.inArray(arr[i],$scope.nameGroup) == -1){
                    tempArr.push(arr[i])
                }
                for(var j=i+1;j<arr.length-1;j++){
                    if(arr[j].nameGroupId == arr[i].nameGroupId){
                        tempArr.push(arr[j]);
                        i = j;
                    }
                }
            }else{
                tempArr.push(arr[i])
            }
            $scope.nameGroup.push(tempArr);
        };
    };
    $scope.sortNameGroup($scope.names);
    $scope.nameGroup = $scope.nameGroup.sort(function(a,b){
        return b.nameGroupId >= a.nameGroupId;
    });
    /*上移或者下移*/
    $scope.changeOrder = function(item,type){
        if(type == 1){
            $.each($scope.names,function(i,v){
                if(v.nameGroupId == item[0].nameGroupId-1){
                    v.nameGroupId += 1;
                }
            });
            for(var i=0;i<item.length;i++){
                item[i].nameGroupId -= 1;
            }
        }else{
            $.each($scope.names,function(i,v){
                if(v.nameGroupId == item[0].nameGroupId+1){
                    v.nameGroupId -= 1;
                }
            });
            for(var i=0;i<item.length;i++){
                item[i].nameGroupId+= 1;
            }
        }
        $scope.names.sort(function(a,b){
            return b.nameGroupId >= a.nameGroupId;
        });
        $scope.sortNameGroup($scope.names);
    }
    /*删除名称信息*/
    $scope.removeNameInfo = function(item){
        var nameLength = 0;
        /*数组中删除*/
        $.each($scope.nameGroup,function(i,v){
            if(v && v[0].nameGroupId == item.nameGroupId){
                $scope.nameGroup.splice(i,1);
            }
        });
        /*由于names的长度是变化的，所以在循环前赋值给一个变量*/
        var tempLength = $scope.names.length;
        for(var i = 0;i<tempLength;i++){
            if($scope.names[i] && $scope.names[i].nameGroupId == item.nameGroupId){
                $scope.names.splice(i,1);
                i -= 1;
            }
        }
        $.each($scope.nameGroup,function(i,v){
            $.each(v,function(m,n){
                if(n){
                    /*删除一个，之后的nameGroup都减一*/
                    if(n.nameGroupId > item.nameGroupId){
                        n.nameGroupId -= 1;
                    }
                    /*如果只剩一条名称信息*/
                    /*if($scope.nameGroup.length == 1){
                     $scope.nameGroup[0].nameGroupId = 1;
                     }*/
                    nameLength++;
                }
            })
        });
    }
    /*删除名称组下的名称信息*/
    $scope.removeNameItem = function(item){
        var tempLength = $scope.names.length;
        var groupNum = 0;
        /*统计该组下有多少个名称信息*/
        for(var i=0;i<tempLength;i++){
            if($scope.names[i] && $scope.names[i].nameGroupId == item.nameGroupId){
                groupNum++;
            }
        }
        for(var i = 0;i<tempLength;i++){
            if($scope.names[i] && $scope.names[i].pid == item.pid){
                $scope.names.splice(i,1);
                if(groupNum == 1){
                    for(var j=0;j<tempLength-1;j++){
                        if($scope.names[j].nameGroupId > item.nameGroupId){
                            $scope.names[j].nameGroupId -= 1;
                        }
                    }
                }
            }
        }
        $scope.sortNameGroup($scope.names);
    }
    /*新增名称信息*/
    $scope.nameInfoAdd = function(){
        //var protoArr = $scope.names;
        var newName = fastmap.dataApi.adAdminName({
            "regionId":objCtrl.data.regionId,
            "langCode":$scope.languageCode[0].code,
            "nameGroupId":$scope.names.length>0?$scope.names[0].nameGroupId + 1:1,
            "rowId":""
        });
        $scope.names.unshift(newName);
        $scope.sortNameGroup($scope.names);
    }

    /*分歧名称输入完查询发音和拼音*/
    $scope.diverName = function(id,name){
        var param = {
            "word":name
        };
        Application.functions.getNamePronunciation(JSON.stringify(param), function (data) {
            $scope.$apply();
            if(data.errcode == 0){
                $.each($scope.names,function(i,v){
                    if(v.nameGroupId == id){
                        v.phonetic = data.data.phonetic;
                        v.voiceFile = data.data.voicefile;
                    }
                });
                $scope.$apply();
            }else{
                swal("查找失败", "问题原因："+data.errmsg, "error");
            }
        });
    }
    /*名称分类*/
    $scope.nameClassType = [
        {"code":1,"label":"标准化"},
        {"code":2,"label":"原始"},
        {"code":3,"label":"简称"},
        {"code":4,"label":"别名"}
    ];
    /*名称来源*/
    $scope.nameSource = [
        {"code":0,"label":"未定义"},
        {"code":1,"label":"翻译"},
        {"code":2,"label":"官网"}
    ];
    /*语言代码*/
    $scope.languageCode = [
        {"code":"CHI","name":"简体中文"},
        {"code":"CHT","name":"繁体中文"},
        {"code":"ENG","name":"英文"},
        {"code":"POR","name":"葡萄牙文"},
        {"code":"ARA","name":"阿拉伯语"},
        {"code":"BUL","name":"保加利亚语"},
        {"code":"CZE","name":"捷克语"},
        {"code":"DAN","name":"丹麦语"},
        {"code":"DUT","name":"荷兰语"},
        {"code":"EST","name":"爱沙尼亚语"},
        {"code":"FIN","name":"芬兰语"},
        {"code":"FRE","name":"法语"},
        {"code":"GER","name":"德语"},
        {"code":"HIN","name":"印地语"},
        {"code":"HUN","name":"匈牙利语"},
        {"code":"ICE","name":"冰岛语"},
        {"code":"IND","name":"印度尼西亚语"},
        {"code":"ITA","name":"意大利语"},
        {"code":"JPN","name":"日语"},
        {"code":"KOR","name":"韩语"},
        {"code":"LIT","name":"立陶宛语"},
        {"code":"NOR","name":"挪威语"},
        {"code":"POL","name":"波兰语"},
        {"code":"RUM","name":"罗马尼亚语"},
        {"code":"RUS","name":"俄语"},
        {"code":"SLO","name":"斯洛伐克语"},
        {"code":"SPA","name":"西班牙语"},
        {"code":"SWE","name":"瑞典语"},
        {"code":"THA","name":"泰国语"},
        {"code":"TUR","name":"土耳其语"},
        {"code":"UKR","name":"乌克兰语"},
        {"code":"SCR","name":"克罗地亚语"}
    ];
    $scope.adAdminNameData = objectEditCtrl.data;
    $scope.initData = function(){

    }
    if(objectEditCtrl.data) {

    }
    objectEditCtrl.updateObject=function() {

    }
});