/**
 * Created by liuzhaoxia on 2015/12/11.
 */
var selectApp = angular.module("mapApp", ['oc.lazyLoad']);
selectApp.controller("rdCrossController",function ($scope) {
    var selectCtrl = new fastmap.uikit.SelectController();
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.langCodeOptions=[
        {"id":"CHI","label":"简体中文"},
        {"id":"CHT","label":"繁体中文"},
        {"id":"ENG","label":"英文"},
        {"id":"POR","label":"葡萄牙文"},
        {"id":"ARA","label":"阿拉伯语"},
        {"id":"BUL","label":"保加利亚语"},
        {"id":"CZE","label":"捷克语"},
        {"id":"DAN","label":"丹麦语"},
        {"id":"DUT","label":"荷兰语"},
        {"id":"FIN","label":"芬兰语"},
        {"id":"FRE","label":"法语"},
        {"id":"GER","label":"德语"},
        {"id":"HIN","label":"印地语"},
        {"id":"HUN","label":"匈牙利语"},
        {"id":"ICE","label":"冰岛语"},
        {"id":"IND","label":"印度尼西亚语"},
        {"id":"ITA","label":"意大利语"},
        {"id":"JPN","label":"日语"},
        {"id":"KOR","label":"韩语"},
        {"id":"LIT","label":"立陶宛语"},
        {"id":"NOR","label":"挪威语"},
        {"id":"POL","label":"波兰语"},
        {"id":"RUM","label":"罗马尼西亚语"},
        {"id":"RUS","label":"俄语"},
        {"id":"SLO","label":"斯洛伐克语"},
        {"id":"SPA","label":"西班牙语"},
        {"id":"SWE","label":"瑞典语"},
        {"id":"THA","label":"泰国语"},
        {"id":"TUR","label":"土耳其语"},
        {"id":"UKR","label":"乌克兰语"},
        {"id":"SCR","label":"克罗地亚语"},
    ];


    $scope.rdCrossData=objCtrl.data;
    $("#signalbtn"+$scope.rdCrossData.signal).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#typebtn"+$scope.rdCrossData.type).removeClass("btn btn-default").addClass("btn btn-primary");
    $("#electRoeyebtn"+$scope.rdCrossData.electroeye).removeClass("btn btn-default").addClass("btn btn-primary");
    setTimeout(function () {
        for(var i in $scope.rdCrossData.names){
            $("#srcFlag"+$scope.rdCrossData.names[i].srcFlag+"_"+i).removeClass("btn btn-default").addClass("btn btn-primary");
        }
    },10)


    $scope.checksignal=function(flag){
        $("#signaldiv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#signalbtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdCrossData.signal=flag;
    }

    $scope.checktype=function(flag){
        $("#typediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#typebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdCrossData.type=flag;
    }

    $scope.checkelectRoeye=function(flag){
        $("#electRoeyediv :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#electRoeyebtn"+flag).removeClass("btn btn-default").addClass("btn btn-primary");
        $scope.rdCrossData.electRoeye=flag;
    }

    $scope.checksrcFlag=function(flag,item,index){
        $("#srcFlagdiv"+index+" :button").removeClass("btn btn-primary").addClass("btn btn-default");
        $("#srcFlag"+flag+"_"+index).removeClass("btn btn-default").addClass("btn btn-primary");
        item.srcFlag=flag;
    }

    $scope.addrdCrossName=function(){
        if(!$("#namesDiv").hasClass("in")) {
            $("#namesDiv").addClass("in");
        }
        $scope.rdCrossData.names.unshift({
            nameId:0,
            nameGroupid:0,
            langCode:"",
            name: "",
            phonetic: "",
            srcFlag: 0
        })
    }

    $scope.minusrdCrossName=function(id) {
        $scope.rdCrossData.names.splice(id, 1);
        if($scope.rdCrossData.names.length===0) {
            if($("#namesDiv").hasClass("in")) {
                $("#namesDiv").removeClass("in");
            }
        }
    };

});