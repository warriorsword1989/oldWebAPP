/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class ShapeEditorController
 */
fastmap.uikit.ShapeEditorController = L.Class.extend({
    /**
     * 事件管理器
     * @property includes
     */
    includes: L.Mixin.Events,

    options: {},

    /***
     *
     * @param {Object}options
     */
    initialize: function (options) {
        this.options = options || {};
        L.setOptions(this, options);
        this.map = options.map || null;
        this.editType = options.editType || '';
        this.currentEditinGeometry = {};
        this.currentTool = {};
        this._map = options.map || {};
        this.shapeEditorToolsObj = fastmap.uiKit.shapeeditorfactory().CreateShapeToolsObject();
        this.shapeEditorResultFeedback = new fastmap.uiKit.ShapeEditResultFeedback();
    },

    /***
     * 设置当前编辑的工具类型
     * @param {String}type
     */
    setEditingType: function (type) {
        this.editType = type;
    },

    /***
     * 当前编辑工具
     */
    getCurrentTool: function () {
        return this.currentTool;
    },
    /***
     * 开始编辑
     * @param {fastmap.mapApi.Geometry}geometry 编辑的几何图形
     */
    startEditing: function (geometry) {
        this.currentEditinGeometry = geometry;
        this._tools(this.editType);
    },

    /***
     * 结束编辑 编辑的几何图形
     * @param {fastmap.mapApi.Geometry}geometry
     */
    stopEditing: function (geometry) {

    },

    /***
     * 放弃编辑
     */
    abortEditing: function () {

    },

    /***
     *
     * @param {fastmap.mapApi.Geometry}geometry
     */
    setEditingGeometry: function (geometry) {
        this.currentEditinGeometry = geometry
    },

    /***
     *
     * @returns {fastmap.mapApi.Geometry|*}
     */
    getEditingGeometry: function () {
        return this.currentEditinGeometry;
    },

    /***
     * 当前工具类型
     * @param {String}type
     * @returns {*}
     * @private
     */
    _tools: function (type) {
        this.currentTool = null;
        switch (type) {
            case 'pathcopy':
                this.currentTool = this.shapeEditorToolsObj['pathcopy'];
                break;
            case  'deletePoint':
                this.currentTool = function (line, point) {
                    line.deletePoint(point);
                }
                break;
            case  'reShape':
                this.currentTool = function (line) {
                    line.reShape();
                }
                break;
            case  'insertVetex':
                this.currentTool = function (line, point) {
                    line.insertVertex(point);
                }
                break;
            case 'movePoint':
                this.currentTool = function (line, point) {
                    line.movePoint(point);
                }
                break;
            case 'extendLine':
                this.currentTool = function (line, point) {
                    line.extendLine(point);
                }
                break;
            case 'breakLine':
                this.currentTool = function (line, point) {
                    this.callback = line.breakLine(point);
                }
                break;
            case 'copyGeometry':
                this.currentTool = function (geometry) {
                    this.geometry.copy();
                }
                break;
            case 'mergeLine':
                this.currentTool = function (line, line) {
                    line.merge(line);
                }
                break;
            case 'moveLine':
                this.currentTool = function (line, distance) {
                    line.move(distance);
                }
                break;
            case 'cutline':
                this.currentTool = function (line) {
                    line.cut();
                }
                break;
            case 'movePoint':
                this.currentTool = function (point, distance) {
                    point.move(distance);
                }
                break;
            case 'movePolygon':
                this.currentTool = function (polygon, distance) {
                    polygon.move(distance);
                }


                return this.currentTool;
        }
    }
});

fastmap.uikit.shapeEditorControllerSingleton=(function() {
    var instantiated;
    function init(options) {
        return new fastmap.uikit.ShapeEditorController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();

fastmap.uikit.shapeEditorController= function (options) {
    return new fastmap.uiKit.shapeEditorControllerSingleton(options);
};
