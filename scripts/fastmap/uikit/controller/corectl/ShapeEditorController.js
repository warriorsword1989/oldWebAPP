/**
 * Created by zhongxiaoming on 2015/9/10.
 * Class ShapeEditorController 单例
 */

fastmap.uikit.ShapeEditorController=(function() {

    var instantiated;
    function init(options) {
        var shapeEditorController = L.Class.extend({
            /**s
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
                this.map = null;
                this.editType = this.options.editType || '';
                this.currentEditinGeometry = {};
                this.currentTool = {"disable":function(){return -1;}};
                this.shapeEditorResultFeedback = new fastmap.uikit.ShapeEditResultFeedback({shapeEditor:this});
                this.shapeEditorResult = this.options.shapeEditorResult || new fastmap.uikit.ShapeEditorResult();

            },

            /***
             * 设置地图对象
             * @param map
             */
            setMap:function(map){
                this.map = map;
            },

            /***
             * 设置当前编辑的工具类型
             * @param {String}type
             */
            setEditingType: function (type) {
                this.stopEditing();
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
            startEditing: function () {
                //this.shapeEditorResult = shapeEditorResult;
                this.currentEditinGeometry = this.shapeEditorResult.getFinalGeometry();
                this._tools(this.editType);
            },

            /***
             * 结束编辑 编辑的几何图形
             * @param {fastmap.mapApi.Geometry}geometry
             */
            stopEditing: function () {
                if(this.currentTool.disable()==-1){

                }else{
                    this.shapeEditorResultFeedback.stopFeedback();
                }

            },

            /***
             * 放弃编辑
             */
            abortEditing: function () {
                this.shapeEditorResultFeedback.abortFeedback();
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
            /**
             * 不在editorLayer中使用的工具
             * @param type
             * @param options
             */
             toolsSeparateOfEditor: function (type, options) {
                this.editType = type;
                this.currentTool = new fastmap.uikit.CrossingAdd(options);
                this.currentTool.enable();
             },
            /***
             * 当前工具类型
             * @param {String}type
             * @returns {*}
             * @private
             */
            _tools: function (type) {
                this.currentTool = null;
                var toolsObj  = fastmap.uikit.shapeeditorfactory({shapeEditor:this}).toolObjs;
                this.currentTool = toolsObj[type];
                this.currentTool.enable();
            }
        });
        return  new shapeEditorController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})();
