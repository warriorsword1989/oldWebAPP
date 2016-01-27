angular.module("lazymodule", []).controller('DateCtrl', ['$scope','$timeout','$compile', function($scope,$timeout,$compile){
    /*星期*/
    var wks = $scope.wks = {};
    wks.values = [
        {code: '1', value: '日',name: '周日'},
        {code: '2', value: '一',name: '周一'},
        {code: '3', value: '二',name: '周二'},
        {code: '4', value: '三',name: '周三'},
        {code: '5', value: '四',name: '周四'},
        {code: '6', value: '五',name: '周五'},
        {code: '7', value: '六',name: '周六'},
    ];
    /*固定时间星期*/
    wks.selection = wks.values[0];
    /*持续时间——周——开始时间*/
    wks.wBeginSelection = wks.values[0];
    /*持续时间——周——开始时间*/
    wks.wEndSelection = wks.values[0];

    /*日、周、月*/
    var dwm = $scope.dwm = {};
    dwm.values = [
        {code:'d',value:'日'},
        {code:'w',value:'周'},
        {code:'m',value:'月'}
    ];
    dwm.selection = dwm.values[0];

    /*月份*/
    var mons = $scope.mons = {};
    mons.values = [
    {
      code: 1,
      label: '1月'
    },
    {
      code: 2,
      label: '2月'
    },
    {
      code: 3,
      label: '3月'
    },
    {
      code: 4,
      label: '4月'
    },
    {
      code: 5,
      label: '5月'
    },
    {
      code: 6,
      label: '6月'
    },
    {
      code: 7,
      label: '7月'
    },
    {
      code: 8,
      label: '8月'
    },
    {
      code: 9,
      label: '9月'
    },
    {
      code: 10,
      label: '10月'
    },
    {
      code: 11,
      label: '11月'
    },
    {
      code: 12,
      label: '12月'
    },
    ];
    /*持续时间--开始月份*/
    mons.begin = mons.values[0];
    /*持续时间--结束月份*/
    mons.end = mons.values[0];
    
    /*时间段list*/
    $scope.dateList = [];
    $scope.dateListAll = [];
    /*——————————解析————————*/
    /*根据总的时间字符串拆分成多个字符串数组*/
    $scope.newStr = function(str){
        if(str){
            var dateArr = str.substr(1,str.length-2).split('');
            for(var i=0;i<dateArr.length;i++){
                if(dateArr[i] == '+' && (dateArr[i-1]== ']' && dateArr[i+1]== '[')){
                    dateArr[i] = '&';
                }
            }
            return dateArr.join('').split('&');
        }else{
            return false;
        }
    }
    $scope.listInit = function(){
        var indexList = [];     //新建数组，用于记录要清空的数组角标
        /*遍历寻找二维数组重新整合数组，二维则进行拼接*/
        if(newArr){
            for(var i=0;i<newArr.length;i++){
                if(newArr[i].split('[').length - 1 != newArr[i].split(']').length - 1 && i!=newArr.length-1){
                    for(var j=i;j<newArr.length;j++){
                        if(newArr[j].split(']').length - 1 > newArr[j].split('[').length - 1){
                            break;
                        }
                        newArr[i] = newArr[i]+'+'+newArr[j+1];
                        indexList.push(j+1);
                    }
                }
            }
        }
        /*将重复和多余的二维数组片段赋值为空*/
        $.each(indexList,function(i,v){
            newArr[v] = '';
        })
    }
    var newArr = $scope.newStr($scope.dateString);
    /*外部传递str*/
    $scope.$on('set-code', function(event,data) {
        if(data){
            $scope.dateList = [];
            $scope.dateString = data;
            /*如果服务返回的字符串只有一段时间，则加上[]然后进行解析*/
            if(($scope.dateString).indexOf('(') == 1){
                $scope.dateString = '['+$scope.dateString+']';
            }
            newArr = $scope.newStr($scope.dateString);
            $scope.listInit();
            $scope.translate($scope.arrEmpty(newArr));
            $scope.dateString = data;
        }
    });
    /*初始化字符串*/
    $scope.listInit();  
    /*根据星期 转换成中文*/
    $scope.weekTranslate = function(week){
        switch(week){
            case '1':
                return '周日';
            case '2':
                return '周一';
            case '3':
                return '周二';
            case '4':
                return '周三';
            case '5':
                return '周四';
            case '6':
                return '周五';
            case '7':
                return '周六';
            default:
                return '未知';
        }
    }
    /*判断是否为最后一个，有加、没有不加*/
    $scope.isLast = function(arr,str){
        $.each(arr,function(i,v){
            if(i == arr.length){
                str += v;
            }else{
                str += v+'、';
            }
        });
    }
    /*数组去空*/
    $scope.arrEmpty = function(arr){
        return $.grep(arr, function(n) {return $.trim(n).length > 0;})
    }
    /*解析时间*/
    $scope.timeAnalyze = function(time){
        if(time.indexOf('m') > -1 || time.indexOf('h') > -1){       //如果时间包含时分
            var cTime = time.split('h')[1].split('m');
            if(time.split('h')[0].substr(0,1) == 'y'){
                var tDate = time.split('h')[0];
                return tDate.split('y')[1].split('M')[0]+'年'+tDate.split('y')[1].split('M')[1].split('d')[0]+'月'+tDate.split('y')[1].split('M')[1].split('d')[1]+'日的'+cTime[0]+':'+cTime[1];
            }else{
                var hTemp = (cTime[0]=='0')?'00':cTime[0];
                var mTemp = (cTime[1]=='0')?'00':cTime[1];
                return hTemp+':'+mTemp;
            }
        }else if(time.indexOf('M') > -1 && time.indexOf('d') > -1 && time.indexOf('y') == -1){      //(Mxdx)
            return time.split('M')[1].split('d')[0]+'月'+time.split('M')[1].split('d')[1]+'日';
        }else{      //只有年月日
            return time.split('y')[1].split('M')[0]+'年'+time.split('y')[1].split('M')[1].split('d')[0]+'月'+time.split('y')[1].split('M')[1].split('d')[1]+'日';
        }
        
    }
    /*解析字符串数组*/
    $scope.translate = function(arr){
        var vague = false;      //是否模糊
        $scope.translateDetail = function(v){       //验证是否为模糊
            var arrStr = v.join('');
            var detail = '';
            var dateSingle;
            var originCode = v;
            if(arrStr.indexOf('*z')>-1){
                vague = true;
                v = arrStr.slice(0,arrStr.length-2);        //删除*z
                dateSingle = v.substr(1,v.length-2).split('+');         //删除最外层的“[]”
            }else{
                vague = false;
                v = v.join('');     //删除*z
                dateSingle = arrStr.substr(0,arrStr.length).split('+');
            }
            if(dateSingle.length == 1){     //ex:["(t2t3t4t5t6)"]
                var weeks = dateSingle.join('').substr(1,dateSingle.join('').length-2);
                var weeks_arr = weeks.split(')*(');
                var weeksStr = [];
                var _time = '';   //时间
                var dateTme = '';   //时间
                var mutiDate = [];      //多维数组
                var dateMonth = [];     //月份
                var tempDays = [];      //[[(xxxx)(xxxx)]*[(t2){d4}]]
                if(weeks_arr.length > 1 && weeks_arr[0].indexOf(')(h') > -1){
                    weeksStr = $scope.arrEmpty(weeks_arr[1].split('t'));    //星期数组去空
                    dateTme = weeks_arr[0];
                // }else if(weeks_arr.length > 1 && weeks_arr[0].indexOf(')(y') > -1){      //持续——日，例如 [(y2015M07d16h14m34)(y2015M12d30h16m36)]
                }else{
                    if(weeks_arr[0].split('')[0] == '(' && weeks_arr[0].split('')[weeks_arr[0].split('').length-1] == ')'){
                        var dateArr = weeks_arr[0].split('');
                        dateArr[0] = '';
                        dateArr[dateArr.length-1] = '';
                        weeksStr.push($scope.arrEmpty(dateArr).join(''));
                    }else if(weeks_arr[0].split('')[0] == 'M'){     //月份拆分
                        dateMonth = weeks_arr[0].split(')(');
                    }else if(weeks_arr[0].indexOf('){d') > -1){     //持续——周——连续天数{d4}
                        weeks_arr[0] = weeks_arr[0].substr(1,weeks_arr[0].length-2);
                        tempDays = weeks_arr[0].split(')]*[(');
                    }else{
                        weeksStr = $scope.arrEmpty(weeks_arr[0].split('t'));
                    }   //星期数组去空
                }
                mutiDate = weeksStr.join('').split('][');
                if(weeksStr.length > 1 && mutiDate.length == 1){
                    $.each(weeksStr,function(m,n){
                        if(n){
                            if(m == weeksStr.length-1){
                                detail += $scope.weekTranslate(n);
                            }else{
                                detail += $scope.weekTranslate(n)+'、';
                            }
                        }
                    });
                    detail = '每个星期的' + detail;
                    if(dateTme){
                        $.each(dateTme.split(')('),function(i,v){       //选择固定 时间（只选择时间）
                            if(i == 0){
                                _time = $scope.timeAnalyze(v);
                            }else{
                                _time = _time + ' 到 ' + $scope.timeAnalyze(v);
                            }
                        });
                        detail = detail + '的 ' + _time;     //每个星期的周几的几点到几点
                    }
                }else if(weeksStr.length == 1 && mutiDate.length == 1){
                    var _time = '';
                    $.each(weeksStr.join('').split(')('),function(i,v){     //选择固定 时间（只选择时间）
                        if(i == 0){
                            _time = $scope.timeAnalyze(v);
                        }else{
                            _time = _time + ' 到 ' + $scope.timeAnalyze(v);
                        }
                    });
                    if(weeks_arr[0].split('')[0] == '(' && weeks_arr[0].split('')[weeks_arr[0].split('').length-1] == ')'){     //如果是持续时间 从...
                        detail = '从' + _time;
                        if(weeks_arr[0].indexOf(')(M') > -1){   //(M12d1)(M12d31)]*[(h23m0)(h23m59)
                            var temp = weeks_arr[0].substr(1,weeks_arr[0].length-2);
                            var _arr = temp.split(')]*[(');
                            detail = '从'+
                                $scope.timeAnalyze(_arr[0].split(')(')[0])+'的'+
                                $scope.timeAnalyze(_arr[1].split(')(')[0])+'到'+
                                $scope.timeAnalyze(_arr[0].split(')(')[1])+'的'+
                                $scope.timeAnalyze(_arr[1].split(')(')[1]);
                        }
                        /*$.each(splitArr,function(i,v){        //选择持续 日（连续的年月日，跨年处理）
                            if(i == 0){
                                _time = $scope.timeAnalyze(v);
                            }else{
                                _time = _time + ' 到 ' + $scope.timeAnalyze(v);
                            }
                        });*/
                    }else if(weeks_arr[0].indexOf('t') > -1){       //持续时间——周，同一天
                        var shortArr = weeks_arr[0].split('*');
                        var weekCode = '';
                        if(shortArr[0].indexOf('t') > -1){
                            weekCode = shortArr[0].substr('1');
                        }else{
                            weekCode = shortArr[1].substr('1');
                        }
                        detail = '每个' + $scope.weekTranslate(weekCode) + '的' + _time.substr(0,_time.length-2);
                    }else{
                        detail = '每天的 ' + _time;        //如果是固定时间——每天的...
                    }
                }else if(weeksStr.length == 1 && mutiDate.length > 1){
                    var splitArr = [];
                    $.each(mutiDate,function(m,n){
                        if(m == 0){
                            n = n.substring(0,n.length-1);
                            splitArr.push(n.split(')(')[0]);
                        }else if(m == mutiDate.length-1){
                            n = n.substring(1,n.length);
                            splitArr.push(n.split(')(')[1]);
                        }else{
                            n = n.substring(1,n.length-1);
                        }
                    });
                    $.each(splitArr,function(i,v){      //选择持续 日（连续的年月日，跨年处理）
                        if(i == 0){
                            _time = $scope.timeAnalyze(v);
                        }else{
                            _time = _time + ' 到 ' + $scope.timeAnalyze(v);
                        }
                    });
                    detail = '从' + _time;
                }else if(tempDays.length > 1){  //{d4}的情况
                    var temp;
                    if(tempDays[0].indexOf('){d') > -1){
                        temp = tempDays[0].split('){')
                        detail = '每个星期中'+
                            $scope.weekTranslate(temp[0].split('t')[1])+'的'+
                            $scope.timeAnalyze(tempDays[1].split(')(')[0])+'到'+
                            $scope.weekTranslate(parseInt(temp[0].split('t')[1])+parseInt(temp[1].split('d')[1])+'')+'的'+
                            $scope.timeAnalyze(tempDays[1].split(')(')[1]);
                    }else{
                        temp = tempDays[1].split('){');
                        detail = '每个星期中'+
                            $scope.weekTranslate(temp[0].split('t')[1])+'的'+
                            $scope.timeAnalyze(tempDays[0].split(')(')[0])+'到'+
                            $scope.weekTranslate(parseInt(temp[0].split('t')[1])+parseInt(temp[1].split('d')[1])+'')+'的'+
                            $scope.timeAnalyze(tempDays[0].split(')(')[1]);
                    }
                }
                if(dateMonth.length > 1){       //不跨年的月份
                    detail = '每年的 '+dateMonth[0].substr(1)+' 月份到 '+dateMonth[1].substr(1)+' 月份';
                }
            }else{
                /*所选月份跨年*/
                var mBegin ,mEnd;
                $.each(dateSingle,function(m,n){
                    if(m == 0){
                        mBegin = n.split('M')[1].split(')(')[0];
                    }else if(m == 1){
                        mEnd = n.split('M')[2].split(')')[0];
                    }
                });
                detail = '每年的'+mBegin+'月到次年的'+mEnd+'月';
            }
            /*持续时间——周，例如：每个星期中周二的09:33到周六的14:33*/
            if(v.split('][').length > 1 && v.split('][')[0].indexOf('t') > -1 && v.split('][')[0].indexOf('h') > -1 && v.split('][')[0].indexOf('m') > -1 && v.split('][')[0].indexOf('y') == -1 && v.split('][')[0].indexOf('M') == -1 && v.split('][')[0].indexOf('d') == -1){
                var weekArr = [];
                var bwk,ewk,btime,etime;
                if(vague){
                    v = v.substring(2,v.split("").length-2);
                    weekArr = v.split('][');
                }else{
                    v = v.substring(1,v.split("").length-1);
                    weekArr = v.split('][');
                }
                $.each(weekArr,function(m,n){
                    var wkAtime = [];
                    if(m == 0){
                        wkAtime = n.split('*');
                        if(wkAtime[0].indexOf('t')>-1){
                            bwk = $scope.weekTranslate(wkAtime[0].substr(1));
                            btime = wkAtime[1].split(')(')[0].split('[(')[1];
                        }else{
                            bwk = $scope.weekTranslate(wkAtime[1].substr(1));
                            btime = wkAtime[0].split(')(')[0].split('[(')[1];
                        }
                    }else if(m == weekArr.length-1){
                        wkAtime = n.split('*');
                        if(wkAtime[0].indexOf('t')>-1){
                            ewk = $scope.weekTranslate(wkAtime[0].substr(1));
                            etime = wkAtime[1].split(')(')[1].split(')]')[0];
                        }else{
                            ewk = $scope.weekTranslate(wkAtime[1].substr(1));
                            etime = wkAtime[0].split(')(')[1].split(')]')[0];
                        }
                    }
                });
                btime = $scope.timeAnalyze(btime);
                etime = $scope.timeAnalyze(etime);
                detail = '每个星期中'+bwk+'的'+btime+'到'+ewk+'的'+etime;
            }
            if(vague)
                detail = detail + '（模糊）';
            $scope.dateList.push({
                code:'['+originCode.join("+")+']',
                describe:detail
            });
            if($scope.dateString){
                $scope.dateString = $scope.dateString + '['+originCode.join("+")+']';
            }else{
                $scope.dateString = '['+originCode.join("+")+']';
            }
        }
        $.each(arr,function(i,v){
            if(v){
                v = $scope.newStr(v)
                $scope.translateDetail(v);
            }
        }); 
    }
    $scope.translate($scope.arrEmpty(newArr));
    /*删除时间段*/
    $scope.removeList = function(e){
        var dateTimeWell = $(e.target).parents('.date-well').parent();
        var itemCode = $(e.target).parents('.date-list').find('.date-code-list').attr('date-code');
        $(e.target).parents('.date-list').remove();
        $scope.listInit();
        $scope.dateString = ($scope.dateString).replace(itemCode, "");      //之前存在的时间段从数组中删除
        $scope.dateString = ($scope.dateString).replace(/\+\+/, "+");
        $scope.dateString = ($scope.dateString).replace(/\[\+\[/, "[[");
        $scope.dateString = ($scope.dateString).replace(/\]\+\]/, "]]");
        $scope.$emit('get-date',$scope.dateString);
        if(dateTimeWell.hasClass('muti-date'))
            dateTimeWell.attr('date-str',$scope.dateString);
    }
    /*点击选择日期*/
    $scope.dateSelect = function(e){
        var $datetip = $(e.target).parents(".date-well").find(".datetip");
        if($datetip.css('display') == 'none'){
            // $(".datetip").css('top',(getMousePos(e).y -20) + 'px');
            // $(".arrow").css('right',(15) + 'px');
            $(".datetip").css('top','10%');
            // $(e.target).parents(".date-well").find('.bg-hide-div').css('background-color')
            console.log(document.documentElement.scrollTop,getMousePos(e).y,250)
            $datetip.fadeIn();
        }else{
            $datetip.fadeOut();
        }
    }
    /*点击选择时间*/
    $scope.selectTime = function(e){
        $(e.target).timepicki($scope,$(e.target).attr('ng-model'));
    }
    /*选择时间段类型——固定时间、持续时间*/
    $scope.timeType = function(e){
        var dateTip = $(e.target).parents('.datetip');
        if($(e.target).attr('time-type') == 'fix-time'){
            dateTip.find('.fix-time').show();
            dateTip.find('.continue-time').hide();
        }else{
            dateTip.find('.fix-time').hide();
            dateTip.find('.continue-time').show();
        }
    }
    /*选择 日月周 ，切换*/
    $scope.dwmType = function(e,switchObj){
        var dateTip = $(e.target).parents('.datetip');
        switch(switchObj.code){
            case 'd':
                dateTip.find('.day-well').show();
                dateTip.find('.week-well').hide();
                dateTip.find('.month-well').hide();
                dwm.selection = dwm.values[0];
                break;
            case 'w':
                dateTip.find('.week-well').show();
                dateTip.find('.day-well').hide();
                dateTip.find('.month-well').hide();
                dwm.selection = dwm.values[1];
                break;
            case 'm':
                dateTip.find('.month-well').show();
                dateTip.find('.week-well').hide();
                dateTip.find('.day-well').hide();
                dwm.selection = dwm.values[2];
                break;
            default:
                dateTip.find('.day-well').show();
                dateTip.find('.week-well').hide();
                dateTip.find('.month-well').hide();
                break;
        }
    }
    // 加载bootstrap-datepicker
    $.each($(".date-picker"),function(i,v){
        $(v).datepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            multidate: false,
            clearBtn: false,
            todayBtn: true,
            allBtn: false,
            autoclose: true
        });
    });
    $scope.datePicker = function(event){
        $(event.target).datepicker().off("changeDate").on("changeDate", function(e) {
            if (e.date) {
                var dayWell = $(event.target).parents('.day-well');
                var endPiker = dayWell.find('.date-picker[picker-name="dEndDate"]');
                var month = e.date.getMonth() + 1 < 10 ? "0" + (e.date.getMonth() + 1) : (e.date.getMonth() + 1);
                var date = e.date.getDate() < 10 ? "0" + e.date.getDate() : e.date.getDate();
                var str = e.date.getFullYear() + "-" + month + "-" + date;
                var picker_name = $(event.target).attr('picker-name');
                $scope.$apply(function(){
                    switch(picker_name)
                    {
                        case 'dBeginDate':
                            $scope.dBeginDate = str;
                            endPiker.datepicker('setStartDate',str);
                            if($scope.dEndDate < $scope.dBeginDate){
                                $scope.dEndDate = "";
                            }
                            break;
                        case 'dEndDate':
                            $scope.dEndDate = str;
                            break;
                        default:
                            break;
                    }
                });
            }
        });
    }
    /*点击输入框选择日期*/
    $scope.selectDate = function(e){
        $timeout(function() {
            $(e.target).parents('.time-select').find('.date-picker').triggerHandler('click');
        });
    }
    /*点击星期 激活active*/
    $scope.wks.checks = [];
    $scope.weekGroup = function(e){
        var checkObject = {
            name:$(e.target).attr('check-name'),
            value:$(e.target).attr('check-value'),
            code:$(e.target).attr('check-code')
        }
        if($(e.target).hasClass('active')){
            $(e.target).removeClass('active');
            $scope.wks.checks.splice(jQuery.inArray(checkObject,$scope.wks.checks),1);
        }else{
            $(e.target).addClass('active');
            $scope.wks.checks.push(checkObject);
        }
    }
    /*选择星期*/
    $scope.seletedAddon = function(e){
        if($(e.target).attr('ng-model') == 'wks.wBeginSelection'){
            if($scope.wks.wBeginSelection){
                if($scope.wks.wBeginSelection.code > $scope.wks.wEndSelection.code){
                    $scope.wks.wEndSelection = $scope.wks.values[6];
                }
            }
        }else{
            if($scope.wks.wEndSelection){
                if($scope.wks.wBeginSelection.code > $scope.wks.wEndSelection.code){
                    $scope.wks.wBeginSelection = $scope.wks.values[0];
                }
            }
        }
    }
    /*错误提示*/
    $scope.alertMsg = function(dateWell,msg){
        dateWell.find(".error-msg").text(msg);
        dateWell.find('.date-msg').show();
        var timer = $timeout(function(){
            dateWell.find('.date-msg').fadeOut();
        },2000);
    }
    /*成功提示*/
    $scope.alertSucMsg = function(dateWell,msg){
        dateWell.find(".success-msg").text(msg);
        dateWell.find('.date-suc-msg').show();
        var timer = $timeout(function(){
            dateWell.find('.date-suc-msg').fadeOut();
        },2000);
    }
    /*验证输入是否合法*/
    $scope.dateValid = function(dateWell){
        if(dateWell.find("input[time-type='fix-time']").is(':checked')){
            if($scope.wks.checks.length == 0 && !$scope['begin_time'] && !$scope['end_time']){
                $scope.alertMsg(dateWell,'请至少选择一个条件！');
                return false;
            };
            if(!$scope['begin_time'] && $scope['end_time']){
                $scope.alertMsg(dateWell,'请选择开始时间！');
                return false;
            };
            if($scope['begin_time'] && !$scope['end_time']){
                $scope.alertMsg(dateWell,'请选择结束时间！');
                return false;
            };
            if($scope['begin_time'] >= $scope['end_time'] && $scope['begin_time'] && $scope['end_time']){
                $scope.alertMsg(dateWell,'结束时间必须大于开始时间！');
                return false;
            };
            return true
        }else{
            /*如果选择 持续时间分为三种情况——日、周、月*/
            switch(dwm.selection.code){
                case 'd':
                    if(!$scope.dBeginDate){
                        $scope.alertMsg(dateWell,'请选择开始日期！');
                        break;
                    };
                    if(!$scope.dEndDate){
                        $scope.alertMsg(dateWell,'请选择结束日期！');
                        break;
                    };
                    if(!$scope['d_begin_time'] && $scope['d_end_time']){
                        $scope.alertMsg(dateWell,'请选择开始时间！');
                        break;
                    };
                    if($scope['d_begin_time'] && !$scope['d_end_time']){
                        $scope.alertMsg(dateWell,'请选择结束时间！');
                        break;
                    };
                    if($scope['dBeginDate'] == $scope['dEndDate'] && !$scope['d_begin_time'] && !$scope['d_end_time']){
                        $scope.alertMsg(dateWell,'开始时间不能等于结束时间！');
                        break;
                    };
                    if($scope['dBeginDate'] == $scope['dEndDate'] && $scope['d_begin_time']>$scope['d_end_time']){
                        $scope.alertMsg(dateWell,'结束时间必须大于开始时间！');
                        break;
                    };
                    return true;
                case 'w':
                    if(!$scope.wks.wBeginSelection && $scope.wks.wEndSelection){
                        $scope.alertMsg(dateWell,'请选择开始时间的星期！');
                        break;
                    };
                    if(!$scope['w_begin_time'] && $scope['w_end_time']){
                        $scope.alertMsg(dateWell,'请选择开始时间！');
                        break;
                    };
                    if(!$scope.wks.wEndSelection && $scope.wks.wBeginSelection){
                        $scope.alertMsg(dateWell,'请选择结束时间的星期！');
                        break;
                    };
                    if(!$scope['w_end_time'] && $scope['w_begin_time']){
                        $scope.alertMsg(dateWell,'请选择结束时间！');
                        break;
                    };
                    if(($scope.wks.wBeginSelection == $scope.wks.wEndSelection) && ($scope['w_begin_time'] == $scope['w_end_time'])){
                        $scope.alertMsg(dateWell,'开始时间不能等于结束时间！');
                        break;
                    };
                    if(($scope.wks.wBeginSelection == $scope.wks.wEndSelection) && ($scope['w_begin_time'] > $scope['w_end_time'])){
                        $scope.alertMsg(dateWell,'开始时间不能大于结束时间！');
                        break;
                    };
                    return true;
                case 'm':
                    if(!$scope.mons.begin.code){
                        $scope.alertMsg(dateWell,'请选择开始月份！');
                        break;
                    };
                    if(!$scope.mons.end.code){
                        $scope.alertMsg(dateWell,'请选择结束月份！');
                        break;
                    };
                    if($scope.mons.end.code == $scope.mons.begin.code){
                        $scope.alertMsg(dateWell,'开始月份不能等于结束月份！');
                        break;
                    };
                    return true;
                default:
                    $scope.alertMsg(dateWell,'请正确输入！');
                    break;
            }
        }
    };
    /*保存时间段*/
    $scope.dateSave = function(e){
        var dateWell = $(e.target).parents('.datetip');
        var dateListWell = $(e.target).parents('.date-well');
        /*初始化时间段tip*/
        $scope.dateInit = function(){
            /*固定时间*/
            $scope.wks.checks = [];
            dateWell.find('.week-group').each(function(i,v){
                $(v).removeClass('active');
            });
            $scope.wks.selection = $scope.wks.values[0];
            $scope.begin_time = '';
            $scope.end_time = '';
            /*持续时间*/
            // scope.dwm.selection = scope.dwm.values[0];
            /*日*/
            $scope.dBeginDate = '';
            $scope.dEndDate = '';
            /*scope['d_begin_time'] = '';
            scope['d_end_time'] = '';*/
            /*周*/
            $scope.wks.wBeginSelection = $scope.wks.values[0];
            $scope.wks.wEndSelection = $scope.wks.values[0];
            /*scope['w_begin_time'] = '';
            scope['w_end_time'] = '';*/
            /*月*/
            $scope.mons.begin = $scope.mons.values[0];
            $scope.mons.end = $scope.mons.values[0];
            /*模糊时间*/
            $scope.vagueTime = false;
            /*dateWell.find(".select-time").each(function(i,v){
                $(v).val('');
            });*/
        }
        /*保存时处理过的数据，一个code一个中文描述*/
        var dateTime = {
            code:function(){
                if(dateWell.find("input[time-type='fix-time']").is(':checked')){
                    var checksList = [];
                    $.each($scope.wks.checks,function(i,v){
                        checksList.push(v.code);
                    });
                    var _result = '';
                    $.each(checksList.sort(),function(i,v){
                        _result += 't'+v;
                    });
                    /*第一种可能：固定时间 只选择了星期*/
                    if(!$scope['begin_time'] && !$scope['end_time']){
                        if($scope.vagueTime){
                            return '[('+_result+')*z]';
                        }else{
                            return '[('+_result+')]';
                        }
                    }else if($scope.wks.checks.length != 0 && $scope['begin_time'] && $scope['end_time']){     //第二种可能：固定时间 选了 星期和 时间段
                        var $beginTime = $scope['begin_time'].split(":");
                        var $endTime = $scope['end_time'].split(":");
                        var $beginHour = $beginTime[0];
                        var $beginMinute = $beginTime[1];
                        var $endHour = $endTime[0];
                        var $endMinute = $endTime[1];
                        if($scope.vagueTime){
                            return '[[(h'+$beginHour+'m'+$beginMinute+')(h'+$endHour+'m'+$endMinute+')*('+_result+')]*z]'
                        }else{
                            return '[(h'+$beginHour+'m'+$beginMinute+')(h'+$endHour+'m'+$endMinute+')*('+_result+')]';
                        }
                    }else if($scope.wks.checks.length == 0){  //第三种可能：固定时间 只选择时间段
                        var $beginTime = $scope['begin_time'].split(":");
                        var $endTime = $scope['end_time'].split(":");
                        var $beginHour = $beginTime[0];
                        var $beginMinute = $beginTime[1];
                        var $endHour = $endTime[0];
                        var $endMinute = $endTime[1];
                        if($scope.vagueTime){
                            return '[[(h'+$beginHour+'m'+$beginMinute+')(h'+$endHour+'m'+$endMinute+')]*z]'
                        }else{
                            return '[(h'+$beginHour+'m'+$beginMinute+')(h'+$endHour+'m'+$endMinute+')]';
                        }
                    }
                }else{
                    /*如果选择 持续时间分为三种情况——日、周、月*/
                    switch(dwm.selection.code){
                        case 'd':
                            var $beginDate = $scope.dBeginDate.split("-");
                            var $beginYear = $beginDate[0]; //开始年份
                            var $beginMonth = $beginDate[1];    //开始月份
                            var $beginDay = $beginDate[2];  //开始天数
                            var $endDate = $scope.dEndDate.split("-");
                            var $endYear = $endDate[0]; //结束年份
                            var $endMonth = $endDate[1];    //结束月份
                            var $endDay = $endDate[2];  //结束天数
                            var $beginTime,$beginHour,$beginMinute;
                            if($scope['d_begin_time']){
                                $beginTime = $scope['d_begin_time'].split(":");
                                $beginHour = $beginTime[0]; //开始小时数
                                $beginMinute = $beginTime[1];   //开始分钟
                            }
                            var $endTime,$endHour,$endMinute;
                            if($scope['d_end_time']){
                                $endTime = $scope['d_end_time'].split(":");
                                $endHour = $endTime[0]; //结束小时数
                                $endMinute = $endTime[1];   //结束分钟
                            }
                            var yearLength = parseInt($endYear) - parseInt($beginYear);
                            if($scope.vagueTime){
                                /*如果没有选择时间，只选择日期*/
                                if(!$scope['d_begin_time'] || !$scope['d_end_time']){
                                    if(yearLength == 0){   //开始年和结束年为同一年
                                        return '[[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+')'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+')]]*z]';
                                    }else if(yearLength ==1){       //结束年是开始年的后一年
                                        return '[[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+')'+
                                            '(y'+$beginYear+'M12d31)]'+
                                            '[(y'+$endYear+'M1d1)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+')]]*z]';
                                    }else if(yearLength > 1){    //结束年比开始年大若干年份
                                        var difYear = '';
                                        var bYear = parseInt($beginYear);
                                        for(var i=1;i<yearLength;i++){
                                            difYear = difYear+'+[(y'+(bYear+i)+'M1d1)(y'+(bYear+i)+'M12d31)]';
                                        }
                                        return '[[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+')'+
                                            '(y'+$beginYear+'M12d31)]'+
                                            difYear +
                                            '+[(y'+$endYear+'M1d1)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+')]]*z]';
                                    }
                                }else{
                                    /*如果既选择时间又选择日期*/
                                    if(yearLength == 0){   //开始年和结束年为同一年
                                        return '[[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+'h'+$beginHour+'m'+$beginMinute+')'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+'h'+$endHour+'m'+$endMinute+')]]*z]';
                                    }else if(yearLength ==1){       //结束年是开始年的后一年
                                        return '[[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+'h'+$beginHour+'m'+$beginMinute+')'+
                                            '(y'+$beginYear+'M12d31h23m59)]+'+
                                            '[(y'+$endYear+'M1d1h0m0)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+'h'+$endHour+'m'+$endMinute+')]]*z]';
                                    }else if(yearLength > 1){    //结束年比开始年大若干年份
                                        var difYear = '';
                                        var bYear = parseInt($beginYear);
                                        for(var i=1;i<yearLength;i++){
                                            difYear = difYear+'+[(y'+(bYear+i)+'M1d1h0m0)(y'+(bYear+i)+'M12d31h23m59)]';
                                        }
                                        return '[[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+'h'+$beginHour+'m'+$beginMinute+')'+
                                            '(y'+$beginYear+'M12d31h23m59)]'+
                                            difYear +
                                            '+[(y'+$endYear+'M1d1h0m0)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+'h'+$endHour+'m'+$endMinute+')]]*z]';
                                    }
                                }
                            }else{      
                                if(!$scope['d_begin_time'] || !$scope['d_end_time']){
                                    if(yearLength == 0){   //开始年和结束年为同一年
                                        return '[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+')'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+')]';
                                    }else if(yearLength ==1){       //结束年是开始年的后一年
                                        return '[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+')'+
                                            '(y'+$beginYear+'M12d31)]+'+
                                            '[(y'+$endYear+'M1d1)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+')]]';
                                    }else if(yearLength > 1){    //结束年比开始年大若干年份
                                        var difYear = '';
                                        var bYear = parseInt($beginYear);
                                        for(var i=1;i<yearLength;i++){
                                            difYear = difYear+'+[(y'+(bYear+i)+'M1d1)(y'+(bYear+i)+'M12d31)]';
                                        }
                                        return '[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+')'+
                                            '(y'+$beginYear+'M12d31)]'+
                                            difYear +
                                            '+[(y'+$endYear+'M1d1)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+')]]';
                                    }
                                }else{
                                    if(yearLength == 0){   //开始年和结束年为同一年
                                        return '[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+'h'+$beginHour+'m'+$beginMinute+')'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+'h'+$endHour+'m'+$endMinute+')]';
                                    }else if(yearLength ==1){       //结束年是开始年的后一年
                                        return '[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+'h'+$beginHour+'m'+$beginMinute+')'+
                                            '(y'+$beginYear+'M12d31h23m59)]'+
                                            '[(y'+$endYear+'M1d1h0m0)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endMinute+'h'+$endHour+'m'+$endDay+')]]';
                                    }else if(yearLength > 1){    //结束年比开始年大若干年份
                                        var difYear = '';
                                        var bYear = parseInt($beginYear);
                                        for(var i=1;i<yearLength;i++){
                                            difYear = difYear+'+[(y'+(bYear+i)+'M1d1h0m0)(y'+(bYear+i)+'M12d31h23m59)]';
                                        }
                                        return '[[(y'+$beginYear+'M'+$beginMonth+'d'+$beginDay+'h'+$beginHour+'m'+$beginMinute+')'+
                                            '(y'+$beginYear+'M12d31h23m59)]'+
                                            difYear +
                                            '+[(y'+$endYear+'M1d1h0m0)'+
                                            '(y'+$endYear+'M'+$endMonth+'d'+$endDay+'h'+$endHour+'m'+$endMinute+')]]';
                                    }
                                }
                            }
                        case 'w':   //持续时间——周
                            var $beginWeek = $scope.wks.wBeginSelection;
                            var $beginWeekCode = $beginWeek.code;   //开始周数code
                            var $beginWeekName = $beginWeek.name;   //开始周数name
                            var $endWeek = $scope.wks.wEndSelection;
                            var $endWeekCode = $endWeek.code;   //结束周数code
                            var $endWeekName = $endWeek.name;   //结束周数name
                            var $beginTime,$beginHour,$beginMinute;
                            if($scope['w_begin_time']){
                                $beginTime = $scope['w_begin_time'].split(":");
                                $beginHour = $beginTime[0]; //开始小时数
                                $beginMinute = $beginTime[1];   //开始分钟
                            }
                            var $endTime,$endHour,$endMinute;
                            if($scope['w_end_time']){
                                $endTime = $scope['w_end_time'].split(":");
                                $endHour = $endTime[0]; //结束小时数
                                $endMinute = $endTime[1];   //结束分钟
                            }
                            var bWeek = $scope.wks.wBeginSelection;
                            var eWeek = $scope.wks.wEndSelection;
                            var selWeek = [];
                            for(var i=bWeek.code-1;i<$scope.wks.values.length;i++){
                                if(i == eWeek.code){
                                    break;
                                }
                                selWeek.push($scope.wks.values[i].code);
                            }
                            var _result = [];
                            $.each(selWeek,function(i,v){
                                if($scope['w_begin_time'] && $scope['w_end_time']){
                                    if(i==0){
                                        _result.push('[t'+v+'*[(h'+$beginHour+'m'+$beginMinute+')(h23m59)]]');
                                    }else if(i == selWeek.length-1){
                                        _result.push('[t'+v+'*[(h0m0)(h'+$endHour+'m'+$endMinute+')]]');
                                    }else{
                                        _result.push('[t'+v+'*[(h0m0)(h23m59)]]');
                                    }
                                }else{
                                    _result.push('t'+v);
                                }
                            });
                            if($scope.vagueTime){
                                /*模糊*/
                                if($scope['w_begin_time'] && $scope['w_end_time']){
                                    return '[['+_result.join('+')+']*z]';
                                }else{

                                    return '[[('+_result.join('')+')]*z]';
                                }
                            }else{
                                /*精确*/
                                if($scope['w_begin_time'] && $scope['w_end_time']){
                                    return '['+_result.join('+')+']';
                                }else{

                                    return '[('+_result.join('')+')]';
                                }
                            }
                        case 'm':
                            var $monBegin = $scope.mons.begin;  
                            var $monEnd = $scope.mons.end;
                            var $monBeginCode = $monBegin.code; //开始月份code
                            var $monBeginName = $monBegin.label;    //开始月份label
                            var $monEndCode = $monEnd.code;     //结束月份code
                            var $monEndName = $monEnd.label;    //结束月份label
                            if($scope.vagueTime){
                                if($monBeginCode > $monEndCode){
                                    return '[[(M'+$monBeginCode+')(M12)+(M1)(M'+$monEndCode+')]*z]'
                                }else{
                                    return '[[(M'+$monBeginCode+')(M'+$monEndCode+')]*z]';
                                }
                            }else{
                                if($monBeginCode > $monEndCode){
                                    return '[(M'+$monBeginCode+')(M12)+(M1)(M'+$monEndCode+')]'
                                }else{
                                    return '[(M'+$monBeginCode+')(M'+$monEndCode+')]';
                                }
                            }
                        default:
                            alertMsg(dateWell,'出现错误！');
                            return 'error';
                    }
                }
            },
            describe:function(){
                if(dateWell.find("input[time-type='fix-time']").is(':checked')){
                    var checksList = [];
                    $.each($scope.wks.checks,function(i,v){
                        checksList.push(v.name);
                    });
                    var _result = '';
                    /*新建对象，用于中文排序*/
                    var compareData = {
                        '周日':1,
                        '周一':2,
                        '周二':3,
                        '周三':4,
                        '周四':5,
                        '周五':6,
                        '周六':7,
                    }
                    $.each(checksList.sort(function(a,b){return compareData[a]- compareData[b]}),function(i,v){
                        if(i == checksList.sort(function(a,b){return compareData[a]- compareData[b]}).length-1){
                            _result += v;
                        }else{
                            _result += v+'、';
                        }
                    });
                    /*第一种可能：固定时间 只选择了星期*/
                    if(!$scope['begin_time'] && !$scope['end_time']){
                        if($scope.vagueTime){
                            return '每个星期的' + _result + '(模糊)';
                        }else{
                            return '每个星期的' + _result;
                        }
                    }else if($scope.wks.checks.length != 0 && $scope['begin_time'] && $scope['end_time']){ //第二种可能：固定时间 既有星期还有时间段
                        if($scope.vagueTime){
                            return '每个星期的' + _result +'的'+ $scope['begin_time']+'到'+$scope['end_time']+'（模糊）';
                        }else{
                            return '每个星期的' + _result +'的'+ $scope['begin_time']+'到'+$scope['end_time'];
                        }
                    }else if($scope.wks.checks.length == 0){  //第三种可能：固定时间 只选择时间段
                        if($scope.vagueTime){
                            return '每天的' + $scope['begin_time'] +'到'+ $scope['end_time'] +'（模糊）'
                        }else{
                            return '每天的' + $scope['begin_time'] +'到'+ $scope['end_time'];
                        }
                    }
                }else{
                    /*如果选择 持续时间分为三种情况——日、周、月*/
                    switch(dwm.selection.code){
                        case 'd':
                            var $beginDate = $scope.dBeginDate.split("-");
                            var $beginYear = $beginDate[0]; //开始年份
                            var $beginMonth = $beginDate[1];    //开始月份
                            var $beginDay = $beginDate[2];  //开始天数
                            var $endDate = $scope.dEndDate.split("-");
                            var $endYear = $endDate[0]; //结束年份
                            var $endMonth = $endDate[1];    //结束月份
                            var $endDay = $endDate[2];  //结束天数
                            var $beginTime,$beginHour,$beginMinute;
                            if($scope['d_begin_time']){
                                $beginTime = $scope['d_begin_time'].split(":");
                                $beginHour = $beginTime[0]; //开始小时数
                                $beginMinute = $beginTime[1];   //开始分钟
                            }
                            var $endTime,$endHour,$endMinute;
                            if($scope['d_end_time']){
                                $endTime = $scope['d_end_time'].split(":");
                                $endHour = $endTime[0]; //结束小时数
                                $endMinute = $endTime[1];   //结束分钟
                            }
                            if($scope.vagueTime){
                                if(!$scope['d_begin_time'] || !$scope['d_end_time']){
                                    return $beginYear+'年'+$beginMonth+'月'+$beginDay+'日到'+
                                        $endYear+'年'+$endMonth+'月'+$endDay+'日（模糊）';
                                }else{
                                    return $beginYear+'年'+$beginMonth+'月'+$beginDay+'日的'+$scope['d_begin_time']+'到'+
                                        $endYear+'年'+$endMonth+'月'+$endDay+'日的'+$scope['d_end_time']+'（模糊）';
                                }
                            }else{
                                if(!$scope['d_begin_time'] || !$scope['d_end_time']){
                                    return $beginYear+'年'+$beginMonth+'月'+$beginDay+'日到'+
                                        $endYear+'年'+$endMonth+'月'+$endDay+'日';
                                }else{
                                    return $beginYear+'年'+$beginMonth+'月'+$beginDay+'日的'+$scope['d_begin_time']+'到'+
                                        $endYear+'年'+$endMonth+'月'+$endDay+'日的'+$scope['d_end_time'];
                                }
                            }
                        case 'w':
                            var $beginWeek = $scope.wks.wBeginSelection;
                            var $beginWeekCode = $beginWeek.code;   //开始周数code
                            var $beginWeekName = $beginWeek.name;   //开始周数name
                            var $endWeek = $scope.wks.wEndSelection;
                            var $endWeekCode = $endWeek.code;   //结束周数code
                            var $endWeekName = $endWeek.name;   //结束周数name
                            var $beginTime ,$beginHour ,$beginMinute;
                            if($beginTime){
                                $beginTime = $scope['d_begin_time'].split(":");
                                $beginHour = $beginTime[0];     //开始小时数
                                $beginMinute = $beginTime[1];   //开始分钟
                            }
                            var $endTime ,$endHour ,$endMinute;
                            if($endTime){
                                var $endTime = $scope['d_end_time'].split(":");
                                var $endHour = $endTime[0];     //结束小时数
                                var $endMinute = $endTime[1];   //结束分钟数
                            }
                            if($scope.vagueTime){
                                /*模糊*/
                                if($scope['w_begin_time'] && $scope['w_end_time']){
                                    return '每个星期中'+$scope.wks.wBeginSelection.name+'的'+$scope['w_begin_time']+'到'+
                                        $scope.wks.wEndSelection.name+'的'+$scope['w_end_time']+'（模糊）';
                                }else{
                                    return '每个星期中的'+$scope.wks.wBeginSelection.name+'到'+
                                        $scope.wks.wEndSelection.name+'（模糊）';
                                }
                            }else{
                                /*精确*/
                                if($scope['w_begin_time'] && $scope['w_end_time']){
                                    return '每个星期中'+$scope.wks.wBeginSelection.name+'的'+$scope['w_begin_time']+'到'+
                                        $scope.wks.wEndSelection.name+'的'+$scope['w_end_time'];
                                }else{
                                    return '每个星期中的'+$scope.wks.wBeginSelection.name+'到'+
                                        $scope.wks.wEndSelection.name;
                                }
                            }
                        case 'm':
                            var $monBegin = $scope.mons.begin;  
                            var $monEnd = $scope.mons.end;
                            var $monBeginCode = $monBegin.code; //开始月份code
                            var $monBeginName = $monBegin.label;    //开始月份label
                            var $monEndCode = $monEnd.code;     //结束月份code
                            var $monEndName = $monEnd.label;    //结束月份label
                            if($scope.vagueTime){
                                if($monBeginCode > $monEndCode){
                                    return '每年的'+$monBeginName+'到次年的'+$monEndName+'（模糊）';
                                }else{
                                    return '每年的'+$monBeginName+'到'+$monEndName+'（模糊）';
                                }
                            }else{
                                if($monBeginCode > $monEndCode){
                                    return '每年的'+$monBeginName+'到次年的'+$monEndName;
                                }else{
                                    return '每年的'+$monBeginName+'到'+$monEndName;
                                }
                            }
                        default:
                            if($scope.vagueTime){
                                return '[(h'+$beginHour+'m'+$beginMinute+'t'+$week+'z)(h'+$endHour+'m'+$endMinute+'t'+$week+'z)]'
                            }else{
                                return '[(h'+$beginHour+'m'+$beginMinute+'t'+$week+')(h'+$endHour+'m'+$endMinute+'t'+$week+')]';
                            }
                    }
                }
            }
        };
        if($scope.dateValid(dateWell)){
            $scope.dateCode = dateTime.code();
            $scope.dateDescribe = dateTime.describe();
            /*var _dateList = [];
            _dateList.push('<div class="date-list">');
            _dateList.push('<div class="col-xs-10 col-md-10 col-lg-11 date-code-list" date-code="');
            _dateList.push(dateTime.code());
            _dateList.push('">');
            _dateList.push(dateTime.describe());
            _dateList.push('</div>');
            _dateList.push('<div class="col-xs-2 col-md-2 col-lg-1">');
            _dateList.push('<span class="glyphicon glyphicon-minus-sign remove-date-list pull-right" ng-click="removeList($event)"></span>');
            _dateList.push('</div>');
            _dateList.push('<div class="clearfix"></div>');
            _dateList.push('<div class="line"></div>');
            _dateList.push('</div>');
            var newElem = $compile(_dateList.join(''))($scope);
            dateListWell.find(".date-list:last").after(newElem);*/
            $scope.dateList.push({
                code:dateTime.code(),
                describe:dateTime.describe()
            });
            if(dateWell.find("input[time-type='fix-time']").is(':checked')){
                $scope.alertSucMsg(dateWell,dateTime.describe);
            }else{
                dateWell.fadeOut();
            }
            $scope.dateInit();
            var allStr = '';
            $.each($scope.dateList,function(i,v){
                if(i != $scope.dateList.length-1)
                    allStr += v.code + '+';
                else
                    allStr += v.code;
            });
            $scope.dateString = '['+allStr+']';
            $scope.$emit('get-date',$scope.dateString);
            if(dateListWell.parent().hasClass('muti-date'))
                dateListWell.parent().attr('date-str',$scope.dateString);
        }
    }
    /*清空*/
    $scope.dateEmpty = function(e){
        $scope.dateList.length = 0;
        if($(e.target).parents('.date-well').parent().hasClass('muti-date'))
            $(e.target).parents('.date-well').parent().attr('date-str','');
    }
}]);
/*获取指针位置*/
function getMousePos(event) {
            var position = {};
            var e = event || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            var x = e.pageX || e.clientX + scrollX;
            var y = e.pageY || e.clientY + scrollY;
            position.x = x;
            position.y = y;
            return position;
   }