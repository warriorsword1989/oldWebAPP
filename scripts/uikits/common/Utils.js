Utils = {
    trim: function(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function(str, sep) {
        return this.trim(str).split(sep || /\s+/);
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
}