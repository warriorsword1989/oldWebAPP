/**
 * Created by zhongxiaoming on 2015/9/6.
 */
define(['../fastmap'], function (fastmap) {

    fastmap.mapApi.Tile = L.Class.extend({

        options: {
        },

        initialize: function (url,options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.url = url;
            this.data = {};
            this.xmlhttprequest = {};
        },

        getUrl:function(){
            return this.url;
        },

        getData:function(){
            return this.data;
        },

        setData:function(data){
            this.data = data;
        },

        getRequest:function(){
            return this.xmlhttprequest;
        }
        ,
        setRequest:function(xmlhttprequest){

            this.xmlhttprequest =xmlhttprequest;
        }
    });

    fastmap.mapApi.tile = function(url,options){
        return new  fastmap.mapApi.Tile(url,options)
    };
});