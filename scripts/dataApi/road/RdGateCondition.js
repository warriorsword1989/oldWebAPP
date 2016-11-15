/**
 * Created by mali on 2016/8/1.
 * Class RdGateCondition
 */

fastmap.dataApi.RdGateCondition = fastmap.dataApi.GeoDataModel.extend({

    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDGATECONDITION';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
    	this.pid = data.pid;
        this.validObj = data.validObj || 0;
        this.timeDomain = data.timeDomain || '';
        this.rowId = data.rowId;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.validObj = this.validObj;
        data.timeDomain = this.timeDomain;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.validObj = this.validObj;
        data.timeDomain = this.timeDomain;
        data.rowId = this.rowId;
        data.geoLiveType = this.geoLiveType;
        return data;
    }
});

fastmap.dataApi.rdGateCondition = function (data, options) {
    return new fastmap.dataApi.RdGateCondition(data, options);
};

