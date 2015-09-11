/**
 * Created by liwanchong on 2015/9/9.
 */
define(['js/fastmap/fastmap'],function(fastmap) {
    fastmap.FeatCode= L.Class.extend({

        initialize:function(options) {
            this.options = options || {};
            L.setOptions(this,options)
            this.type = "";
        },
        setOutput:function() {

        }
    })
})