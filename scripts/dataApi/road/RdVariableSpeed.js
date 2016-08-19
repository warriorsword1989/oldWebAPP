/**
 * Created by linglong on 2016/8/16.
 * Class RdVariableSpeed
 */

fastmap.dataApi.RdVariableSpeed = fastmap.dataApi.GeoDataModel.extend({

    initialize: function (data) {
        this.geoLiveType = "RDVARIABLESPEED";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.outLinkPid = data["outLinkPid"];
        this.location = data["location"] || 0;
        this.speedValue = data["speedValue"] || 0;
        this.speedType = data["speedType"] || 0;
        this.speedDependent = data["speedDependent"] || 0;
        this.timedomain = data["timedomain"] || '';
        this.vehicle = data["vehicle"] || 0;
        this.vias = [];
        for(var i=0;i<data["vias"].length;i++){
            var link = fastmap.dataApi.rdVariableSpeedLinks(data["vias"][i]);
            this.vias.push(link);
        }
    },

    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"]  = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["location"] = this.location;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["speedDependent"] = this.speedDependent;
        data["timedomain"] = this.timedomain;
        data["vehicle"] = this.vehicle;
        data["geoLiveType"] = this.geoLiveType;
        data["vias"] = [];
        for(var i=0;i<this.vias.length;i++){
            data["vias"].push(this.vias[i].getIntegrate());
        }
        return data;
    },


    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"]  = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["location"] = this.location;
        data["speedValue"] = this.speedValue;
        data["speedType"] = this.speedType;
        data["speedDependent"] = this.speedDependent;
        data["timedomain"] = this.timedomain;
        data["vehicle"] = this.vehicle;
        data["vias"] = [];
        for(var i=0;i<this.vias.length;i++){
            data["vias"].push(this.vias[i].getIntegrate());
        }
        return data;
    }

});


fastmap.dataApi.rdVariableSpeed = function (data, options) {
    return new fastmap.dataApi.RdVariableSpeed(data, options);
}

