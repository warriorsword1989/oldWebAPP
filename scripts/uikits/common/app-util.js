App.Util = App.Util || {};
App.Util.trim = function(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
};
App.Util.split = function(str, sep) {
    return App.Util.trim(str).split(sep || /\s+/);
};
App.Util.getFullUrl = function(url) {
    return App.Config.serviceUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
};
App.Util.getHbaseUrl = function(url) {
    return App.Config.hbaseServiceUrl + "/" + url + "?access_token=" + (App.Config.accessToken || "");
};
App.Util.ToDBC = function(str) {
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
};