/**
 * Point
 * 基于Geometry的Point类
 *
 * @namespace mapApi
 * @class Point
 */
define(['../../fastmap','fastmap/utils'], function (fastmap) {
    fastmap.mapApi.Point = fastmap.mapApi.Geometry.extend({
        /**
         * 几何类型
         * type
         * @property type
         * @type String
         */
        type:"Point",
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
        },
        /**
         * 移动点
         * @method move
         * @param {Number}x
         * @param {Number}y
         */
        move: function(x, y) {
            this.x = this.x + x;
            this.y = this.y + y;
            this.bounds=null;
        },

        /**
         * 获取中心点
         * @method getCentroid
         * @returns {fastmap.mapApi.Point}
         */
        getCentroid: function() {
            return new fastmap.mapApi.Point(this.x, this.y);
        },

        /**
         * 判断点与几何相关空间位置关系，是否相交
         * @method intersects
         * @param {Geometry}geometry
         * @returns {boolean}
         */
        intersects: function(geometry) {
            var intersect = false;
            if(geometry.type == "Point") {
                intersect = this.equals(geometry);
            } else {
                intersect = geometry.intersects(this);
            }
            return intersect;
        }
    })
});
