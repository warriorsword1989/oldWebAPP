/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdSpeedLimit=fastmap.dataApi.rdRestriction.extend({
    pid:null,
    linkPid:0,
    direct:0,
    speedValue:0,
    speedType:0,
    tollgateFlag:0,
    speedDependent:0,
    speedFlag:0,
    limitSrc:1,
    timeDomain:"",
    captureFlag:0,
    descript:"",
    meshId:0,
    status:7,
    ckStatus:6,
    adjaFlag:0,
    recStatusIn:0,
    recStatusOut:0,
    timeDescript:"",
    geometry:null,
    laneSpeedValue:"",

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.linkPid = data["linkPid"];
        this.direct = data["direct"];
        this.speedValue = data["speedValue"];
        this.speedType = data["speedType"];
        this.tollgateFlag = data["tollgateFlag"];
        this.speedDependent = data["speedDependent"];
        this.speedFlag = data["speedFlag"];
        this.limitSrc = data["limitSrc"];
        this.timeDomain = data["timeDomain"];
        this.captureFlag = data["captureFlag"];
        this.descript = data["descript"];
        this.meshId = data["meshId"];
        this.status = data["status"];
        this.ckStatus = data["ckStatus"];
        this.adjaFlag = data["adjaFlag"];
        this.recStatusIn = data["recStatusIn"];
        this.recStatusOut = data["recStatusOut"];
        this.timeDescript = data["timeDescript"];
        this.geometry = data["geometry"];
        this.laneSpeedValue = data["laneSpeedValue"];
    },

    getSnapShot:function(){
        var data = {};
        data["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["direct"] = this.direct;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["tollgateFlag"] = this.tollgateFlag;
        data["speedDependent"] = this.speedDependent;
        data["speedFlag"] = this.speedFlag;
        data["limitSrc"] = this.limitSrc;
        data["timeDomain"] = this.timeDomain;
        data["captureFlag"] = this.captureFlag;
        data["descript"] = this.descript;
        data["meshId"] = this.meshId;
        data["status"] = this.status;
        data["ckStatus"] = this.ckStatus;
        data["adjaFlag"] = this.adjaFlag;
        data["recStatusIn"] = this.recStatusIn;
        data["recStatusOut"] = this.recStatusOut;
        data["timeDescript"] = this.timeDescript;
        data["geometry"] = this.geometry;
        data["laneSpeedValue"] = this.laneSpeedValue;

        return data;
    },

    getIntegrate:function(){
        var data={};
        ata["pid"] = this.pid;
        data["linkPid"] = this.linkPid;
        data["direct"] = this.direct;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["tollgateFlag"] = this.tollgateFlag;
        data["speedDependent"] = this.speedDependent;
        data["speedFlag"] = this.speedFlag;
        data["limitSrc"] = this.limitSrc;
        data["timeDomain"] = this.timeDomain;
        data["captureFlag"] = this.captureFlag;
        data["descript"] = this.descript;
        data["meshId"] = this.meshId;
        data["status"] = this.status;
        data["ckStatus"] = this.ckStatus;
        data["adjaFlag"] = this.adjaFlag;
        data["recStatusIn"] = this.recStatusIn;
        data["recStatusOut"] = this.recStatusOut;
        data["timeDescript"] = this.timeDescript;
        data["geometry"] = this.geometry;
        data["laneSpeedValue"] = this.laneSpeedValue;

        return data;
    }
})