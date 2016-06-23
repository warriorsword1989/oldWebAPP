/**
 * Created by wangtun on 2015/9/10.
 * 属性编辑
 * @namespace  fastmap.uiKit
 * @class ObjectEditController
 *
 */
fastmap.uikit.ObjectEditController = (function() {
    var instantiated;

    function init(options) {
        var objectEditController = L.Class.extend({
            /**
             * 相关属性
             */
            options: {},
            /**
             *构造函数
             * @class ObjectEditController
             * @constructor
             * @namespace  fastmap.uiKit
             * @param {Object}options
             */
            initialize: function(options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.eventController = fastmap.uikit.EventController();
                this.data = {};
                this.originalData = null;
                this.updateObject = "";
                this.nodeObjRefresh = "";
                this.selectNodeRefresh = "";
            },
            /**
             * 保存需要编辑的元素的原数据
             *@method save
             */
            save: function() {
                this.onSaved(this.originalData, this.data);
            },
            /**
             * 获得编辑的字段及其内容
             * @method getChanged
             */
            getChanged: function() {},
            /**
             * 保存当前元素
             * @method setCurrentObject
             * @param {Object}obj
             * @param type
             * @param options
             */
            setCurrentObject: function(type, obj, options) {
                this.data = null;
                switch (type) {
                    case "RDNODE":
                        this.data = fastmap.dataApi.rdNode(obj);
                        if (options) {
                            this.data.linepids = options.linepids;
                            this.data.nodeid = options.nodeid;
                        }
                        break;
                    case "RDLINK":
                        this.data = fastmap.dataApi.rdLink(obj);
                        break;
                    case "RDRESTRICTION":
                        this.data = fastmap.dataApi.rdRestriction(obj);
                        break;
                    case "RDCROSS":
                        this.data = fastmap.dataApi.rdCross(obj);
                        break;
                    case "RDLANECONNEXITY":
                        this.data = fastmap.dataApi.rdLaneConnexity(obj);
                        break;
                    case "RDSPEEDLIMIT":
                        this.data = fastmap.dataApi.rdSpeedLimit(obj);
                        break;
                    case "RDBRANCH":
                        this.data = fastmap.dataApi.rdBranch(obj);
                        break;
                    case "ADLINK":
                        this.data = fastmap.dataApi.adLink(obj);
                        break;
                    case "ADFACE":
                        this.data = fastmap.dataApi.adFace(obj);
                        break;
                    case "RDGSC":
                        this.data = fastmap.dataApi.rdGsc(obj);
                        break;
                    case "ADADMIN":
                        this.data = fastmap.dataApi.adAdmin(obj);
                        break;
                    case "ADNODE":
                        this.data = fastmap.dataApi.adNode(obj);
                        break;
                    case "IXPOI":
                        this.data = new fastmap.dataApi.IxPoi(obj);
                        break;
                    case "RWLINK":
                        this.data = fastmap.dataApi.RwLink(obj);
                        break;
                    default:
                        throw "无法解析当前选择的类型!";
                        break;
                }
                if (!this.originalData || (this.originalData.geoLiveType != this.data.geoLiveType)) {
                    // this.eventController.off(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE);
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURETYPECHANGE, {
                        "originalData": this.originalData,
                        "currentData": this.data
                    });
                }
                if (!this.originalData || (this.originalData.pid != this.data.pid)) {
                    // this.eventController.off(this.eventController.eventTypes.SELECTEDFEATURECHANGE);
                    this.eventController.fire(this.eventController.eventTypes.SELECTEDFEATURECHANGE, {
                        "originalData": this.originalData,
                        "currentData": this.data
                    });
                }
            },
            /**
             *
             * @param obj
             */
            setOriginalData: function(obj) {
                this.originalData = obj;
            },
            /**
             * 删除地图上元素
             * @method onRemove
             */
            onRemove: function() {},
            /**
             * 获取变化的属性值
             * @param oriData
             * @param data
             * @param type
             * @returns {*}
             */
            compareJson: function(pid, oriData, data, type) {
                var retObj = {},
                    n = 0,
                    arrFlag = this.isContainArr(oriData),
                    pids = pid;
                for (var item in oriData) {
                    if (typeof oriData[item] === "string") {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData["rowId"]) {
                                retObj["rowId"] = oriData["rowId"];
                            } else if (oriData["pid"]) {
                                retObj["pid"] = oriData["pid"];
                            }
                            retObj["objStatus"] = type;
                        }
                    } else if (data[item] && oriData[item] && oriData[item].constructor == Array && data[item].constructor == Array) {
                        if (oriData[item].length === data[item].length) {
                            var objArr = [];
                            for (var i = 0, len = oriData[item].length; i < len; i++) {
                                var obj = this.compareJson(pids, oriData[item][i], data[item][i], "UPDATE");
                                if (obj) {
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                if (oriData["linkPid"]) {
                                    obj["linkPid"] = oriData["pid"];
                                }
                                retObj[item] = objArr;
                            }
                        } else if (oriData[item].length < data[item].length) {
                            var objArr = [];
                            //大于原长度的直接增加，从索引0开始，数组是从第一位开始追加的
                            for (var m = 0; m < data[item].length - oriData[item].length; m++) {
                                var obj = {};
                                if (oriData[item].length == 0) {
                                    for (var s in data[item][m]) {
                                        if (s != "$$hashKey") {
                                            if (s == "linkPid") {
                                                obj[s] = data["pid"];
                                            } else {
                                                obj[s] = data[item][m][s];
                                            }
                                        }
                                    }
                                    if (!obj["linkPid"]) {
                                        if (data["rowId"]) {
                                            obj["rowId"] = data["rowId"];
                                        } else if (data["pid"]) {
                                            obj["pid"] = data["pid"];
                                        }
                                    }
                                    delete obj["geoLiveType"];
                                    obj["objStatus"] = "INSERT";
                                    objArr.push(obj);
                                } else {
                                    //var obj = this.compareJson(oriData[item][m], data[item][m], "INSERT");
                                    obj = data[item][m];
                                    obj["objStatus"] = "INSERT";
                                    delete obj["$$hashKey"];
                                    //obj["pid"]=pids;
                                    if (obj) {
                                        if (oriData[item][0]["linkPid"]) {
                                            obj["linkPid"] = oriData[item][0]["linkPid"];
                                        }
                                        objArr.push(obj);
                                    }
                                    delete obj["geoLiveType"];
                                }
                            }
                            for (var j = oriData[item].length - 1; j >= 0; j--) {
                                var obj = this.compareJson(oriData[item][j], data[item][j + 1], "UPDATE");
                                if (obj) {
                                    if (oriData[item][j]["linkPid"]) {
                                        obj["linkPid"] = oriData[item][j]["linkPid"];
                                    }
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }
                        } else {
                            var objArr = [],
                                indexOfData = {},
                                key = "linkPid";
                            for (var j = 0, lenJ = data[item].length; j < lenJ; j++) {
                                var obj = {};
                                if (data[item][j]["rowId"]) {
                                    key = "rowId";
                                    obj = {
                                        flag: true,
                                        index: j
                                    };
                                    indexOfData[data[item][j]["rowId"]] = obj;
                                } else if (data["pid"]) {
                                    key = "pid";
                                    obj = {
                                        flag: true,
                                        index: j
                                    };
                                    indexOfData[data[item][j]["pid"]] = obj;
                                } else if (data[item][j]["linkPid"]) {
                                    obj = {
                                        flag: true,
                                        index: j
                                    };
                                    indexOfData[data[item][j]["linkPid"]] = obj;
                                }
                            }
                            for (var k = 0, lenK = oriData[item].length; k < lenK; k++) {
                                if (indexOfData[oriData[item][k][key]]) {
                                    var obj = this.compareJson(oriData[item][k], data[item][indexOfData[oriData[item][k][key]]["index"]], "UPDATE");
                                    objArr.push(obj);
                                } else {
                                    obj = oriData[item][k];
                                    obj["objStatus"] = "DELETE";
                                    delete obj["$$hashKey"];
                                    if (!obj["pid"]) {
                                        obj["pid"] = pids;
                                    }
                                    if (obj["vias"]) {
                                        obj["vias"] = undefined;
                                    }
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }
                        }
                    } else if (!isNaN(oriData[item])) {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData["rowId"]) {
                                retObj["rowId"] = oriData["rowId"];
                            } else if (oriData["pid"]) {
                                retObj["pid"] = oriData["pid"];
                            }
                            retObj["objStatus"] = type;
                        }
                    } else {
                        if (oriData[item] !== data[item]) {
                            retObj[item] = data[item];
                            if (oriData["rowId"]) {
                                retObj["rowId"] = oriData["rowId"];
                            } else if (oriData["pid"]) {
                                retObj["pid"] = oriData["pid"];
                            }
                            retObj["objStatus"] = type;
                        }
                    }
                }
                if (!this.isEmptyObject(retObj)) {
                    if (arrFlag) {
                        if (oriData["rowId"]) {
                            retObj["rowId"] = oriData["rowId"];
                        } else if (oriData["pid"]) {
                            retObj["pid"] = oriData["pid"];
                        }
                        arrFlag = false;
                    }
                    return retObj;
                } else {
                    return false;
                }
            },
            isContainArr: function(obj) {
                var flag = false;
                for (var item in obj) {
                    if (obj[item] && obj[item].constructor == Array) {
                        flag = true;
                    }
                }
                return flag;
            },
            /**
             * 判断对象是不是为空
             * @param obj
             * @returns {boolean}
             */
            isEmptyObject: function(obj) {
                for (var n in obj) {
                    return false
                }
                return true;
            },
            /**
             * 保存元素的方法
             * @method onSaved
             * @param {Object}orignalData
             * @param {Object}data
             */
            onSaved: function(orignalData, data) {
                this.changedProperty = this.compareJson(orignalData["pid"], orignalData, data.getIntegrate(), "UPDATE");
            }
        });
        return new objectEditController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();