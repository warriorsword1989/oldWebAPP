/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var braName = angular.module("mapApp", ['oc.lazyLoad']);
braName.controller("BraNameCtrl", function ($scope,$timeout,$ocLazyLoad) {
    var objCtrl = fastmap.uikit.ObjectEditController();
     $scope.details = objCtrl.data.details?objCtrl.data.details:0;
    /*名称分类*/
    $scope.nameClassType = [
        {"code":0,"label":"方向"},
        {"code":1,"label":"出口"}
    ];
    $scope.codeTypeOptions=[
        {"id":0,"label":"0 无"},
        {"id":1,"label":"1 普通路名"},
        {"id":2,"label":"2 设施名"},
        {"id":3,"label":"3 高速道路名"},
        {"id":4,"label":"4 国家高速编号"},
        {"id":5,"label":"5 国道编号"},
        {"id":6,"label":"6 省道编号"},
        {"id":7,"label":"7 县道编号"},
        {"id":8,"label":"8 乡道编号"},
        {"id": 9, "label": "9 专用道编号"},
        {"id": 10, "label": "10 省级高速编号"}
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
    /*分歧名称输入完查询发音和拼音*/
    $scope.diverName = function(id,name){
        $scope.$parent.$parent.showLoading = true;  //showLoading
        var param = {
            "word":name
        }
        Application.functions.getNamePronunciation(JSON.stringify(param), function (data) {
            $scope.$parent.$parent.showLoading = false;  //showLoading
            $scope.$apply();
            if(data.errcode == 0){
                $.each($scope.details[0].names,function(i,v){
                    if(v.nameGroupid == id){
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
    /*点击名称分类*/
    $scope.switchNameClass = function(code,id){
        $.each($scope.details[0].names,function(i,v){
            if(id == v.nameGroupid){
                v.nameClass = code;
            }
        });
    }
    /*上移或者下移*/
    $scope.changeOrder = function(item,type){
        if(type == 1){  //下移
            $.each($scope.details[0].names,function(i,v){
                if(v.nameGroupid == item.nameGroupid-1){
                    v.nameGroupid += 1;
                }
            });
            item.nameGroupid -= 1;
        }else{  //上移
            $.each($scope.details[0].names,function(i,v){
                if(v.nameGroupid == item.nameGroupid+1){
                    v.nameGroupid -= 1;
                }
            });
            item.nameGroupid += 1;
        }
    }
    /*删除名称信息*/
    $scope.removeNameInfo = function(item){
        Array.prototype.deleteElementByValue = function(varElement)
        {
            var numDeleteIndex = -1;
            for (var i=0; i<this.length; i++)
            {
                // 严格比较，即类型与数值必须同时相等。
                if (this[i] === varElement)
                {
                    this.splice(i, 1);
                    numDeleteIndex = i;
                    break;
                }
            }
            return numDeleteIndex;
        }
        /*数组中删除*/
        $.each($scope.details[0].names,function(i,v){
            if(item == v){
                $scope.details[0].names.deleteElementByValue(item);
            }
        });
        $.each($scope.details[0].names,function(i,v){
            if(v){
                /*删除一个，之后的nameGroup都减一*/
                if(v.nameGroupid > item.nameGroupid){
                    v.nameGroupid -= 1;
                }
                /*如果只剩一条名称信息*/
                if($scope.details[0].names.length == 1){
                    $scope.details[0].names[0].nameGroupid = 1;
                }
            } 
        });
    }
    /*新增名称信息*/
    $scope.nameInfoAdd = function(){
        var protoArr = $scope.details[0].names;
        var newArr = {};
        newArr.codeType = 0;
        newArr.detailId = 0;
        newArr.langCode = $scope.languageCode[0].code;
        newArr.name = '';
        newArr.nameClass = 0;
        newArr.nameGroupid = protoArr.length + 1;
        newArr.phonetic = '';
        newArr.pid = 0;
        newArr.voiceFile = '';
        newArr.srcFlag = 0;
        newArr.seqNum = 0;
        protoArr.push(newArr);
    }
    console.log('BraNameCtrl')
});