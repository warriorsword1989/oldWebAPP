/**
 * Created by wangtun on 2016/3/15.
 */
fastmap.dataApi.rdBranch = fastmap.dataApi.GeoDataModel.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.geoLiveType = "RDBRANCH";
        this.setAttributeData(data);
    },

    setAttributeData: function (data) {
        this.pid = data["pid"];
        this.inLinkPid = data["inLinkPid"];
        this.nodePid = data["nodePid"];
        this.outLinkPid = data["outLinkPid"];
        this.relationshipType = data["relationshipType"] || 1;
        this.realimages = [];
        if (data["realimages"].length > 0) {
            for (var i = 0; i < data["realimages"].length; i++) {
                var realImage = new fastmap.dataApi.rdBranchRealImage(data["realimages"][i]);
                this.realimages.push(realImage);
            }
        }

        this.schematics = [];
        if (data["schematics"].length > 0) {
            for (var i = 0; i < data["schematics"].length; i++) {
                var schemtic = new fastmap.dataApi.rdBranchSchematic(data["schematics"][i]);
                this.schematics.push(schemtic);
            }
        }

        this.seriesbranches = [];
        if (data["seriesbranches"].length > 0) {
            for (var i = 0; i < data["seriesbranches"].length; i++) {
                var seriesBranch = new fastmap.dataApi.rdBranchSeriesBranch(data["seriesbranches"][i]);
                this.seriesbranches.push(seriesBranch);
            }
        }

        this.signasreals = [];
        if (data["signasreals"].length > 0) {
            for (var i = 0; i < data["signasreals"].length; i++) {
                var signasReal = new fastmap.dataApi.rdBranchSignAsreal(data["signasreals"][i]);
                this.signasreals.push(signasReal);
            }
        }

        this.signboards = [];
        if (data["signboards"].length > 0) {
            for (var i = 0; i < data["signboards"].length; i++) {
                var signBoard = new fastmap.dataApi.rdBranchSignBoard(data["signboards"][i]);
                this.signboards.push(signBoard);
            }
        }

        this.vias = [];
        if (data["vias"].length > 0) {
            for (var i = 0; i < data["vias"].length; i++) {
                var via = new fastmap.dataApi.rdBranchVia(data["vias"][i]);
                this.vias.push(via);
            }
        }

        this.details = [];
        if (data["details"].length > 0) {
            for (var i = 0; i < data["details"].length; i++) {
                var detail = new fastmap.dataApi.rdBranchDetail(data["details"][i]);
                this.details.push(detail);
            }
        }
    },

    getSnapShot: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["relationshipType"] = this.relationshipType;
        data["geoLiveType"] = this.geoLiveType;
        data["realimages"] = [];
        for (var i = 0; i < this.realimages.length; i++) {
            data["realimages"].push(this.realimages[i].getIntegrate());
        }

        data["schematics"] = [];
        for (var i = 0; i < this.schematics.length; i++) {
            data["schematics"].push(this.schematics[i].getIntegrate());
        }

        data["seriesbranches"] = [];
        for (var i = 0; i < this.seriesbranches.length; i++) {
            data["seriesbranches"].push(this.seriesbranches[i].getIntegrate());
        }

        data["signasreals"] = [];
        for (var i = 0; i < this.signasreals.length; i++) {
            data["signasreals"].push(this.signasreals[i].getIntegrate());
        }

        data["signboards"] = [];
        for (var i = 0; i < this.signboards.length; i++) {
            data["signboards"].push(this.signboards[i].getIntegrate());
        }

        data["vias"] = [];
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias[i].getIntegrate());
        }

        data["details"] = [];
        for (var i = 0; i < this.details.length; i++) {
            data["details"].push(this.details[i].getIntegrate());
        }

        return data;
    },

    getIntegrate: function () {
        var data = {};
        data["pid"] = this.pid;
        data["inLinkPid"] = this.inLinkPid;
        data["nodePid"] = this.nodePid;
        data["outLinkPid"] = this.outLinkPid;
        data["geoLiveType"] = this.geoLiveType;
        data["relationshipType"] = this.relationshipType;
        data["realimages"] = [];
        for (var i = 0; i < this.realimages.length; i++) {
            data["realimages"].push(this.realimages[i].getIntegrate());
        }

        data["schematics"] = [];
        for (var i = 0; i < this.schematics.length; i++) {
            data["schematics"].push(this.schematics[i].getIntegrate());
        }

        data["seriesbranches"] = [];
        for (var i = 0; i < this.seriesbranches.length; i++) {
            data["seriesbranches"].push(this.seriesbranches[i].getIntegrate());
        }

        data["signasreals"] = [];
        for (var i = 0; i < this.signasreals.length; i++) {
            data["signasreals"].push(this.signasreals[i].getIntegrate());
        }

        data["signboards"] = [];
        for (var i = 0; i < this.signboards.length; i++) {
            data["signboards"].push(this.signboards[i].getIntegrate());
        }

        data["vias"] = [];
        for (var i = 0; i < this.vias.length; i++) {
            data["vias"].push(this.vias[i].getIntegrate());
        }

        data["details"] = [];
        for (var i = 0; i < this.details.length; i++) {
            data["details"].push(this.details[i].getIntegrate());
        }

        return data;
    }
});
/***
 * rdBranch初始化函数
 * @param data 分歧数据
 * @param options 其他可选参数
 * @returns {.dataApi.rdBranch}
 */
fastmap.dataApi.rdbranch = function (data, options) {
    return new fastmap.dataApi.rdBranch(data, options);
}