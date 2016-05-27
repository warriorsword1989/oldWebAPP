"use strict"
// web app全局命名空间
var App = {};
// web app全局配置信息
App.Config = {
    appType: "WEB",
    serviceUrl: "http://192.168.4.189/fos",
    accessToken: "0000029900O7PKU4799128A9A06BD9B85262945271208735",
    hbaseServiceUrl: "http://fastmap.navinfo.com/fos/datum",
    resourceUrl: "http://192.168.4.189/resources",
    roadUrl: 'http://192.168.4.188/service',
    roadTipsServer: "/fcc/tip",
    roadEditServer: "/edit",
    roadMetaServer: "/metadata",
    roadProjectid: 11,
    meshIdArr: [60560301, 60560302, 60560303, 60560311, 60560312, 60560313, 60560322, 60560323, 60560331, 60560332, 60560333, 60560320, 60560330, 60560300, 60560321, 60560310],
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
        return location.pathname.substr(0, location.pathname.indexOf("/", 2));
    },
    getFullUrl: function(url) {
        return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
    },
    getHbaseUrl: function(url) {
        return App.Config.hbaseServiceUrl + "/" + url;
    },
};