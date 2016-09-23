var oridinaryInfoApp = angular.module("app",['ui.bootstrap']);
oridinaryInfoApp.controller("commonDeepTimeController",function($scope) {
    /**
     * 设置时间选择的一条数据的对象模型;
     *(1)开始月日@time;
     *(2)结束月日@time；
     *(3)周营业日@Array；
     *(4)日营业时间@Array;
     */
    $scope.TimeSelectModel = {
        startOpenMonthDay: null,
        endOpenMonthDay: null,
        weekOpenDays: [
            {code: '1', value: '日', status: false},
            {code: '2', value: '一', status: false},
            {code: '3', value: '二', status: false},
            {code: '4', value: '三', status: false},
            {code: '5', value: '四', status: false},
            {code: '6', value: '五', status: false},
            {code: '7', value: '六', status: false}
        ],
        dayOpenTimeZones: []
    }

    /*当前的时分秒输入文本框对象*/
    $scope.currentDayTimeTarget =  null;

    /*增加一条新的时间*/
    $scope.addDayTime = function(){
        if($scope.TimeSelectModel.dayOpenTimeZones.length>3){swal("警告", "营业时间不能超过4条", "warning");return;}
        $scope.TimeSelectModel.dayOpenTimeZones.push({});
    }
    /*删除一条新的时间*/
    $scope.removeDayTimeZone = function(index){
        $scope.TimeSelectModel.dayOpenTimeZones.splice(index,1);
    }
    /*取消当前时分秒操作(即隐藏面板)*/
    $scope.closeTimeHandle = function(){
        $('body .timeBox:last').hide();
    }
    /*设置时间面板的显示隐藏*/
    $scope.showTimePicker = function(e,index,flag){
        $scope.currentDayTimeTarget = $(e.target);
        $scope.currentDataIndex = index;
        $scope.currentDataFlag = flag;
        $('body').append($(".timeBox"));
        $(".timeBox").css({'top':($(e.target).offset().top+32)+'px','left':($(e.target).offset().left-30)+'px'});
        var d = new Date();
        d.setHours( 8 );
        d.setMinutes( 0 );
        $scope.TimeSelectModel.dayOpenTimeZones[index][flag] = d;
        $('body .timeBox:last').show();
    }
    //取消当前时间面板编辑或新增(并隐藏当前时间控件);
    $scope.hidePopover = function (t){
        //隐藏时间编辑面板
        $('body .carTypeTip:last').hide();
        //如果时分秒选择框打开的话也隐藏;
        if($('body .timeBox:last').css('display') != 'none'){
            $scope.closeTimeHandle();
        }
    };







    $scope.hstep = 1;
    $scope.mstep = 15;
    $scope.changed = function () {
        $log.log('Time changed to: ');
    };

    //
    $scope.dateOptions = {
        //dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        formatMonth:'MM'+'月',
        formatDayTitle:'yyyy MM'+'月'
    };

    // Disable weekend selection
    function disabled(data) {
        var date = data.date,
            mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    }

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[1];

    $scope.popup1 = {opened: false};

    $scope.popup2 = {opened: false};




    ////
    $scope.maxTimeItemsLength = 3;
    $scope.timeItems = [];
    $scope.currentHandleTimeData = '';
    $scope.currentHandleStatus = '';//编辑和查看两种；
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

    //显示编辑时间对话框;
    $scope.showPopover=function(e,timeDataIndex){
        //当前编辑对象数据;
        $scope.currentHandleTimeData = $scope.timeItems[timeDataIndex];
        //更新当前编辑对象的索引；
        $scope.currentHandleTimeDataIndex = $scope.timeItems.indexOf($scope.currentHandleTimeData);
        //当前的操作状态;
        $scope.currentHandleStatus = '编辑';
        //在这里赋值当前的编辑数据更新数据编辑面板的数据显示；
        var dateTimeWell = $('.timeSelect-panel').parent();
        $('body').append($(".timeSelect-panel").find(".carTypeTip"));
        $(".carTypeTip").css({'top':($(e.target).offset().top-113)+'px','right':'300px'});
        if($('body .carTypeTip:last').css('display') == 'none'){
            $('body .carTypeTip:last').show();
        }
    };


    //$scope.initializeData = function (){
    //    $scope.commonDeepTimeData = [];
    //    $scope.showCommonDeepTime($scope.commonDeepTimeData);
    //};
    //
    //$scope.initializeData();

});