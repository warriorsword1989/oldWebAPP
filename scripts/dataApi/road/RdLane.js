/**
 * Created by wangmingdong on 2016/8/31.
 * Class Rdnode
 */

fastmap.dataApi.RdLane = fastmap.dataApi.GeoDataModel.extend({


    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDLANE";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.linkPid = data["linkPid"];
        this.laneNum = data["laneNum"] || 1;
        this.travelFlag = data["travelFlag"] || 0;
        this.seqNum = data["seqNum"] || 1;
        this.laneForming = data["laneForming"] || 0;
        this.laneDir = data["laneDir"] || 1;
        this.laneType = data["laneType"] || 1;
        if (data['arrowDir'] == '' || typeof(data['arrowDir']) == 'undefined') {
          this.arrowDir = 9;
        } else {
          this.arrowDir = data['arrowDir'];
        }
        this.laneMark = data["laneMark"] || 0;
        this.width = data["width"] || 0;
        this.restrictHeight = data["restrictHeight"] || 0;
        this.transitionArea = data["transitionArea"] || 0;
        this.fromMaxSpeed = data["fromMaxSpeed"] || 0;
        this.toMaxSpeed = data["toMaxSpeed"] || 0;
        this.fromMinSpeed = data["fromMinSpeed"] || 0;
        this.toMinSpeed = data["toMinSpeed"] || 0;
        this.elecEye = data["elecEye"] || 0;
        this.laneDivider = data["laneDivider"] || 0;
        this.centerDivider = data["centerDivider"] || 0;
        this.speedFlag = data["speedFlag"] || 0;
        this.srcFlag = data["srcFlag"] || 1;
        this.rowId = data["rowId"] || null;
        this.conditions = [];
        if(data["conditions"] && data["conditions"].length > 0){
            for(var i=0;i<data["conditions"].length;i++){
                var condition = fastmap.dataApi.rdLaneCondition(data["conditions"][i]);
                this.conditions.push(condition);
            }
        }
    },

    /**
     * 获取RdLane简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["laneNum"]  = this.laneNum;
        data["travelFlag"]  = this.travelFlag;
        data["seqNum"] = this.seqNum;
        data["laneForming"] = this.laneForming;
        data["laneDir"] = this.laneDir;
        data["laneType"] = this.laneType;
        data["arrowDir"] = this.arrowDir;
        data["laneMark"] = this.laneMark;
        data["width"] = parseInt(this.width);
        data["restrictHeight"] = parseInt(this.restrictHeight);
        data["transitionArea"] = this.transitionArea;
        data["fromMaxSpeed"] = parseInt(this.fromMaxSpeed);
        data["toMaxSpeed"] = parseInt(this.toMaxSpeed);
        data["fromMinSpeed"] = parseInt(this.fromMinSpeed);
        data["toMinSpeed"] = parseInt(this.toMinSpeed);
        data["elecEye"] = this.elecEye;
        data["laneDivider"] = this.laneDivider;
        data["centerDivider"] = this.centerDivider;
        data["speedFlag"] = this.speedFlag;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        data["conditions"] = [];
        for (var i = 0; i < this.conditions.length; i++) {
            data["conditions"].push(this.conditions[i].getIntegrate());
        }
        data["geoLiveType"] = this.geoLiveType;
        return data;
    },

    /**
     * 获取RdLane详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["laneNum"]  = this.laneNum;
        data["travelFlag"]  = this.travelFlag;
        data["seqNum"] = this.seqNum;
        data["laneForming"] = this.laneForming;
        data["laneDir"] = this.laneDir;
        data["laneType"] = this.laneType;
        data["arrowDir"] = this.arrowDir;
        data["laneMark"] = this.laneMark;
        data["width"] = parseInt(this.width);
        data["restrictHeight"] = parseInt(this.restrictHeight);
        data["transitionArea"] = this.transitionArea;
        data["fromMaxSpeed"] = parseInt(this.fromMaxSpeed);
        data["toMaxSpeed"] = parseInt(this.toMaxSpeed);
        data["fromMinSpeed"] = parseInt(this.fromMinSpeed);
        data["toMinSpeed"] = parseInt(this.toMinSpeed);
        data["elecEye"] = this.elecEye;
        data["laneDivider"] = this.laneDivider;
        data["centerDivider"] = this.centerDivider;
        data["speedFlag"] = this.speedFlag;
        data["srcFlag"] = this.srcFlag;
        data["rowId"] = this.rowId;
        data["conditions"] = [];
        for (var i = 0; i < this.conditions.length; i++) {
            data["conditions"].push(this.conditions[i].getIntegrate());
        }
        data["geoLiveType"] = this.geoLiveType;
        return data;
    }
});

/***
 * RdLane初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.rdNode}
 */
fastmap.dataApi.rdLane = function (data, options) {
    return new fastmap.dataApi.RdLane(data, options);
}
