angular.module("dataService").service("dsFcc", ["$http", "$q", "ajax", function($http, $q, ajax) {
    /********************************** begin 道路相关 *****************************************/
    
    
    
    /********************************** end 道路相关 *******************************************/
    this.getPoiDetailByFid = function(fid) {
        var defer = $q.defer();
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

        ajax.get("editsupport/poi/query", {
            parameter: JSON.stringify(params)
        }).success(function(data) {
            if (data.errcode == 0) {
                var poi = new FM.dataApi.IxPoi(data.data.data[0]);
                defer.resolve(poi);
            } else {
                defer.resolve("查询poi详情出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });

        return defer.promise;
    };

    /*锁定检查结果*/
    this.lockSingleData = function(fid) {
        var defer = $q.defer();
        var param = {
            fid: fid,
            projectId: 2016013086,
            featcode: "poi",
            access_token:App.Config.accessToken
        };
        ajax.post("editsupport/handler/locksingle", param).success(function(data) {
            if (data.errcode == 0) {
                defer.resolve(data.data);
            } else {
                defer.resolve("锁定POI出错：" + data.errmsg);
            }
        }).error(function(rejection) {
            defer.reject(rejection);
        });
        return defer.promise;
    };
}]);