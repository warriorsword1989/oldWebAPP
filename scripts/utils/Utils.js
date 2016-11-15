Utils = {
    trim: function (str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
    split: function (str, sep) {
        return this.trim(str).split(sep || /\s+/);
    },
    ToDBC: function (txtstring) {
        if (txtstring == null || txtstring == '' || txtstring == ' ') {
            return '';
        }
        var tmp = '';
        for (var i = 0; i < txtstring.length; i++) {
            if (txtstring.charCodeAt(i) == 32) {
                tmp = tmp + String.fromCharCode(12288);
            } else if (txtstring.charAt(i) != '|' && txtstring.charCodeAt(i) < 127) {
                tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248);
            } else {
                tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i));
            }
        }
        return tmp;
    },
    dateFormat: function (str) {
        var ret;
        if (str.length < 14) {
            ret = str;
        } else { // yyyy-mm-dd hh:mi:ss
            ret = str.substr(0, 4) + '-' + str.substr(4, 2) + '-' + str.substr(6, 2) + ' ' + str.substr(8, 2) + ':' + str.substr(10, 2) + ':' + str.substr(12, 2);
        }
        return ret;
    },
    setCheckboxMutex: function (event, obj, rejectVal) {
        if (event.target.value == rejectVal) {
            if (event.target.checked) {
                for (var key in obj) {
                    if (key != rejectVal) {
                        obj[key] = false;
                    }
                }
            }
        } else if (event.target.checked) {
            obj[rejectVal] = false;
        }
    },
    setCheckBoxSingleCheck: function (event, obj) {
        if (event.target.checked) {
            for (var key in obj) {
                if (key != event.target.value) {
                    obj[key] = false;
                }
            }
        }
    },
    stringToJson: function (str) {
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
    /**
     * 数组去重
     * @param arr
     * @returns {Array}
     */
    distinctArr: function (arr) {
        var dObj = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            dObj[arr[i]] = true;
        }
        return Object.keys(dObj);
    },
    /**
     * 校验是否是纯数字，如果是纯数字就返回true
     */
    verifyNumber: function (str) {
        return /^[0-9]*$/.test(str);
    },
    /**
     * 校验是否是电话，如果是电话就返回true
     */
    verifyTelphone: function (str) {
        return /^[1][3-8]+\d{9}$/.test(str);
    },
    clone: function (obj) {
        var ret = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (obj[key] && typeof obj[key] === 'object') {
                    if (this.isArray(obj[key])) {
                        ret[key] = [];
                        for (var i = 0, n = obj[key].length; i < n; i++) {
                            if (obj[key][i] && typeof obj[key][i] === 'object') {
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
        // }
        return ret;
    },
    /** *
     * 获取数组中某属性的最大值
     */
    getArrMax: function (arr, name) {
    	var max = arr[0][name];
    	var len = arr.length;
    	for (var i = 1; i < len; i++) {
	    	if (arr[i][name] > max) {
	    	  max = arr[i][name];
	    	}
    	}
    	return max;
    },
    /**
     * 判断点1和点2是否是同一个点
     * @param point1
     * @param point2
     * @param precision  精度
     */
    isSamePoint: function (point1, point2, precision) {
        if (!precision) {
            precision = 5;
        }
        if (Number(point1.x).toFixed(precision) != Number(point2.x).toFixed(precision)) {
            return false;
        }
        if (Number(point1.y).toFixed(precision) != Number(point2.y).toFixed(precision)) {
            return false;
        }
        return true;
    }
};
