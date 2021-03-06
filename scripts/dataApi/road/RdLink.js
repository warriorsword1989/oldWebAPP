/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */
fastmap.dataApi.RdLink = fastmap.dataApi.GeoDataModel.extend({
    /** *
     *
     * @param data geometry
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDLINK';
        this.setAttributeData(data);
    },
    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributeData: function (data) {
        this.pid = data.pid || null;
        this.geometry = data.geometry || null;
        this.sNodePid = data.sNodePid || null;
        this.eNodePid = data.eNodePid || null;
        this.kind = data.kind || 7;
        this.direct = data.direct || 1;
        this.appInfo = (data.appInfo === undefined || data.appInfo === '') ? 1 : data.appInfo;
        this.tollInfo = data.tollInfo || 2;
        this.routeAdopt = data.routeAdopt || 2;
        this.multiDigitized = data.multiDigitized || 0;
        this.developState = data.developState || 0;
        this.imiCode = data.imiCode || 0;
        this.specialTraffic = data.specialTraffic || 0;
        this.functionClass = data.functionClass || 5;
        this.urban = data.urban || 0;
        this.paveStatus = data.paveStatus || 0;
        if (data.laneNum != 'undefied') {
            this.laneNum = data.laneNum;
        } else {
            this.laneNum = 2;
        }
        this.laneLeft = data.laneLeft || 0;
        this.laneRight = data.laneRight || 0;
        this.laneWidthLeft = data.laneWidthLeft || 1;
        this.laneWidthRight = data.laneWidthRight || 1;
        this.laneClass = data.laneClass || 1;
        this.width = data.width || 0;
        this.isViaduct = data.isViaduct || 0;
        this.leftRegionId = data.leftRegionId || 0;
        this.rightRegionId = data.rightRegionId || 0;
        this.length = data.length || 0;
        this.meshId = data.meshId || 0;
        this.onewayMark = data.onewayMark || 0;
        this.streetLight = data.streetLight || 0;
        this.parkingLot = data.parkingLot || 0;
        this.adasFlag = data.adasFlag || 0;
        this.sidewalkFlag = data.sidewalkFlag || 0;
        this.walkstairtFlag = data.walkstairtFlag || 0;
        this.diciType = data.diciType || 0;
        this.walkFlag = data.walkFlag || 0;
        this.difGroupid = data.difGroupid || '';
        this.srcFlag = data.srcFlag || 6;
        this.digitalLevel = data.digitalLevel || 0;
        this.editFlag = data.editFlag || 1;
        this.truckFlag = data.truckFlag || 0;
        this.feeStd = data.feeStd || 0;
        this.feeFlag = data.feeFlag || 0;
        // this.systemId = data["systemId"] || 0;
        this.originLinkPid = data.originLinkPid || 0;
        this.centerDivider = data.centerDivider || 0;
        this.parkingFlag = data.parkingFlag || 0;
        this.memo = data.memo || '';
        this.reserved = data.reserved || '';
        this.forms = [];
        if (data.forms && data.forms.length > 0) {
            for (var i = 0, len = data.forms.length; i < len; i++) {
                var form = fastmap.dataApi.rdLinkForm(data.forms[i]);
                this.forms.push(form);
            }
        }
        this.names = [];
        if (data.names && data.names.length > 0) {
            for (var i = 0, len = data.names.length; i < len; i++) {
                var name = fastmap.dataApi.rdLinkName(data.names[i]);
                this.names.push(name);
            }
        }
        this.rtics = [];
        if (data.rtics && data.rtics.length > 0) {
            for (var i = 0, len = data.rtics.length; i < len; i++) {
                var rtic = fastmap.dataApi.rdLinkRtic(data.rtics[i]);
                this.rtics.push(rtic);
            }
        }
        this.intRtics = [];
        if (data.intRtics && data.intRtics.length > 0) {
            for (var i = 0, len = data.intRtics.length; i < len; i++) {
                var intRtics = fastmap.dataApi.rdLinkIntRtic(data.intRtics[i]);
                this.intRtics.push(intRtics);
            }
        }
        this.sidewalks = [];
        if (data.sidewalks && data.sidewalks.length > 0) {
            for (var i = 0, len = data.sidewalks.length; i < len; i++) {
                var sideWalk = fastmap.dataApi.rdLinkSideWalk(data.sidewalks[i]);
                this.sidewalks.push(sideWalk);
            }
        }
        this.speedlimits = [];
        if (data.speedlimits && data.speedlimits.length > 0) {
            for (var i = 0, len = data.speedlimits.length; i < len; i++) {
                var speeedLimit = fastmap.dataApi.rdLinkSpeedLimit(data.speedlimits[i]);
                this.speedlimits.push(speeedLimit);
            }
        }
        this.limits = [];
        if (data.limits && data.limits.length > 0) {
            for (var i = 0, len = data.limits.length; i < len; i++) {
                var limit = fastmap.dataApi.rdLinkLimit(data.limits[i]);
                this.limits.push(limit);
            }
        }
        this.limitTrucks = [];
        if (data.limitTrucks && data.limitTrucks.length > 0) {
            for (var i = 0, len = data.limitTrucks.length; i < len; i++) {
                var truckLimit = fastmap.dataApi.rdLinkTruckLimit(data.limitTrucks[i]);
                this.limitTrucks.push(truckLimit);
            }
        }
        this.walkstairs = [];
        if (data.walkstairs && data.walkstairs.length > 0) {
            for (var i = 0, len = data.walkstairs.length; i < len; i++) {
                var walkStair = fastmap.dataApi.rdLinkWalkStair(data.walkstairs[i]);
                this.walkstairs.push(walkStair);
            }
        }
        this.zones = [];
        if (data.zones && data.zones.length > 0) {
            for (var i = 0, len = data.zones.length; i < len; i++) {
                var zone = fastmap.dataApi.rdLinkZone(data.zones[i]);
                this.zones.push(zone);
            }
        }
        this.tmclocations = [];
        if (data.tmclocations && data.tmclocations.length > 0) {
            for (var i = 0, len = data.tmclocations.length; i < len; i++) {
                var location = fastmap.dataApi.rdTmcLocation(data.tmclocations[i]);
                this.tmclocations.push(location);
            }
        }
    },
    /**
     * 获取道路简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.geometry = this.geometry;
        data.kind = this.kind;
        data.direct = this.direct;
        data.appInfo = this.appInfo;
        data.tollInfo = this.tollInfo;
        data.routeAdopt = this.routeAdopt;
        data.multiDigitized = this.multiDigitized;
        data.developState = this.developState;
        data.imiCode = this.imiCode;
        data.geoLiveType = this.geoLiveType;
        return data;
    },
    /**
     * 获取道路详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.sNodePid = this.sNodePid;
        data.eNodePid = this.eNodePid;
        data.kind = this.kind;
        data.direct = this.direct;
        data.appInfo = this.appInfo;
        data.tollInfo = this.tollInfo;
        data.routeAdopt = this.routeAdopt;
        data.multiDigitized = this.multiDigitized;
        data.developState = this.developState;
        data.imiCode = this.imiCode;
        data.specialTraffic = this.specialTraffic;
        data.functionClass = this.functionClass;
        data.urban = this.urban;
        data.paveStatus = this.paveStatus;
        data.laneNum = this.laneNum;
        data.laneLeft = this.laneLeft;
        data.laneRight = this.laneRight;
        data.laneWidthLeft = this.laneWidthLeft;
        data.laneWidthRight = this.laneWidthRight;
        data.laneClass = this.laneClass;
        data.width = this.width;
        data.isViaduct = this.isViaduct;
        data.leftRegionId = this.leftRegionId;
        data.rightRegionId = this.rightRegionId;
        data.geometry = this.geometry;
        data.length = this.length;
        data.meshId = this.meshId;
        data.onewayMark = this.onewayMark;
        data.streetLight = this.streetLight;
        data.parkingLot = this.parkingLot;
        data.adasFlag = this.adasFlag;
        data.sidewalkFlag = this.sidewalkFlag;
        data.walkstairtFlag = this.walkstairtFlag;
        data.diciType = this.diciType;
        data.walkFlag = this.walkFlag;
        data.difGroupid = this.difGroupid;
        data.srcFlag = this.srcFlag;
        data.digitalLevel = this.digitalLevel;
        data.editFlag = this.editFlag;
        data.truckFlag = this.truckFlag;
        data.feeStd = this.feeStd;
        data.feeFlag = this.feeFlag;
        // data["systemId"] = this.systemId;
        data.originLinkPid = this.originLinkPid;
        data.centerDivider = this.centerDivider;
        data.parkingFlag = this.parkingFlag;
        data.memo = this.memo;
        data.geoLiveType = this.geoLiveType;
        data.reserved = this.reserved;
        var forms = [];
        for (var i = 0, len = this.forms.length; i < len; i++) {
        	if (this.forms[i].status) {
        		forms.push(this.forms[i].getIntegrate());
        	}
        }
        data.forms = forms;
        var limits = [];
        for (var i = 0, len = this.limits.length; i < len; i++) {
            limits.push(this.limits[i].getIntegrate());
        }
        data.limits = limits;
        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }
        data.names = names;
        var rtics = [];
        for (var i = 0, len = this.rtics.length; i < len; i++) {
            rtics.push(this.rtics[i].getIntegrate());
        }
        data.rtics = rtics;
        var intRtics = [];
        for (var i = 0, len = this.intRtics.length; i < len; i++) {
            intRtics.push(this.intRtics[i].getIntegrate());
        }
        data.intRtics = intRtics;
        var sidewalks = [];
        for (var i = 0, len = this.sidewalks.length; i < len; i++) {
            sidewalks.push(this.sidewalks[i].getIntegrate());
        }
        data.sidewalks = sidewalks;
        var speedlimits = [];
        for (var i = 0, len = this.speedlimits.length; i < len; i++) {
            speedlimits.push(this.speedlimits[i].getIntegrate());
        }
        data.speedlimits = speedlimits;
        var limitTrucks = [];
        for (var i = 0, len = this.limitTrucks.length; i < len; i++) {
            limitTrucks.push(this.limitTrucks[i].getIntegrate());
        }
        data.limitTrucks = limitTrucks;
        var walkstairs = [];
        for (var i = 0, len = this.walkstairs.length; i < len; i++) {
            walkstairs.push(this.walkstairs[i].getIntegrate());
        }
        data.walkstairs = walkstairs;
        var zones = [];
        for (var i = 0, len = this.zones.length; i < len; i++) {
            zones.push(this.zones[i].getIntegrate());
        }
        data.zones = zones;
        var tmclocations = [];
        for (var i = 0, len = this.tmclocations.length; i < len; i++) {
            tmclocations.push(this.tmclocations[i].getIntegrate());
        }
        data.tmclocations = tmclocations;
        return data;
    },
    /**
     * 修改种别的关联维护
     * 两个参数都必选传
     * @param newValue
     * @param oldValue
     * @param param 选传
     */
    changeKind: function (newValue, oldValue) {
        this.kind = newValue;
        // 修改道路种别对道路名的维护;
        if (newValue == 1 || newValue == 2 || newValue == 3) {
            for (var i = 0, len = this.names.length; i < len; i++) {
                this.names[i].code = 1;
            }
        }

        // 根据车道种别为9、10、轮渡、人渡时维护车道数和车道等级为1;
        if (newValue == 9 || newValue == 10 || newValue == 11 || newValue == 13) {
            this.laneNum = 1;
            this.laneLeft = 0;
            this.laneRight = 0;
            this.laneClass = 1;
        }
        // 根据道路种别维护路径采纳字段 ，参考的是bug4修改
        if (newValue == 1) {
            this.routeAdopt = 5;
        } else if (newValue == 2 || newValue == 3) {
            this.routeAdopt = 4;
        } else if (newValue == 4 || newValue == 6 || newValue == 7) {
            this.routeAdopt = 2;
        } else if (newValue == 8 || newValue == 9 || newValue == 10 || newValue == 11 || newValue == 13) {
            this.routeAdopt = 0;
        }
        if ((newValue == 9 || newValue == 10) && (oldValue != 9 && oldValue != 10)) {
            if (this.limits.length == 0) {
                var newLimit = fastmap.dataApi.rdLinkLimit({
                    linkPid: this.pid,
                    processFlag: 2,
                    limitDir: 0
                });
                this.limits.unshift(newLimit);
            } else {
                var temp = 0;
                for (var i = 0, len = this.limits.length; i < len; i++) {
                    if (this.limits[i].type == 3) {
                        this.limits[i].processFlag = 2;
                        this.limits[i].limitDir = 0;
                        temp++;
                    }
                }
                if (temp == 0) {
                    var newLimit = fastmap.dataApi.rdLinkLimit({
                        linkPid: this.pid,
                        processFlag: 2,
                        limitDir: 0
                    });
                    this.limits.unshift(newLimit);
                }
            }
        } else if ((newValue != 9 && newValue != 10) && (oldValue == 9 || oldValue == 10)) {
            for (var i = this.limits.length - 1; i >= 0; i--) {
                if (this.limits[i].type == 3) {
                    this.limits.splice(i, 1);
                }
            }
        }
        // 10级路变非10级以及非10级切换为10级时对行人导航面板联动控制;
        if (newValue == 10) {
            this.walkFlag = 1;
            this.sidewalkFlag = 0;
            // this.sidewalks = [];
        } else if (newValue != 10) {
            this.walkFlag = 0;
            this.sidewalkFlag = 0;
        }
    },
    /**
     * 修改方向的关联维护
     * 传改变后的方向
     * @param direct
     */
    changeDirect: function (direct) {
        // 以下是对限速的维护
        for (var i = 0; i < this.speedlimits.length; i++) {
            if (direct == 2) {
                this.speedlimits[i].toLimitSrc = 9;
                this.speedlimits[i].toSpeedLimit = 0;
                if (this.speedlimits[i].fromSpeedLimit != 0) {
                    this.speedlimits[i].speedClass = this._changeSpeedClass(this.speedlimits[i].fromSpeedLimit);
                } else {
                    this.speedlimits[i].speedClass = 0;
                }
                this.speedlimits[i].speedClassWork = 1;
            } else if (direct == 3) {
                this.speedlimits[i].fromLimitSrc = 9;
                this.speedlimits[i].fromSpeedLimit = 0;
                if (this.speedlimits[i].toSpeedLimit != 0) {
                    this.speedlimits[i].speedClass = this._changeSpeedClass(this.speedlimits[i].toSpeedLimit);
                } else {
                    this.speedlimits[i].speedClass = 0;
                }
                this.speedlimits[i].speedClassWork = 1;
            } else {
                this.speedlimits[i].speedClass = 0;
                this.speedlimits[i].speedClassWork = 1;
            }
        }
        // 以下是对车道的维护
        if (direct == 2 || direct == 3) {
            this._changeLaneClass(this.laneNum);
            this.laneLeft = this.laneRight = 0;
        } else if (this.laneNum % 2) {
            this._changeLaneClass((parseInt(this.laneNum) + 1) / 2);
        } else if (!this.laneNum) {
            var temp = this.laneRight > this.laneLeft ? this.laneRight : this.laneLeft;
            this._changeLaneClass(temp);
        } else {
            this._changeLaneClass(parseInt(this.laneNum) / 2);
        }
    },
    /**
     * 根据laneNum修改laneClass
     * 传laneNum
     * @param laneNum
     */
    _changeLaneClass: function (laneNum) {
        if (laneNum == 0) {
            this.laneClass = 0;
        } else if (laneNum == 1) {
            this.laneClass = 1;
        } else if (laneNum >= 2 && laneNum <= 3) {
            this.laneClass = 2;
        } else {
            this.laneClass = 3;
        }
    },
    /**
     * 根据SpeedLimit修改SpeedClass
     * 传SpeedLimit的值
     * @param value
     * @return SpeedClass
     */
    _changeSpeedClass: function (value) {
        var result;
        if (value < 11 && value > 0) {
            result = 8;
        } else if (value <= 30 && value >= 11) {
            result = 7;
        } else if (value <= 50 && value >= 30.1) {
            result = 6;
        } else if (value <= 70 && value >= 50.1) {
            result = 5;
        } else if (value <= 90 && value >= 70.1) {
            result = 4;
        } else if (value <= 100 && value >= 90.1) {
            result = 3;
        } else if (value <= 130 && value >= 100.1) {
            result = 2;
        } else if (value > 130) {
            result = 1;
        }
        return result;
    }
});

/** *
 * Rdlink初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLink = function (data, options) {
    return new fastmap.dataApi.RdLink(data, options);
};
