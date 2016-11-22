/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.RdBranchSignBoard = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = 'RDBRANCHSIGNBOARD';
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data.pid;
        this.rowId = data.rowId;
        this.branchPid = data.branchPid;
        this.backimageCode = data.backimageCode || '';
        this.arrowCode = data.arrowCode || '';
        this.names = [];
        for (var i = 0; i < data.names.length; i++) {
            var name = fastmap.dataApi.rdBranchSignBoardName(data.names[i]);
            this.names.push(name);
        }
    },

    getIntegrate: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.backimageCode = this.backimageCode;
        data.arrowCode = this.arrowCode;
        data.geoLiveType = this.geoLiveType;
        data.names = [];
        if (this.names.length) {
            for (var i = 0; i < this.names.length; i++) {
                data.names.push(this.names[i].getIntegrate());
            }
        }
        return data;
    },

    getSnapShot: function () {
        var data = {};
        data.pid = this.pid;
        data.rowId = this.rowId;
        data.branchPid = this.branchPid;
        data.backimageCode = this.backimageCode;
        data.arrowCode = this.arrowCode;
        data.geoLiveType = this.geoLiveType;
        data.names = [];
        for (var i = 0; i < this.names.length; i++) {
            data.names.push(this.names[i].getIntegrate());
        }
        return data;
    }
});

fastmap.dataApi.rdBranchSignBoard = function (data, options) {
    return new fastmap.dataApi.RdBranchSignBoard(data, options);
};
