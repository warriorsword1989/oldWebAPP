/**
 * Created by liwanchong on 2015/9/9.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.DataTipsController = L.Class.extend({
        options: {},
        initialize: function () {
            this.options = options || {};
            L.setOptions(this, options);
        },
        toDataMode: function () {

        },
        copy: function () {

        },
        close: function () {

        }
    });
})