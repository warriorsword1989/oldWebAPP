define(['../../fastmap','fastmap/utils'], function (fastmap) {
    fastmap.mapApi.Point = fastmap.mapApi.Geometry.extend({
        /**
         * 点的横坐标
         * x
         * @property x
         * @type Number
         */
        x: null,

        /**
         * 点的纵坐标
         * y
         * @property y
         * @type Number
         */
        y: null,

        /**
         * @method initialize
         * 初始化构造函数
         *
         * @param {Number} x 横坐标
         * @param {Number} y 纵坐标
         *
         */
        initialize: function(x, y) {
            fastmap.mapApi.Geometry.prototype.initialize.apply(this, arguments);
       
            this.x = parseFloat(x);
            this.y = parseFloat(y);
        },

        /**
         * 深度拷贝几何.
         * @method clone
         * @return {fastmap.mapApi.Point} Clone.
         */
        clone: function() {
            var obj = new fastmap.mapApi.Point(this.x, this.y);
            // catch any randomly tagged-on properties
            fastmap.Utils.applyDefaults(obj, this);

            return obj;
        },

        /**
         * 计算点对象的外包框
         * @method calculateBounds
         *
         * @return {fastmap.mapApi.Bounds}.
         */
        calculateBounds: function () {
            this.bounds = new fastmap.mapApi.Bounds(this.x, this.y, this.x, this.y);
            return this.bounds;
        }
    })
});
