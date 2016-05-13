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
        postUrl: function(url, param) {
            var remoteUrl = !App ? "" : (!App.Config ? (App.serviceUrl || "") : (App.Config.serviceUrl || ""));

            var fullUrl = remoteUrl + "/" + url;
            // if (token) {
            //     param.access_token = token;
            //     // fullUrl += "access_token=" + token;
            // }
            // if (param) {
            //     fullUrl += (token ? "&" : "") + "parameter=" + encodeURIComponent(JSON.stringify(param));
            // }
            return fullUrl;
        },
        get: function(url, param, callback) {
            return _ajaxConstruct(this.getUrl(url, param), "GET", callback, null);
        },
        post: function(url, param, callback) {
            var token = !App ? "" : (!App.Config ? (App.accessToken || "") : (App.Config.accessToken || ""));
            return _ajaxConstruct(this.postUrl(url, param), "POST",callback, {
                parameter: JSON.stringify(param),
                access_token:token
            });
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
        }
    };
}());