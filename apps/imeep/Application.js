"use strict"
// web app全局命名空间
var App = {};
// web app全局配置信息
App.Config = {
    appType: "WEB",
    serviceUrl: "http://192.168.4.189/fos",
    hbaseServiceUrl: "http://fastmap.navinfo.com/fos/datum",
    resourceUrl: "http://192.168.4.189/resources",
    generalUrl: 'http://192.168.4.188:8000/service'
};
App.Temp = {
    accessToken: "0000029900O8W64A6BABD577C832761FEDC8208F4B9D6DD3",
    dbId: 42,
    meshList: [60560301, 60560302, 60560303, 60560311, 60560312, 60560313, 60560322, 60560323, 60560331, 60560332, 60560333, 60560320, 60560330, 60560300, 60560321, 60560310],
    relationNameObj: {
        RDRESTRICTION: '交限',
        RDSPEEDLIMIT: '限速',
        RDBRANCH: '分歧',
        RDCROSS: '路口',
        RDLANECONNEXITY: '车信',
        RDLINKINTRTIC: '实时信息',
        RDGSC: '立交'
    }
};
// web app的公用函数命名空间
App.Util = {
    getAppPath: function() {
        return location.pathname.substr(0, location.pathname.indexOf("/apps"));
    },
    getFullUrl: function(url) {
        return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Temp.accessToken || "");
    },
    getHbaseUrl: function(url) {
        return App.Config.hbaseServiceUrl + "/" + url;
    },
    getGeneralUrl: function(url) {
        return App.Config.generalUrl + "/" + url + "?access_token=" + (App.Temp.accessToken || "");
    },
    createTileRequestObject: function(url, requestType) {
        var reqObj = {};
        reqObj.url = App.Config.generalUrl + url;
        reqObj.parameter = {
            dbId: App.Temp.dbId,
            gap: 80
        }
        if (requestType) {
            reqObj.parameter['types'] = requestType.split(',');
            if (requestType == "RDLINK") {//小于17级的时候用hbase渲染道路
                reqObj.hbaseUrl = reqObj.url;
            }
        }
        return reqObj;
    },
    createTipsTileRequestObject: function(url, requestType) {
        var urlObj = {};
        if (requestType != "") {
            urlObj.url = App.Config.generalUrl + url;
            urlObj.parameter = {
                dbId: App.Temp.dbId,
                gap: 80,
                types: requestType
            }
        }else{
            urlObj.url = App.Config.generalUrl + url;
            urlObj.parameter = {
                dbId: App.Temp.dbId,
                gap: 80
            }
        }
        return urlObj;
    },

};