/**
 * Created by linglong on 2015/7/27.
 */
angular.module("app").controller("nameInfoCtrls", function ($scope,$timeout,dsMeta) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventController = fastmap.uikit.EventController();

    $scope.initFn = function(){
        $scope.nameGroup = [];
        $scope.names = objCtrl.data.names;
        $scope.nameGroup = [];
        /*根据nameGroupId排序*/
        if($scope.names.length){
            $scope.names.sort(function(a,b){
                return b.nameGroupId >= a.nameGroupId;
            });
            sortNameGroup($scope.names);
        }
    }



    /*重组源数据用新建变量nameGroup显示*/
    function sortNameGroup(arr){
        $scope.nameGroup = [];
        for (var i = 0; i <= arr.length - 1; i++) {
            var tempArr = [];
            if (arr[i+1] && arr[i].nameGroupid == arr[i + 1].nameGroupid) {
                if($.inArray(arr[i],$scope.nameGroup) == -1){
                    tempArr.push(arr[i])
                }
                for(var j=i+1;j<arr.length-1;j++){
                    if(arr[j].nameGroupid == arr[i].nameGroupid){
                        tempArr.push(arr[j]);
                        i = j;
                    }
                }
            }else{
                tempArr.push(arr[i]);
            }
            $scope.nameGroup.push(tempArr);
        };
    };

    /*上移或者下移*/
    $scope.changeOrder = function(item,type){
        if(type == 1){
            $.each($scope.names,function(i,v){
                if(v.nameGroupid == item[0].nameGroupid-1){
                    v.nameGroupid += 1;
                }  
            });
            for(var i=0;i<item.length;i++){
                item[i].nameGroupid -= 1;
            }
        }else{
            $.each($scope.names,function(i,v){
                if(v.nameGroupid == item[0].nameGroupid+1){
                    v.nameGroupid -= 1;
                }  
            });
            for(var i=0;i<item.length;i++){
                item[i].nameGroupid+= 1;
            }
        }
         $scope.names.sort(function(a,b){
            return b.nameGroupid >= a.nameGroupid;
         });
        sortNameGroup($scope.names);
    };

    /*删除名称信息*/
    $scope.removeNameInfo = function(item){
        var nameLength = 0;
        /*数组中删除*/
        $.each($scope.nameGroup,function(i,v){
            if(v && v[0].nameGroupid == item.nameGroupid){
                $scope.nameGroup.splice(i,1);
            }
        });
        /*由于names的长度是变化的，所以在循环前赋值给一个变量*/
        var tempLength = $scope.names.length;
        for(var i = 0;i<tempLength;i++){
            if($scope.names[i] && $scope.names[i].nameGroupid == item.nameGroupid){
                $scope.names.splice(i,1);
                i -= 1;
            }
        }
        $.each($scope.nameGroup,function(i,v){
            $.each(v,function(m,n){
                if(n){
                    /*删除一个，之后的nameGroup都减一*/
                    if(n.nameGroupid > item.nameGroupid){
                        n.nameGroupid -= 1;
                    }
                    /*如果只剩一条名称信息*/
                    /*if($scope.nameGroup.length == 1){
                        $scope.nameGroup[0].nameGroupid = 1;
                    }*/
                    nameLength++;
                } 
            });
        });
    };
    /*删除名称组下的名称信息*/
    $scope.removeNameItem = function(item){
        var tempLength = $scope.names.length;
        var groupNum = 0;
        /*统计该组下有多少个名称信息*/
        for(var i=0;i<tempLength;i++){
            if($scope.names[i] && $scope.names[i].nameGroupid == item.nameGroupid){
                groupNum++;
            }
        }
        for(var i = 0;i<tempLength;i++){
            if($scope.names[i] && $scope.names[i].pid == item.pid){
                $scope.names.splice(i,1);
                if(groupNum == 1){
                    for(var j=0;j<tempLength-1;j++){
                        if($scope.names[j].nameGroupid > item.nameGroupid){
                            $scope.names[j].nameGroupid -= 1;
                        }
                    }
                }
            }
        }
        sortNameGroup($scope.names);
    };
    /*新增名称信息*/
    $scope.nameInfoAdd = function(){
        var protoArr = $scope.names;
        var newName = fastmap.dataApi.lcFaceName({
            "pid":0,
            "langCode":$scope.languageCode[0].code,
            "nameGroupid":protoArr.length>0?protoArr[0].nameGroupid + 1:1,
            "seqNum":this.nameGroupid
        });
        protoArr.unshift(newName);
        sortNameGroup(protoArr);
    };
    /*名称来源*/
    $scope.nameSource = [
        {"code":0,"label":"未定义"},
        {"code":1,"label":"翻译"}
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

    $scope.initFn();
    eventController.off('SHOWNAMEGROUP');
    eventController.on('SHOWNAMEGROUP',$scope.initFn)
});