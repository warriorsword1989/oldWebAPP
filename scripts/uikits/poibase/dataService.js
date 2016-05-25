angular.module("dataService", [], function ($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function (obj) {
        var query = '',
            name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function (data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
    // Add interceptors
    $httpProvider.interceptors.push(function ($q) {
        return {
            // optional method
            'request': function (config) {
                // do something with config
                // if (config.url.indexOf("fos:") == 0) {
                //     // config.rqtype = "fos";
                //     config.url = App.Util.getFullUrl(config.url.substr(4));
                // }
                return config;
            },
            // optional method
            'requestError': function (rejection) {
                // do something on error
                // if (canRecover(rejection)) {
                //     return responseOrNewPromise
                // }
                return $q.reject(rejection);
            },
            // optional method
            'response': function (response) {
                // do something with response
                return response;
            },
            // optional method
            'responseError': function (rejection) {
                // do something on error
                // if (canRecover(rejection)) {
                //     return responseOrNewPromise
                // }
                alert("啊呕，服务请求报错，请检查网络后重试！");
                return $q.reject(rejection);
            }
        };
    });
}).service("ajax", ["$http", function($http) {
    this.get = function(url, param) {
        return $http.get(App.Util.getFullUrl(url), {
            params: param
        });
    };
    this.hbaseGet = function(url, param) {
        return $http.get(App.Util.getHbaseUrl(url), {
            params: param
        });
    };
    this.post = function(url, param) {
        return $http.post(App.Util.getFullUrl(url), param);
    };
}]);