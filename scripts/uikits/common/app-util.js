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