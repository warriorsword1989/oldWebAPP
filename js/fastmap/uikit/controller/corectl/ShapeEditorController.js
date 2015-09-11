/**
 * Created by zhongxiaoming on 2015/9/10.
 */
define(['js/fastmap/fastmap'], function (fastmap) {
    fastmap.uiKit.ShapeEditorController = L.Class.extend({
        options: {
        },

        initialize: function (options) {
            this.options = options || {};
            L.setOptions(this, options);
            this.map = options.map || null;
            this.editType = options.editType || '';
            this.currentEditinGeometry = null;
        },

        startEditing:function(geometry){
            this.currentEditinGeometry = geometry;
            this._tools(this.editType);
        },

        stopEditing:function(geometry){

        },

        _tools:function(type){
            this.callback = null;
            switch (type){
                case 'splitLine':
                    this.callback = function(line, splitpoint){
                        line.split(splitpoint);
                    };
                    break;
                case  'deletePoint':
                    this.callback = function(line,point){
                        line.deletePoint(point);
                    }
                    break;
                case  'reShape':
                    this.callback = function(line){
                        line.reShape();
                    }
                    break;
                case  'insertVetex':
                    this.callback = function(line, point){
                        line.insertVertex(point);
                    }
                    break;
                case 'movePoint':
                    this.callback = function(line,point){
                        line.movePoint(point);
                    }
                    break;
                case 'extendLine':
                    this.callback = function(line, point){
                        line.extendLine(point);
                    }
                    break;
                case 'breakLine':
                    this.callback = function(line, point){
                        this.callback = line.breakLine(point);
                    }
                    break;
                case 'copyGeometry':
                    this.callback = function(geometry){
                        this.geometry.copy();
                    }
                    break;
                case 'mergeLine':
                    this.callback = function(line,line){
                        line.merge(line);
                    }
                    break;
                case 'moveLine':
                    this.callback = function(line,distance){
                        line.move(distance);
                    }
                    break;
                case 'cutline':
                    this.callback = function(line){
                        line.cut();
                    }
                    break;
                case 'movePoint':
                    this.callback = function(point, distance){
                        point.move(distance);
                    }
                    break;
                case 'movePolygon':
                    this.callback = function(polygon, distance){
                        polygon.move(distance);
                    }


                return this.callback;
            }
        }
    });
});