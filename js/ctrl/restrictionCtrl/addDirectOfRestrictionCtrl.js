/**
 * Created by liwanchong on 2016/2/29.
 */
var addDirectOfRest = angular.module("myApp", []);
addDirectOfRest.controller("addDirectOfRestController",function($scope,$timeout){
    var objCtrl = fastmap.uikit.ObjectEditController();
    $scope.addDirectData = objCtrl.data;
    //初始化交限
    $scope.addLimitedData = [
        {"id": 1,"flag":false},
        {"id": 2,"flag":false},
        {"id": 3,"flag":false},
        {"id": 4,"flag":false},
        {"id": 5,"flag":false},
        {"id": 6,"flag":false},
        {"id": 7,"flag":false},
        {"id": 11,"flag":true},
        {"id": 22,"flag":true},
        {"id": 33,"flag":true},
        {"id": 44,"flag":true},
        {"id": 55,"flag":true},
        {"id": 66,"flag":true},
        {"id": 77,"flag":true}

    ];
    $scope.removeImgActive = function(){
        $.each($('.trafficPic'),function(i,v){
            $(v).find('img').removeClass('active');
        });
    }
    //选择弹出框中的交限
    $scope.selectTip = function (item,e) {
        /*选中高亮*/
        $scope.removeImgActive();
        $(e.target).addClass('active');
        $scope.tipsId = item.id;
        var obj = {};
        obj.restricInfo = item.id;
        obj.outLinkPid = 0; //$scope.rdLink.outPid;
        obj.pid = 0;//featCodeCtrl.newObj.pid;
        obj.relationshipType = 1;
        obj.flag = 1;
        obj.restricPid = 0// featCodeCtrl.newObj.pid;
        obj.type = 1;
        obj.conditons = [];
        $scope.newLimited = obj;

    };
    var picArr = [];
    //添加交限
    $scope.addTips = function () {
        if ($scope.modifyItem !== undefined) {
            var arr = $scope.addDirectData.details
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i].pid === $scope.modifyItem.pid) {
                    $scope.addDirectData.details[i].restricInfo = $scope.tipsId;
                    $scope.modifyItem = undefined;
                    break;
                }
            }
        } else {
            if ($scope.tipsId === null || $scope.tipsId === undefined) {
                alert("请先选择tips");
                return;
            }
            $.each($scope.addDirectData.details,function(i,v){
                picArr.push(v.restricInfo);
            });
            if($.inArray($scope.newLimited.restricInfo, picArr) == -1 && $scope.newLimited!=''){
                $scope.addDirectData.details.unshift($scope.newLimited);
                //limitPicArr.unshift('');
            }
            $scope.removeImgActive();
            $scope.newLimited = '';
            $timeout(function(){
                $(".show-tips:first").trigger('click');
            })
        }
    }
})