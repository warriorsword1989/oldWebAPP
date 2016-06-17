"use strict"
// web app全局命名空间
var App = {};
// web app全局配置信息
App.Config = {
    serviceUrl: "http://192.168.4.189/fos",
    accessToken: "0000029900O8WCYLA32EB2CB6E3E547669893A0A1D7C30D1",
    hbaseServiceUrl: "http://fastmap.navinfo.com/fos/datum",
    resourceUrl: "http://192.168.4.189/resources",
    appType: "WEB"
};
// web app的公用函数命名空间
App.Util = {
    trim: function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function(str, sep) {
        return App.Util.trim(str).split(sep || /\s+/);
    },
    getFullUrl: function(url) {
        return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
    },
    getHbaseUrl: function(url) {
        return App.Config.hbaseServiceUrl + "/" + url;
    },
    ToDBC: function(str) {
        var tmp;
        if (str) {
            tmp = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) == 32) {
                    tmp += String.fromCharCode(12288);
                } else if (str.charCodeAt(i) < 127) {
                    tmp += String.fromCharCode(str.charCodeAt(i) + 65248);
                } else {
                    tmp += str[i];
                }
            }
        } else {
            tmp = str;
        }
        return tmp;
    },
};