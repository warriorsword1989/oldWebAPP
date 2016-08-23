/**
* Created by linglong   on 2016/8/23.
 */
angular.module('app').controller('commonDeep', function($scope,$ocLazyLoad) {
    $scope.maxTimeItemsLength = 3;
    $scope.timeItems = [];
    $scope.currentHandleTimeData = '';
    $scope.currentHandleStatus = '';//编辑和查看两种；

    //加载时间编辑面板;
    $ocLazyLoad.load('scripts/components/poi/ctrls/attr-deep/commonDeepTimeCtrl').then(function() {
        $scope.carPopoverURL = '../../../scripts/components/poi/tpls/attr-deep/commonDeepTimeTpl.html';
    });

    //增加营业时间方法;
    $scope.addBusinessHour = function(){
        if($scope.timeItems.length>=3){
            swal("警告", "营业时间不能超过"+$scope.maxTimeItemsLength+"条", "warning");
            return;
        }
        $scope.timeItems.push(Math.random());
    }

    //移除营业时间方法;
    $scope.removeBusinessHour = function(currentData,timeDataIndex){
        //删除一个营业时间，对应的时间面板也应该隐藏;
        if($scope.timeItems[timeDataIndex]==$scope.currentHandleTimeData){
            $('body .carTypeTip:last').hide();
        }
        $scope.timeItems.splice($scope.timeItems.indexOf(currentData),1);
        //更新当前编辑对象的索引；
        $scope.currentHandleTimeDataIndex = $scope.timeItems.indexOf($scope.currentHandleTimeData);
    }

    $scope.popup2 = {
        opened: false
    };
    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };



    //显示编辑时间对话框;
    $scope.showPopover=function(e,timeDataIndex){
        //当前编辑对象数据;
        $scope.currentHandleTimeData = $scope.timeItems[timeDataIndex];
        //更新当前编辑对象的索引；
        $scope.currentHandleTimeDataIndex = $scope.timeItems.indexOf($scope.currentHandleTimeData);
        //当前的操作状态;
        $scope.currentHandleStatus = '编辑';
        //在这里赋值当前的编辑数据更新数据编辑面板的数据显示；
        var dateTimeWell = $('.date-well').parent();
        $('body').append($(".date-well").find(".carTypeTip"));
        if($('body .carTypeTip:last').css('display') == 'none'){
            $(".carTypeTip").css({'top':($(e.target).offset().top-120)+'px','right':(dateTimeWell.attr('data-type')==1)?'300px':'600px'});
            $('body .carTypeTip:last').show();
        }
    };

});