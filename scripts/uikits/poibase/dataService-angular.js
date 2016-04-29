angular.module("dataService", []).service("poi", ["$http", "$q", function($http, $q) {
    this.getPoiDetailByFid = function(fid) {
        var params = {
            "projectId": 2016013086,
            "condition": {
                "fid": fid
            },
            "type": "integrate",
            "phase": "4",
            "featcode": "poi",
            "pagesize": 0
        };
        // return $http.get(App.Util.createGetUrl("editsupport/poi/query", params)).success(function(data) {
        //     if (data.errcode == 0) {
        //         var poi = new FM.dataApi.ixPoi(data.data.data[0]);
        //     }
        // });
        return $http({
            method: 'GET',
            url: App.Util.getFullUrl("editsupport/poi/query"),
            params: {
                "parameter": JSON.stringify({
                    "projectId": 2016013086,
                    "condition": {
                        "fid": fid
                    },
                    "type": "integrate",
                    "phase": "4",
                    "featcode": "poi",
                    "pagesize": 0
                })
            }
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data.data[0]);
            }
        });
    };
    this.getPoiList = function() {
        var defer = $q.defer();
        var params = {
            "projectId": 2016013086,
            "condition": {},
            "type": "integrate",
            "phase": "4",
            "featcode": "poi",
            "pagesize": 10,
            "pageno": 1
        };
        FM.dataApi.IxPoi.getList(params, function(data) {
            defer.resolve(data);
        });
        return defer.promise;
    };
}]).service("meta", ["$http", "$q", function($http, $q) {
    this.getKindList = function() {
        var deferred = $q.defer();
        var param = {};
        FM.dataApi.ajax.get("meta/queryKind/", param, function(data) {
            var ret = [];
            if (data.errcode == 0) {
                for (var i = 0; i < data.data.length; i++) {
                    ret.push(data.data[i]);
                }
                deferred.resolve(ret);
            } else {
                deferred.reject(data.errmsg);
            }
        });
        return deferred.promise;
    }
}]);