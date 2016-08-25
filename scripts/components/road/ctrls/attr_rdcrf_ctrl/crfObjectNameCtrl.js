/**
 * Created by liuyang on 2016/8/24.
 */
var namesOfLinkApp = angular.module("app");
namesOfLinkApp.controller("crfObjectNameCtrl",['$scope','$timeout','dsMeta','dsEdit',function($scope,$timeout,dsMeta,dsEdit) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.routeAttOptions = [
        {"id": 'CHI', "label": "简体中文"},
        {"id": 'CHT', "label": "繁体中文"},
        {"id": 'ENG', "label": "英文"},
        {"id": 'POR', "label": "葡萄牙文"}
    ];

    $scope.objNames = [];
    var index = $scope.subAttributeData;
    $scope.subAttributeData = "";
    $scope.names = objCtrl.data.names;
    $scope.oridiData = $scope.names[index];

    $scope.addRoadName=function(){
        var newName=fastmap.dataApi.rdObjectNames({"pid":objCtrl.data.pid});
        $scope.names.unshift(newName)
    };
    $scope.minusRoadName=function(id) {
        $scope.names.splice(id, 1);
        if($scope.names.length===0) {
        }
    };
    $scope.changePinyin = function(name){
        var param = {
            "word":name
        };
        dsMeta.getNamePronunciation(param).then(function(data){
            if(data!=-1){
                $scope.oridiData.phoneTic = data.data.phonetic;
            }
        })
    };

    $scope.getObjName = function(){
        var param = {};
        param["dbId"] = App.Temp.dbId;
        param["type"] = "RDOBJECTNAME";
        param["data"] = {"pid": objCtrl.data.pid};
        dsEdit.getByCondition(param).then(function(nameData) {
            if (nameData.errcode === -1) {return;}
            $scope.objNames = nameData.data;
            $('.pic-show').show();
        });
    };

    $scope.searchGroupidByNames=function(){
        $("#name").css("display", "block");
        $scope.inNmae=$scope.oridiData.name;
        $timeout(function(){
            $scope.getObjName();
            if($.trim( $scope.inNmae) == ''){
                $('.pic-show').hide();
            }else{
                $('.pic-show').show();
            }
            //$scope.$apply();
        },100);
    };

    $scope.selectNamesId=function(num){
        $scope.oridiData.nameGroupid=num + 1;
        $scope.oridiData.name=$scope.objNames[num];
        $('.pic-show').hide();
        $scope.changePinyin($scope.oridiData.name);
    };

    /*点击关闭隐藏选择图片界面*/
    $scope.hidePicSelect = function(e){
        $(e.target).parents('.pic-show').hide();
        $("#" + $scope.namesOfFlag).css("display","none");
    };
    $scope.changeColor=function(ind){
        $("#minusNameSpan"+ind).css("color","#FFF");
    };
    $scope.backColor=function(ind){
        $("#minusNameSpan"+ind).css("color","darkgray");
    }
}]);