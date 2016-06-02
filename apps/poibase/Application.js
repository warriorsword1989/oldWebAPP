"use strict"
// web app全局命名空间
var App = {};
// web app全局配置信息
App.Config = {
    appType: "WEB",
    serviceUrl: "http://192.168.4.189/fos",
    accessToken: "0000029900O868FVC53B49FA811C55661314ECA3C225AA39",
    hbaseServiceUrl: "http://fastmap.navinfo.com/fos/datum",
    resourceUrl: "http://192.168.4.189/resources",
    generalUrl: 'http://192.168.4.188/service',
    tipsServer: "/fcc/tip",
    editServer: "/edit",
    metaServer: "/metadata"
};
App.Temp = {
    projectId: 11,
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
        return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
    },
    getHbaseUrl: function(url) {
        return App.Config.hbaseServiceUrl + "/" + url;
    },
    getGeneralUrl:function(url) {
        return App.Config.generalUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
    },
    createTileRequestObject: function(url, requestType) {
        var reqObj = {};
        reqObj.url = App.Config.generalUrl + url;
        reqObj.parameter = {
            projectId: App.Temp.projectId,
            gap: 80
        }
        if (requestType) {
            if (requestType == "RDLINK") {
                reqObj.hbaseUrl = App.Config.generalUrl + '/render/obj/getByTileWithGap?';
            }
            reqObj.parameter['types'] = requestType.split(',');
        }
        return reqObj;
    },
    createTileRequestObjectForPoi: function(url, requestType) {
        return {
            url: App.Config.serviceUrl + "/" + url,
            parameter: {
                x: 3370,
                y: 1552,
                z: 12,
                condition: {}
            }
        };
    },
};