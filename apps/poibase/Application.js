"use strict"
// web app全局命名空间
var App = {};
// web app全局配置信息
App.Config = {
    serviceUrl: "http://192.168.4.189/fos",
    accessToken: "0000029900O7PKU4799128A9A06BD9B85262945271208735",
    hbaseServiceUrl: "http://fastmap.navinfo.com/fos/datum",
    resourceUrl: "http://192.168.4.189/resources",
    appType: "WEB"
};
// web app的公用函数命名空间
App.Util = {
    getFullUrl: function(url) {
        return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
    },
    getHbaseUrl: function(url) {
        return App.Config.hbaseServiceUrl + "/" + url;
    },
};