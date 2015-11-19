/**
 * Created by wangtun on 2015/9/10.
 * 属性编辑
 * @namespace  fastmap.uiKit
 * @class ObjectEditController
 *
 */
fastmap.uikit.ObjectEditController = (function () {
    var instantiated;

    function init(options) {
        var objectEditController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,
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
            initialize: function (options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.data = {};
                this.originalData = null;
                this.on("FeatureSelected", this.setCurrentObject, this);
                this.on("switchedData", this.setCurrentObject, this);
            },
            /**
             * 保存需要编辑的元素的原数据
             *@method save
             */
            save: function () {
                this.onSaved(this.originalData, this.data);
            },
            /**
             * 获得编辑的字段及其内容
             * @method getChanged
             */
            getChanged: function () {

            },
            /**
             * 保存当前元素
             * @method setCurrentObject
             * @param {Object}obj
             */
            setCurrentObject: function (obj) {
                this.data = obj;

            },
            /**
             *
             * @param obj
             */
            setOriginalData: function (obj) {
                this.originalData = obj;
            },
            /**
             * 删除地图上元素
             * @method onRemove
             */
            onRemove: function () {

            },
            /**
             * 获取变化的属性值
             * @param oriData
             * @param data
             * @param type
             * @returns {*}
             */
            compareJson: function (oriData, data, type) {
                var retObj = {},n= 0,arrFlag=this.isContainArr(oriData);
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
                    } else if (oriData[item]&&oriData[item].constructor == Array&&data[item].constructor==Array) {
                        if (oriData[item].length === data[item].length) {
                            var objArr = [];
                            for (var i = 0, len = oriData[item].length; i < len; i++) {
                                var obj = this.compareJson(oriData[item][i], data[item][i], "UPDATE");
                                if (obj) {
                                    objArr.push(obj);
                                }
                            }
                            if (objArr.length !== 0) {
                                retObj[item] = objArr;
                            }
                        }else if(oriData[item].length < data[item].length) {

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
                    }else {
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
                    if(arrFlag) {
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
            isContainArr: function (obj) {
                var flag = false;
                for (var item in obj) {
                    if(obj[item]&&obj[item].constructor == Array) {
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
            isEmptyObject: function (obj) {
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
            onSaved: function (orignalData, data) {
                this.changedProperty = this.compareJson(orignalData, data, "UPDATE");
                this.fire("changedPropertyEvent", {changedProperty: this.changedProperty});
            }
        });
        return new objectEditController(options);
    }

    return function (options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();
