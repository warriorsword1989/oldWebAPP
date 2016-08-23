var oridinaryInfoApp = angular.module("app",['ui.bootstrap']);
oridinaryInfoApp.controller("commonDeepTimeController",function($scope) {
    var objCtrl = fastmap.uikit.ObjectEditController();
    var eventCtrl = fastmap.uikit.EventController();

    var wks = $scope.wks = {};
    wks.values = [
        {code: '1', value: '日',name: '周日'},
        {code: '2', value: '一',name: '周一'},
        {code: '3', value: '二',name: '周二'},
        {code: '4', value: '三',name: '周三'},
        {code: '5', value: '四',name: '周四'},
        {code: '6', value: '五',name: '周五'},
        {code: '7', value: '六',name: '周六'}
    ];
    //隐藏时间面板;
    $scope.hidePopover = function (t){
        $('body .carTypeTip:last').hide();
    };
    $scope.selectTime = function(e){
        $(e.target).timepicki($scope,$(e.target).attr('ng-model'));
    }



    //
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function() {
        $scope.dt = null;
    };

    $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
    };

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

    $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
    };

    $scope.toggleMin();

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
    $scope.altInputFormats = ['M!/d!/yyyy'];

    $scope.popup1 = {
        opened: false
    };

    $scope.popup2 = {
        opened: false
    };

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var afterTomorrow = new Date();
    afterTomorrow.setDate(tomorrow.getDate() + 1);
    $scope.events = [
        {
            date: tomorrow,
            status: 'full'
        },
        {
            date: afterTomorrow,
            status: 'partially'
        }
    ];

    function getDayClass(data) {
        var date = data.date,
            mode = data.mode;
        if (mode === 'day') {
            var dayToCheck = new Date(date).setHours(0,0,0,0);

            for (var i = 0; i < $scope.events.length; i++) {
                var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                    return $scope.events[i].status;
                }
            }
        }

        return '';
    }


    ///

    eventCtrl.off(eventCtrl.eventTypes.SELECTEDVEHICLECHANGE);
    eventCtrl.on(eventCtrl.eventTypes.SELECTEDVEHICLECHANGE, $scope.initializeData);
});