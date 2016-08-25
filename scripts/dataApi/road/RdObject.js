/**
 * Created by liuyang on 2016/8/9.
 * Class RdObject
 */

fastmap.dataApi.RdObject = fastmap.dataApi.GeoDataModel.extend({

    /***
     *
     * @param data
     * @param options 其他可选参数
     */
    initialize: function (data) {
        this.geoLiveType = "RDOBJECT";
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"] || "";
        this.geometry = data["geometry"] || "";
        this.links = [];
        this.nodes = [];
        this.inters = [];
        this.roads = [];
        this.names = [];

        for(var i=0;i<data["links"].length;i++){
            var link = fastmap.dataApi.RdObjectLinks(data["links"][i]);
            this.links.push(link);
        }
        for(var i=0;i<data["nodes"].length;i++){
            var node = fastmap.dataApi.rdObjectNodes(data["nodes"][i]);
            this.nodes.push(node);
        }
        for(var i=0;i<data["inters"].length;i++){
            var inter = fastmap.dataApi.rdObjectNodes(data["inters"][i]);
            this.nodes.push(inter);
        }
        for(var i=0;i<data["roads"].length;i++){
            var road = fastmap.dataApi.rdObjectNodes(data["roads"][i]);
            this.nodes.push(road);
        }
        for(var i=0;i<data["names"].length;i++){
            var name = fastmap.dataApi.rdObjectNodes(data["names"][i]);
            this.nodes.push(name);
        }
    },

    /**
     * 获取RdObject简略信息
     * @method getSnapShot
     *
     * @return {object} getSnapShot.
     */
    getSnapShot:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodes"] = [];
        data["links"] = [];
        data["inters"] = [];
        data["roads"] = [];
        data["names"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for(var i=0;i<this.links.length;i++){
            data["links"].push(this.links[i].getIntegrate());
        }
        for(var i=0;i<this.nodes.length;i++){
            data["nodes"].push(this.nodes[i].getIntegrate());
        }
        for(var i=0;i<this.inters.length;i++){
            data["inters"].push(this.inters[i].getIntegrate());
        }
        for(var i=0;i<this.roads.length;i++){
            data["roads"].push(this.roads[i].getIntegrate());
        }
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }
        return data;
    },

    /**
     * 获取RdObject详细信息
     * @method getIntegrate
     *
     * @return {object} getIntegrate.
     */
    getIntegrate:function() {
        var data = {};
        data["pid"] = this.pid;
        data["nodes"] = [];
        data["links"] = [];
        data["inters"] = [];
        data["roads"] = [];
        data["names"] = [];
        data["geoLiveType"] = this.geoLiveType;
        for(var i=0;i<this.links.length;i++){
            data["links"].push(this.links[i].getIntegrate());
        }
        for(var i=0;i<this.nodes.length;i++){
            data["nodes"].push(this.nodes[i].getIntegrate());
        }
        for(var i=0;i<this.inters.length;i++){
            data["inters"].push(this.inters[i].getIntegrate());
        }
        for(var i=0;i<this.roads.length;i++){
            data["roads"].push(this.roads[i].getIntegrate());
        }
        for(var i=0;i<this.names.length;i++){
            data["names"].push(this.names[i].getIntegrate());
        }
        return data;
    }
});

/***
 * RdSlope初始化函数
 * @param id
 * @param options 其他可选参数
 * @returns {.dataApi.RdObject}
 */
fastmap.dataApi.rdObject = function (data, options) {
    return new fastmap.dataApi.RdObject(data, options);
}

