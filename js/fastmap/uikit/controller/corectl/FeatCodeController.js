/**
 * Created by liwanchong on 2015/9/9.
 */
define(['js/fastmap/fastmap'],function(fastmap) {
    fastmap.featCodeController= L.Class.extend({
        options:{

        },
        initialize:function() {
            this.options = options || {};
            L.setOptions(this, options);
        },
        setFeatCode:function(featCode) {

        }
    })
})