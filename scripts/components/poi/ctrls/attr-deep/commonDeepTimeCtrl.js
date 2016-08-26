var oridinaryInfoApp = angular.module("app",['ui.bootstrap']);
oridinaryInfoApp.controller("commonDeepTimeController",function($scope) {
    /**
     * 设置时间选择的对象模型;
     *(1)开始月日@time;
     *(2)结束月日@time；
     *(3)周营业日@Array；
     *(4)日营业时间@Array;
     */
    $scope.TimeSelectModel = {
        startOpenMonthDay: null,
        endOpenMonthDay: null,
        weekOpenDays: [
            {code: '1', value: '日', status: true },
            {code: '2', value: '一', status: false},
            {code: '3', value: '二', status: false},
            {code: '4', value: '三', status: false},
            {code: '5', value: '四', status: false},
            {code: '6', value: '五', status: false},
            {code: '7', value: '六', status: false}
        ],
        selectedOpenDays:[],
        dayOpenTimeZones: []
    }
    /*当前的时分秒输入文本框*/
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
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
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

});