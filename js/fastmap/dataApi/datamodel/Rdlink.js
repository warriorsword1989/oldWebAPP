/**
 * Created by wangtun on 2015/9/9.
 * Class Rdnode
 */

fastmap.dataApi.rdLink = fastmap.dataApi.GeoDataModel.extend({
    /***
     *
     * @param data geometry
     * @param options 其他可选参数
     */
    initialize: function (data, options) {
        L.setOptions(this, options);

        ///this.geometry = data["geometry"];
        this.setAttributeData(data);
    },

    /**
     * 将请求返回结果给对象属性赋值
     * @method setAttributeData
     *
     * @param {object} data.
     */
    setAttributeData: function (data) {
        this.pid = data["pid"] || null;
        this.sNodePid = data["sNodePid"] || null;
        this.eNodePid = data["eNodePid"] || null;
        this.kind = data["kind"] || 7;
        this.direct = data["direct"] || 1;
        this.appInfo = data["appInfo"] || 1;
        this.tollInfo = data["tollInfo"] || 2;
        this.routeAdopt = data["routeAdopt"] || 2;
        this.multiDigitized = data["multiDigitized"] || 0;
        this.developState = data["developState"] || 0;
        this.imiCode = data["imiCode"] || 0;
        this.specialTraffic = data["specialTraffic"] || 0;
        this.functionClass = data["functionClass"] || 5;
        this.urban = data["urban"] || 0;
        this.paveStatus = data["paveStatus"] || 0;
        this.laneNum = data["laneNum"] || 2;
        this.laneLeft = data["laneLeft"] || 0;
        this.laneRight = data["laneRight"] || 0;
        this.laneWidthLeft = data["laneWidthLeft"] || 1;
        this.laneWidthRight = data["laneWidthRight"] || 1;
        this.laneClass = data["laneClass"] || 2;
        this.width = data["width"] || 0;
        this.isViaduct = data["isViaduct"] || 0;
        this.leftRegionId = data["leftRegionId"] || 0;
        this.rightRegionId = data["rightRegionId"] || 0;
        this.geometry = data["geoemtry"] || null;
        this.length = data["length"] || 0;
        this.meshId = data["meshId"] || 0;
        this.onewayMark = data["onewayMark"] || 0;
        this.streetLight = data["streetLight"] || 0;
        this.parkingLot = data["parkingLot"] || 0;
        this.adasFlag = data["adasFlag"] || 0;
        this.sidewalkFlag = data["sidewalkFlag"] || 0;
        this.walkstairtFlag = data["walkstairtFlag"] || 0;
        this.diciType = data["diciType"] || 0;
        this.walkFlag = data["walkFlag"] || 0;
        this.difGroupId = data["difGroupId"] || "";
        this.srcFlag = data["srcFlag"] || 6;
        this.digitalLevel = data["digitalLevel"] || 0;
        this.editFlag = data["editFlag"] || 1;
        this.truckFlag = data["truckFlag"] || 0;
        this.feeStd = data["feeStd"] || 0;
        this.feeFlag = data["feeFlag"] || 0;
        this.systemId = data["systemId"] || 0;
        this.originLinkPid = data["originLinkPid"] || 0;
        this.centerDivider = data["centerDivider"] || 0;
        this.parkingFlag = data["parkingFlag"] || 0;
        this.memo = data["memo"] || "";
        this.reserved = data["reserved"] || "";

        this.forms = [];
        if (data["forms"]&&data["forms"].length > 0) {
            for (var i = 0, len = data["forms"].length; i < len; i++) {
                var form =fastmap.dataApi.linkform(data["forms"][i]);
                this.forms.push(form);
            }


        }
        this.names = [];
        if (data["names"]&&data["names"].length > 0) {

            for (var i = 0, len = data["names"].length; i < len; i++) {

                var name =  fastmap.dataApi.linkname(data["names"][i]);
                this.names.push(name);
            }


        }
        this.rtics = [];
        if (data["rtics"]&&data["rtics"].length > 0) {
            for (var i = 0, len = data["rtics"].length; i < len; i++) {

                var rtic =fastmap.dataApi.linkrtic(data["rtics"][i]);
                this.rtics.push(rtic);
            }


        }
        this.intRtics = [];
        if (data["intRtics"]&&data["intRtics"].length > 0) {
            for (var i = 0, len = data["intRtics"].length; i < len; i++) {

                var intRtics =fastmap.dataApi.linkintrtic(data["intRtics"][i]);
                this.intRtics.push(intRtics);
            }


        }
        this.sidewalks = [];
        if (data["sidewalks"]&&data["sidewalks"].length > 0) {
            for (var i = 0, len = data["sidewalks"].length; i < len; i++) {

                var sideWalk =  fastmap.dataApi.linksidewalk(data["sidewalks"][i]);
                this.sidewalks.push(sideWalk);
            }


        }
        this.speedlimits = [];
        if (data["speedlimits"]&&data["speedlimits"].length > 0) {
            for(var i= 0,len=data["speedlimits"].length;i<len;i++) {
                var speeedLimit =  fastmap.dataApi.linkspeedlimit(data["speedlimits"][i]);
                this.speedlimits.push(speeedLimit);
            }


        }
        this.limits = [];
        if (data["limits"]&&data["limits"].length > 0) {
            for(var i= 0,len=data["limits"].length;i<len;i++) {
                var limit=  fastmap.dataApi.linklimit(data["limits"][i]);
                this.limits.push(limit);
            }


        }
        this.limitTrucks = [];
        if (data["limitTrucks"]&&data["limitTrucks"].length > 0) {
            for(var i= 0,len=data["limitTrucks"].length;i<len;i++) {

                var truckLimit = fastmap.dataApi.linktrucklimit(data["limitTrucks"][i]);
                this.limitTrucks.push(truckLimit);
            }

        }
        this.walkstairs = [];
        if (data["walkstairs"]&&data["walkstairs"].length > 0) {
            for(var i= 0,len=data["walkstairs"].length;i<len;i++) {

                var walkStair =  fastmap.dataApi.linkwalkstair(data["walkstairs"][i]);
                this.walkstairs.push(walkStair);
            }

        }
        this.zones = [];
        if (data["zones"]&&data["zones"].length > 0) {
            for(var i= 0,len=data["zones"].length;i<len;i++) {

                var zone =  fastmap.dataApi.linkzone(data["zones"][i]);
                this.zones.push(zone);
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
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["direct"] = this.direct;
        data["appInfo"] = this.appInfo;
        data["tollInfo"] = this.tollInfo;
        data["routeAdopt"] = this.routeAdopt;
        data["multiDigitized"] = this.multiDigitized;
        data["developState"] = this.developState;
        data["imiCode"] = this.imiCode;

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
        data["pid"] = this.pid;
        data["sNodePid"] = this.sNodePid;
        data["eNodePid"] = this.eNodePid;
        data["kind"] = this.kind;
        data["direct"] = this.direct;
        data["appInfo"] = this.appInfo;
        data["tollInfo"] = this.tollInfo;
        data["routeAdopt"] = this.routeAdopt;
        data["multiDigitized"] = this.multiDigitized;
        data["developState"] = this.developState;
        data["imiCode"] = this.imiCode;
        data["specialTraffic"] = this.specialTraffic;
        data["functionClass"] = this.functionClass;
        data["urban"] = this.urban;
        data["paveStatus"] = this.paveStatus;
        data["laneNum"] = this.laneNum;
        data["laneLeft"] = this.laneLeft;
        data["laneRight"] = this.laneRight;
        data["laneWidthLeft"] = this.laneWidthLeft;
        data["laneWidthRight"] = this.laneWidthRight;
        data["laneClass"] = this.laneClass;
        data["width"] = this.width;
        data["isViaduct"] = this.isViaduct;
        data["leftRegionId"] = this.leftRegionId;
        data["rightRegionId"] = this.rightRegionId;
        data["geoemtry"] = this.geometry;
        data["length"] = this.length;
        data["meshId"] = this.meshId;
        data["onewayMark"] = this.onewayMark;
        data["streetLight"] = this.streetLight;
        data["parkingLot"] = this.parkingLot;
        data["adasFlag"] = this.adasFlag;
        data["sidewalkFlag"] = this.sidewalkFlag;
        data["walkstairtFlag"] = this.walkstairtFlag;
        data["diciType"] = this.diciType;
        data["walkFlag"] = this.walkFlag;
        data["difGroupId"] = this.difGroupId;
        data["srcFlag"] = this.srcFlag;
        data["digitalLevel"] = this.digitalLevel;
        data["editFlag"] = this.editFlag;
        data["truckFlag"] = this.truckFlag;
        data["feeStd"] = this.feeStd;
        data["feeFlag"] = this.feeFlag;
        data["systemId"] = this.systemId;
        data["originLinkPid"] = this.originLinkPid;
        data["centerDivider"] = this.centerDivider;
        data["parkingFlag"] = this.parkingFlag;
        data["memo"] = this.memo;
        data["reserved"] = this.reserved;

        var forms = [];
        for (var i = 0, len = this.forms.length; i < len; i++) {
            forms.push(this.forms[i].getIntegrate());
        }
        data["forms"] = forms;

        var limits = [];
        for (var i = 0, len = this.limits.length; i < len; i++) {
            limits.push(this.limits[i].getIntegrate())
        }
        data["limits"] = limits;

        var names = [];
        for (var i = 0, len = this.names.length; i < len; i++) {
            names.push(this.names[i].getIntegrate());
        }

        data["names"] = names;

        var rtics = [];
        for (var i = 0, len = this.rtics.length; i < len; i++) {
            rtics.push(this.rtics[i].getIntegrate())
        }
        data["rtics"] = rtics;

        var sidewalks = [];
        for (var i = 0, len = this.sidewalks.length; i < len; i++) {
            sidewalks.push(this.sidewalks[i].getIntegrate())
        }
        data["sidewalks"] = sidewalks;

        var speedlimits = [];
        for (var i = 0, len = this.speedlimits.length; i < len; i++) {
            speedlimits.push(this.speedlimits[i].getIntegrate())
        }
        data["speedlimits"] = speedlimits;

        var limitTrucks = [];
        for (var i = 0, len = this.limitTrucks.length; i < len; i++) {
            limitTrucks.push(this.limitTrucks[i].getIntegrate())
        }
        data["limitTrucks"] = limitTrucks;

        var walkstairs = [];
        for (var i = 0, len = this.walkstairs.length; i < len; i++) {
            walkstairs.push(this.walkstairs[i].getIntegrate())
        }
        data["walkstairs"] = walkstairs;

        var zones = [];
        for (var i = 0, len = this.zones.length; i < len; i++) {
            zones.push(this.zones[i].getIntegrate());
        }
        data["zones"] = zones;
        return data;
    }
});

/***
 * Rdlink初始化函数
 * @param data node数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdlink = function (data, options) {
    return new fastmap.dataApi.rdLink(data, options);
}

