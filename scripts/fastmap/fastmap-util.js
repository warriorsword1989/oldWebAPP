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
        var ret = obj;
        if (obj[key] && typeof obj[key] == 'object') {
            ret = {};
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] && typeof obj[key] == 'object') {
                        if (this.isArray(obj[key])) {
                            ret[key] = [];
                            for (var i = 0, n = obj[key].length; i < n; i++) {
                                if (obj[key][i] && typeof obj[key][i] == "object") {
                                    ret[key].push(this.clone(obj[key][i]));
                                } else {
                                    ret[key].push(obj[key][i]);
                                }
                            }
                        } else {
                            ret[key] = this.clone(obj[key]);
                        }
                    } else {
                        ret[key] = obj[key];
                    }
                }
            }
        }
        return ret;
    },
    stringToJson: function(str) {
        var ret = str;
        try {
            ret = JSON.parse(str);
        } catch (e) {
            try {
                ret = JSON.parse(str.replace(/\\"/g, '"'));
            } catch (e) {
                try {
                    ret = JSON.parse(str.replace(/'/g, '"'));
                } catch (e) {
                    ret = str;
                }
            }
        }
        return ret;
    },
    dateFormat: function(str) {
        var ret;
        if (str.length < 14) {
            ret = str;
        } else { // yyyy-mm-dd hh:mi:ss
            ret = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":" + str.substr(10, 2) + ":" + str.substr(12, 2);
        }
        return ret;
    }
});