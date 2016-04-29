FM.Util = FM.Util || {};
FM.Util.extend(FM.Util, {
    trim: function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function(str, sep) {
        return FM.Util.trim(str).split(sep || /\s+/);
    },
    isArray: Array.isArray || function(obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    },
    clone: function(obj) {
        var ret = {};
        for (var key in obj) {
            if (obj[key] && typeof obj[key] == 'object') {
                if (this.isArray(obj[key])) {
                    ret[key] = new Array();
                    for (var i = 0, n = obj[key].length; i < n; i++) {
                        ret[key].push(this.clone(obj[key][i]));
                    }
                } else {
                    ret[key] = this.clone(obj[key]);
                }
            } else {
                ret[key] = obj[key];
            }
        }
        return ret;
    },
});