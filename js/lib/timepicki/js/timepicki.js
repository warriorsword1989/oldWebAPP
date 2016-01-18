(function($) {
    $.fn.timepicki = function(scope,model) {
        // var defaults = {};
        /*var settings = $.extend({},
        defaults, setting);*/
        return this.each(function() {
            var ele = $(this);
            var ele_hei = ele.outerHeight();
            // var ele_lef = ele.position().left;
            ele_hei += 15;
            $(ele).wrap("<div class='time_pick'>");
            var ele_par = $(this).parents(".time_pick");
            $.each($(".timepicker_wrap"),function(i,v){
                $(v).hide();
            })
            ele_par.append("<div class='timepicker_wrap'>"+
                "<div class='arrow_top'></div>"+
                "<div class='time'><div class='time-prev'></div>"+
                "<div class='ti_tx'></div><div class='time-next'></div></div>"+
                "<div class='mins'><div class='time-prev'></div><div class='mi_tx'></div>"+
                "<div class='time-next'></div></div><div class='date-now'>当前时间</div>"+
                "<div class='date-empty'>清空</div></div>");
            var ele_next = $(this).next(".timepicker_wrap");
            var ele_next_all_child = ele_next.find("div");
            ele_next.css({
                "top": ele_hei + "px",
                // "left": ele_lef + "px"
            });
            var cur_time = new Date().getHours();
            var cur_mins = new Date().getMinutes();
            $(document).on("click",
            function(event) {
                if (!$(event.target).is(ele_next)) {
                    if (!$(event.target).is(ele)) {
                        var tim = ele_next.find(".ti_tx").html();
                        var mini = ele_next.find(".mi_tx").text();
                        if (!$(event.target).is(ele_next) && !$(event.target).is(ele_next_all_child)) {
                            if(tim){
                                // ele.val(tim + ':' + mini);
                                if(!_emptyFlag){
                                    scope.$apply(function(){
                                        scope[model] = tim + ':' + mini;
                                        _emptyFlag = false;
                                    });
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
                            scope.$apply();
                        }
                        ele_next.fadeIn();
                    }
                }
            });
            function set_date() {
                var d = new Date();
                var ti = d.getHours();
                var mi = d.getMinutes();
                if (24 < ti) {
                    ti -= 24;
                }
                if (ti < 10) {
                    ele_next.find(".ti_tx").text("0" + ti);
                } else {
                    ele_next.find(".ti_tx").text(ti);
                }
                if (mi < 10) {
                    ele_next.find(".mi_tx").text("0" + mi)
                } else {
                    ele_next.find(".mi_tx").text(mi)
                }
            }
            var cur_next = ele_next.find(".time-next");
            var cur_prev = ele_next.find(".time-prev");
            /*改变时间*/
            $(cur_prev).add(cur_next).on("click",
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
                    if (cur_ele.attr("class") == "time-next") {
                        if (cur_time == 23) {
                            ele_next.find("." + cur_cli + " .ti_tx").text("00")
                            cur_time = '00';
                        } else {
                            cur_time++;
                            if (cur_time < 10) {
                                ele_next.find("." + cur_cli + " .ti_tx").text("0" + cur_time)
                                cur_time = '0' + cur_time;
                            } else {
                                ele_next.find("." + cur_cli + " .ti_tx").text(cur_time)
                            }
                        }
                    } else {
                        if (cur_time == 0) {
                            ele_next.find("." + cur_cli + " .ti_tx").text(23)
                            cur_time = 23;
                        } else {
                            cur_time--;
                            if (cur_time < 10) {
                                ele_next.find("." + cur_cli + " .ti_tx").text("0" + cur_time)
                                cur_time = '0' + cur_time;
                            } else {
                                ele_next.find("." + cur_cli + " .ti_tx").text(cur_time)
                            }
                        }
                    }
                    scope[model] = cur_time + ':' + cur_mins;
                } else if (cur_ele.parent().attr("class") == "mins") {
                    cur_cli = "mins";
                    ele_en = 59;
                    cur_mins = ele_next.find("." + cur_cli + " .mi_tx").text();
                    cur_mins = parseInt(cur_mins);
                    if (cur_ele.attr("class") == "time-next") {
                        if (cur_mins == 59) {
                            ele_next.find("." + cur_cli + " .mi_tx").text("00")
                            cur_mins = '00';
                        } else {
                            cur_mins++;
                            if (cur_mins < 10) {
                                ele_next.find("." + cur_cli + " .mi_tx").text("0" + cur_mins)
                                cur_mins = '0' + cur_mins;
                            } else {
                                ele_next.find("." + cur_cli + " .mi_tx").text(cur_mins)
                            }
                        }
                    } else {
                        if (cur_mins == 0) {
                            ele_next.find("." + cur_cli + " .mi_tx").text(59)
                            cur_mins = 59;
                        } else {
                            cur_mins--;
                            if (cur_mins < 10) {
                                ele_next.find("." + cur_cli + " .mi_tx").text("0" + cur_mins)
                                cur_mins = '0' + cur_mins;
                            } else {
                                ele_next.find("." + cur_cli + " .mi_tx").text(cur_mins)
                            }
                        }
                    }
                    scope[model] = cur_time + ':' + cur_mins;
                }
                scope.$apply();
            })
            /*点击当前时间*/
            var _nowDate = ele_next.find(".date-now");
            /*改变时间*/
            _nowDate.on("click",function(){
                cur_time = new Date().getHours();
                cur_mins = new Date().getMinutes();
                if(cur_time < 10)
                    cur_time = '0' + cur_time;
                if(cur_mins < 10)
                    cur_mins = '0' + cur_mins;
                scope[model] = cur_time + ':' + cur_mins;
                set_date();
                scope.$apply();
                ele_next.fadeOut();
            });
            /*点击清空*/
            var _emptyDate = ele_next.find(".date-empty");
            var _emptyFlag = false;
            /*清空*/
            _emptyDate.on("click",function(){
                cur_time = new Date().getHours();
                cur_mins = new Date().getMinutes();
                scope[model] = '';
                scope.$apply();
                _emptyFlag = true;
                ele_next.fadeOut();
            });
        })
    }
} (jQuery));