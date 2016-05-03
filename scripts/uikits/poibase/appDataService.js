App.dataService = (function() {
    var singleton;

    function init($q) {
        var ds = {};
        ds.getPoiDetailByFid = function(fid) {
            var deferred = $q.defer();
            var param = {
                "projectId": 2016013086,
                "condition": {
                    "fid": fid
                },
                "type": "integrate",
                "phase": "4",
                "featcode": "poi",
                "pagesize": 0
            };
            FM.dataApi.ajax.get("editsupport/poi/query", param, function(data) {
                if (data.errcode == 0) {
                    var poi = new FM.dataApi.ixPoi(data.data.data[0]);
                    deferred.resolve(poi);
                } else {
                    deferred.reject(data.errmsg);
                }
            });
            return deferred.promise;
        };
        ds.meta = {};
        ds.meta.getKindList = function(callback) {
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
        };
        return ds;
    }
    return function($q) {
        return !singleton ? singleton = init($q) : singleton;
    }
}());