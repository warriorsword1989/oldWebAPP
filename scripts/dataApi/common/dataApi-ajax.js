(function() {
    var _ajaxConstruct = function(url, reqType,callback,data) {
        if (document.getElementById) {
            var x = (window.XDomainRequest) ? new XDomainRequest() : new XMLHttpRequest();
            if (window.XDomainRequest) {
                x.xdomain = 1
            }
        }
        if (x) {
            x.onreadystatechange = function() {
                var el = el || {};
                if (x.xdomain || x.readyState == 4) {
                    var d = 0;
                    var el;
                    if (x.xdomain || x.status == 200) {
                        if (x.responseText && x.responseText[0] != "<" && x.responseText != "[0]") {
                            if (window.JSON) {
                                d = window.JSON.parse(x.responseText)
                            } else {
                                d = eval("(" + x.responseText + ")")
                            }
                            callback(d);
                        }
                    }
                }
            };
            if (x.xdomain) {
                x.onerror = function() {
                    console.error('ajax error!');
                };
                x.ontimeout = function() {
                    console.error('ajax timeout!');
                };
                x.onprogress = function() {
                    console.log('ajax progress!');
                };
                x.onload = x.onreadystatechange
            }
            x.open(reqType, url);
            x._url = url;
            if(reqType =="GET"){
                x.send()
            }else {
                x.send("parameter="+data.parameter +"&access_token="+data.access_token)
            }
        }
        return x;
    };
    FM.dataApi = FM.dataApi || {};
    FM.dataApi.ajax = {
        getUrl: function(url, param) {
            var remoteUrl = !App ? "" : (!App.Config ? (App.serviceUrl || "") : (App.Config.serviceUrl || ""));
            var token = !App ? "" : (!App.Config ? (App.accessToken || "") : (App.Config.accessToken || ""));
            var fullUrl = remoteUrl + "/" + url + "?";
            if (token) {
                fullUrl += "access_token=" + token;
            }
            if (param) {
                fullUrl += (token ? "&" : "") + "parameter=" + encodeURIComponent(JSON.stringify(param));
            }
            return fullUrl;
        },
        get: function(url, param, callback) {
            return _ajaxConstruct(this.getUrl(url, param), "GET", callback, null);
        },
        // remoteUrl: function(){
        //     return !App ? "" : (!App.Config ? (App.serviceUrl || "") : (App.Config.serviceUrl || ""));
        // },
        // token: function(){
        //     return !App ? "" : (!App.Config ? (App.accessToken || "") : (App.Config.accessToken || ""));
        // },
        // fullUrl: function(url){
        //     return this.remoteUrl + "/" + url
        // } ,
        post:function($http,url,param,suc,err){
            $http({
                method: 'POST',
                url: App.Config.serviceUrl + url,
                data: param,
                transformRequest:function(obj){
                    var str = [];
                    for(var p in obj){
                        str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // 跨域设置
                }
            }).success(suc).error((err) ? err : this.httpError);
        },
        httpError: function (data, status, headers, config) {
            alert("啊哦，出错啦，请检查网络后重试！");
            return;
        },
        httpPost: function($http,url, param, suc, err) {
            var remoteUrl = !App ? "" : (!App.Config ? (App.serviceUrl || "") : (App.Config.serviceUrl || ""));
            var token = !App ? "" : (!App.Config ? (App.accessToken || "") : (App.Config.accessToken || ""));
            var fullUrl = remoteUrl + "/" + url + "?";
            if (param) {
                if (typeof param == "object") {
                    param["access_token"] = token;
                }
            }
            $http({
                method: 'POST',
                url: fullUrl,
                data: param,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' // 跨域设置
                }
            }).success(suc).error((err) ? err : this.httpError);
        }
    };
    FM.dataApi.getFromHbase = {
        getUrl: function(url, param) {
            var remoteUrl = !App ? "" : (!App.Config ? (App.hbaseServiceUrl || "") : (App.Config.hbaseServiceUrl || ""));
            var token = !App ? "" : (!App.Config ? (App.accessToken || "") : (App.Config.accessToken || ""));
            var fullUrl = remoteUrl + "/" + url + "?";
            if (token) {
                fullUrl += "access_token=" + token;
            }
            if (param) {
                fullUrl += (token ? "&" : "") + "parameter=" + param;
            }
            return fullUrl;
        },
        get: function(url, param, callback) {
            return _ajaxConstruct(this.getUrl(url, param), "GET", callback);
        },
    }

}());