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
                    this.currentTool = {};

                    this.shapeEditorToolsObj = fastmap.uikit.shapeeditorfactory();
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
                    this.currentTool.disable();
                    this.shapeEditorResultFeedback.stopFeedback();
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

                /***
                 * 当前工具类型
                 * @param {String}type
                 * @returns {*}
                 * @private
                 */
                _tools: function (type) {
                    this.currentTool = null;
                    var toolsObj = this.shapeEditorToolsObj.CreateShapeToolsObject(this);
                    switch (type) {
                        case 'pathcopy':
                            this.currentTool = this.shapeEditorToolsObj['pathcopy'];
                            break;
                        case 'pathBreak':
                            this.currentTool = toolsObj[type];
                            this.currentTool.enable();
                            break;
                        case  'pathVertexReMove':
                            this.currentTool = toolsObj[type];
                            this.currentTool.enable();
                            break;
                        case  'pathVertexAdd':
                            this.currentTool = toolsObj[type];
                            this.currentTool.enable();
                            break;
                        case  'reShape':
                            this.currentTool = function (line) {
                                line.reShape();
                            }
                            break;
                        case  'pathVertexInsert':
                            this.currentTool = toolsObj[type];
                            this.currentTool.enable();
                            break;
                        case 'pathVertexMove':
                            this.currentTool = toolsObj[type];
                            this.currentTool.enable();
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
        return  new shapeEditorController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }

})();
