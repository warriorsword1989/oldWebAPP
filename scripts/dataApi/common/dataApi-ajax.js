(function() {
    var _ajaxConstruct = function(url, reqType, callback) {
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
            x.send()
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
            return _ajaxConstruct(this.getUrl(url, param), "GET", callback);
        },
        post: function(url, param, callback) {
            return _ajaxConstruct(this.getUrl(url, param), "POST", callback);
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