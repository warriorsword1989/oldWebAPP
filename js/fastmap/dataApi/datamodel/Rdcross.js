/**
 * Created by wangtun on 2016/3/14.
 */
fastmap.dataApi.rdCross=fastmap.dataApi.rdRestriction.extend({
    initialize: function (data, options) {
        L.setOptions(this, options);
        this.setAttributeData(data);
    },

    setAttributeData:function(data){
        this.pid = data["pid"];
        this.type = data["type"] || 0;
        this.signal = data["signal"] || 0;
        this.kgFlag = data["kgFlag"] || 0;
        this.names=[];
        if(data["names"].length>0){
            for(var i= 0;i<data["names"].length;i++){
                var name = new fastmap.dataApi.rdCrossName(data["names"][i]);
                this.names.push(name);
            }
        }
        this.links=[];
        if(data["links"].length>0){
            for(var i= 0;i<data["links"].length;i++){
                var link = new fastmap.dataApi.rdCrossLink(data["links"][i]);
                this.links.push(link);
            }
        }
        this.nodes=[];
        if(data["nodes"].length>0){
            for(var i= 0;i<data["nodes"].length;i++){
                var node = new fastmap.dataApi.rdCrossNode(data["nodes"][i]);
                this.nodes.push(node);
            }
        }
    },

    getSnapShot:function(){
        var data = {};
        data["pid"] = this.pid;
        data["type"] = this.type;
        data["signal"] = this.signal;
        data["electroeye"] = this.electroeye;
        data["kgflag"] = this.kgflag;
        data["links"] = [];
        for(var i= 0,len= this.data["links"].length;i<len;i++){
            data["links"].push(this.data["links"][i].getIntegrate())
        }

        data["names"]=[];
        for(var i= 0,len= this.data["names"].length;i<len;i++){
            data["names"].push(this.data["names"][i].getIntegrate())
        }

        data["nodes"]=[];
        for(var i= 0,len= this.data["nodes"].length;i<len;i++){
            data["nodes"].push(this.data["nodes"][i].getIntegrate())
        }

        return data;
    },

    getIntegrate:function(){
        var data={};
        data["pid"] = this.pid;
        data["type"] = this.type;
        data["signal"] = this.signal;
        data["electroeye"] = this.electroeye;
        data["kgflag"] = this.kgflag;
        data["links"] = [];
        for(var i= 0,len= this.data["links"].length;i<len;i++){
            data["links"].push(this.data["links"][i].getIntegrate())
        }

        data["names"]=[];
        for(var i= 0,len= this.data["names"].length;i<len;i++){
            data["names"].push(this.data["names"][i].getIntegrate())
        }

        data["nodes"]=[];
        for(var i= 0,len= this.data["nodes"].length;i<len;i++){
            data["nodes"].push(this.data["nodes"][i].getIntegrate())
        }

        return data;
    }
})