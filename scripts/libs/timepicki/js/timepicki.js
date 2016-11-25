(function($) {
    $.fn.timepicki = function(scope,model) {
        // var defaults = {};
        /*var settings = $.extend({},
        defaults, setting);*/
        return this.each(function() {
            var ele = $(this);
            var ele_hei = ele.outerHeight();
            // var ele_lef = ele.position().left;
            ele_hei += 10;
            if($(ele).parent(".time_pick").length < 1){
                $(ele).wrap("<div class='time_pick'>");
            }
            var ele_par = $(this).parents(".time_pick");
            $.each($(".timepicker_wrap"),function(i,v){
                $(v).hide();
            });

            if(ele_par.find(".timepicker_wrap").length < 1){
                ele_par.append("<div class='timepicker_wrap'>"+
                    "<div class='arrow_top'></div>"+
                    "<div class='time'><div class='time-prev'></div>"+
                    "<div class='ti_tx'></div><div class='time-next'></div></div>"+
                    "<div class='mins'><div class='time-prev'></div><div class='mi_tx'></div>"+
                    "<div class='time-next'></div></div><div class='date-empty'>清空</div>"+
                    "<div class='close-btn'>关闭</div></div>");
            }

            ele_par.find(".timepicker_wrap").show();
            var ele_next = $(this).next(".timepicker_wrap");
            var ele_next_all_child = ele_next.find("div");
            var ele_close_btn = ele_next.find("div");
            ele_next.css({
                "top": ele_hei + "px",
                // "left": ele_lef + "px"
            });
            var cur_time = new Date().getHours();
            var cur_mins = '00';
            set_date();
            $(".datetip.fm-datepick-tip").off("click").on("click",function(event) {
                if (!$(event.target).is(ele_next)) {
                    if (!$(event.target).is(ele)) {
                        var tim = ele_next.find(".ti_tx").html();
                        var mini = ele_next.find(".mi_tx").text();
                        if (!$(event.target).is(ele_next) && !$(event.target).is(ele_next_all_child)) {
                            if(tim){
                                // ele.val(tim + ':' + mini);
                                if(!$(event.target).is($(document).find('button[name=fmSaveDateIdTemporary]'))
                                    && !$(event.target).is($(document).find('label[name=weekGroupBtn]'))
                                    && !$(event.target).is($(document).find('input[name=timeType]')) ){ //取消点击保存重新赋值的bug,以及week重新赋值的bug,以及类型切换的bug
                                    if(!_emptyFlag){
                                        scope.$apply(function(){
                                            scope[model] = tim + ':' + mini;
                                            _emptyFlag = false;
                                        });
                                    }
                                }

                            }
                            ele_next.fadeOut();
                        }
                    } else {
                        if(!scope[model]){
                            set_date();
                        }else{
                            var str = scope[model];
                            var h_time = str.split(':')[0];
                            var m_time = str.split(':')[1];
                            if(h_time != cur_time && m_time != cur_mins){
                                cur_time = h_time;
                                cur_mins = m_time;
                            }
                            ele_next.find(".ti_tx").text(h_time);
                            ele_next.find(".mi_tx").text(m_time);
                            scope.$apply();
                        }
                        ele_next.fadeIn();
                    }
                }
            });
            function set_date() {
                var d = new Date();
                var ti = d.getHours();
                var mi = '0';
                if (24 < ti) {
                    ti -= 24;
                }
                if (ti < 10) {
                    ele_next.find(".ti_tx").text("0" + ti);
                } else {
                    ele_next.find(".ti_tx").text(ti);
                }
                if (mi < 10) {
                    ele_next.find(".mi_tx").text("0" + mi);
                } else {
                    ele_next.find(".mi_tx").text(mi);
                }
            }
            var cur_next = ele_next.find(".time-next");
            var cur_prev = ele_next.find(".time-prev");
            /*改变时间*/
            $(cur_prev).add(cur_next).off("click").on("click",
            function() {
                var cur_ele = $(this);
                var cur_cli = null;
                var ele_st = 0;
                var ele_en = 0;
                if (cur_ele.parent().attr("class") == "time") {
                    cur_cli = "time";
                    ele_en = 23;
                    cur_time = ele_next.find("." + cur_cli + " .ti_tx").text();
                    cur_time = parseInt(cur_time);
                    cur_mins = ele_next.find(".mins .mi_tx").text();
                    //cur_mins = parseInt(cur_mins);
                    if (cur_ele.attr("class") == "time-next") {
                        if (cur_time == 23) {
                            ele_next.find("." + cur_cli + " .ti_tx").text("00");
                            cur_time = '00';
                        } else {
                            cur_time++;
                            if (cur_time < 10) {
                                ele_next.find("." + cur_cli + " .ti_tx").text("0" + cur_time);
                                cur_time = '0' + cur_time;
                            } else {
                                ele_next.find("." + cur_cli + " .ti_tx").text(cur_time);
                            }
                        }
                    } else {
                        if (cur_time == 0) {
                            ele_next.find("." + cur_cli + " .ti_tx").text(23)
                            cur_time = 23;
                        } else {
                            cur_time--;
                            if (cur_time < 10) {
                                ele_next.find("." + cur_cli + " .ti_tx").text("0" + cur_time);
                                cur_time = '0' + cur_time;
                            } else {
                                ele_next.find("." + cur_cli + " .ti_tx").text(cur_time);
                            }
                        }
                    }
                    scope[model] = cur_time + ':' + cur_mins;
                } else if (cur_ele.parent().attr("class") == "mins") {
                    cur_cli = "mins";
                    ele_en = 30;
                    cur_time = ele_next.find(".time .ti_tx").text();
                    //cur_time = parseInt(cur_time);
                    cur_mins = ele_next.find("." + cur_cli + " .mi_tx").text();
                    cur_mins = parseInt(cur_mins);
                    if (cur_ele.attr("class") == "time-next") {
                        if (cur_mins == 30) {
                            ele_next.find("." + cur_cli + " .mi_tx").text("00");
                            cur_mins = '00';
                        } else {
                            cur_mins += 30;
                            if (cur_mins < 10) {
                                ele_next.find("." + cur_cli + " .mi_tx").text("0" + cur_mins);
                                cur_mins = '0' + cur_mins;
                            } else {
                                ele_next.find("." + cur_cli + " .mi_tx").text(cur_mins);
                            }
                        }
                    } else {
                        if (cur_mins == 0) {
                            ele_next.find("." + cur_cli + " .mi_tx").text(30);
                            cur_mins = 30;
                        } else {
                            cur_mins -=30;
                            if (cur_mins < 10) {
                                ele_next.find("." + cur_cli + " .mi_tx").text("0" + cur_mins);
                                cur_mins = '0' + cur_mins;
                            } else {
                                ele_next.find("." + cur_cli + " .mi_tx").text(cur_mins);
                            }
                        }
                    }
                    scope[model] = cur_time + ':' + cur_mins;
                }
                scope.$apply();
            });
            /*点击当前时间*/
            var _nowDate = ele_next.find(".close-btn");
            /*改变时间*/
            _nowDate.on("click",function(){
                ele_next.fadeOut();
            });
            /*点击清空*/
            var _emptyDate = ele_next.find(".date-empty");
            var _emptyFlag = false;
            /*清空*/
            _emptyDate.on("click",function(){
                cur_time = new Date().getHours();
                cur_mins = '00';
                scope[model] = '';
                scope.$apply();
                _emptyFlag = true;
                ele_next.fadeOut();
            });
        });
    };
} (jQuery));